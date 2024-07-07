import { Request, Response, NextFunction } from "express"
import { IUser, UserPayload, users } from "./data.js"
import nodemailer from "nodemailer"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// used for receiving enquiry
const ADMIN_CRED = {
    user: "dora.morar17@ethereal.email",
    pass: "KaGgMUzD16TdT6MvPB"
}

// private keys
const ACCESS_TOKEN = "myprivateaccesstoken"
const REFRESH_TOKEN = "myprivaterefreshtoken"

// store refresh token for each user
const refreshTokens: { id: number, refreshToken: string }[] = []

// Example input: accessToken: 10, refreshToken: 10s
const accessTokenExpiry = "3600"
const refreshTokenExpiry = String(3600 * 6)

function sendEnquiry(req: Request, res: Response) {
    // check out documentation for SMTP server
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
            user: ADMIN_CRED.user,
            pass: ADMIN_CRED.pass
        }
    })

    const body = req.body
    const message = {
        from: body.email,
        to: `receiverName: ${ADMIN_CRED.user}`,
        subject: "Using ethereal fake smtp server",
        text: body.desc,
        html: `<small>${body.desc}</small>`
    }

    transporter.sendMail(message)
    res.status(200).json({ success: true })
}

function getUser(req: Request, res: Response) {
    const userPayload = req.userPayload
    if (userPayload == null) {
        return res.sendStatus(403)
    }

    // id is used as access token
    const user = users.find(user => user.id === Number(userPayload.id))
    if (user === undefined) {
        return res.sendStatus(404)
    }
    res.status(200).send(user)
}

function getDefaultUser(_req: Request, res: Response) {
    res.send(users[0])
}

function editUserInfo(req: Request, res: Response) {
    const userPayload = req.userPayload
    if (userPayload == null) {
        return res.sendStatus(403)
    }

    // update database 
    const editedUser = req.body
    const userIndex = users.findIndex(user => user.id === userPayload.id)
    users[userIndex] = editedUser
    res.status(204).send({ success: true })
}

async function registerUser(req: Request, res: Response) {
    const user = users.find(user => user.username === req.body.username)
    if (user) {
        return login(req, res)
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    // get new highest id and add to database
    const newUser = {
        ...users[0],
        ...req.body,
        password: hashedPassword,
        id: users[users.length - 1].id! + 1
    }
    users.push(newUser)

    // generate refresh token and return access token to client
    const payload = {
        username: newUser.username,
        id: newUser.id
    }
    generateRefreshToken(payload)
    const accessToken = generateAccessToken(payload)
    res.status(201).send({ success: true, token: accessToken, expiresIn: accessTokenExpiry })
}

async function login(req: Request, res: Response) {
    const user = users.find(user => user.username === req.body.username)
    if (!user) {
        return res.status(400).send({ success: false })
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            // generate refresh token and return access token to client
            generateRefreshToken(user)
            const accessToken = generateAccessToken(user)
            res.status(200).send({ success: true, token: accessToken, expiresIn: accessTokenExpiry })
        } else {
            res.status(403).send({ success: false })
        }
    } catch {
        res.status(500).send()
    }

}

function authenticateUser(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"]
    // Bearer XXX
    let accessToken = authHeader && authHeader.split(" ")[1]
    if (accessToken == null) {
        console.log("Authorization not found")
        return res.sendStatus(403)
    }

    try {
        const user = jwt.verify(accessToken, ACCESS_TOKEN)
        req.userPayload = user as UserPayload
    } catch {
        console.log("Access token invalid")
        return res.status(403).send()
    }
    next()
}

function refreshAccessToken(req: Request, res: Response) {
    const userId = Number(req.params.id)
    const refreshTokenObj = refreshTokens.find(token => token.id === userId)
    if (refreshTokenObj) {
        try {
            const payload = jwt.verify(refreshTokenObj.refreshToken, REFRESH_TOKEN)
            const accessToken = generateAccessToken(payload as UserPayload)
            console.log("Refreshed access token")
            return res.status(200).send({ success: true, accessToken: accessToken, expiresIn: accessTokenExpiry })
        } catch (err) {
            console.log("Refresh token expired")
            // remove expired refresh token
            const index = refreshTokens.findIndex(token => token.id === refreshTokenObj.id)
            refreshTokens.splice(index, 1)
            return res.status(400).send({ success: false })
        }
    } else {
        // can create a new refresh token here and its access token
        return res.status(400).send({ success: false })
    }
}

function generateAccessToken(user: IUser | UserPayload) {
    const payload: UserPayload = {
        id: user.id,
        username: user.username,
    }
    return jwt.sign(payload, ACCESS_TOKEN, { expiresIn: `${accessTokenExpiry}s` })
}

function generateRefreshToken(user: IUser | UserPayload) {
    console.log("Generating new refresh token")
    // remove previous refresh token
    const prevTokenIndex = refreshTokens.findIndex(token => token.id === user.id)
    if (prevTokenIndex !== -1) {
        refreshTokens.splice(prevTokenIndex, 1)
    }

    const payload: UserPayload = {
        id: user.id,
        username: user.username,
    }

    const refreshToken = jwt.sign(payload, REFRESH_TOKEN, { expiresIn: `${refreshTokenExpiry}s` })
    refreshTokens.push({
        id: payload.id,
        refreshToken: refreshToken
    })
    return refreshToken
}

function noRoute(_req: Request, res: Response) {
    res.status(404).send(users)
    // res.status(404).send("Are you on the right page?")
}

export {
    sendEnquiry,
    getUser,
    getDefaultUser,
    editUserInfo,
    registerUser,
    login,
    authenticateUser,
    refreshAccessToken,
    noRoute
}