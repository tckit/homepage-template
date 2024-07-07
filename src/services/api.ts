import express from "express"
const app = express()

import cors from "cors"

import {
    authenticateUser,
    editUserInfo,
    getDefaultUser,
    getUser,
    noRoute,
    refreshAccessToken,
    registerUser,
    sendEnquiry,
} from "./helper.js"

app.use(express.json())
app.use(cors())

// id is used as access token
app.get("/users/default", getDefaultUser)
app.get("/users/:id", authenticateUser, getUser)
app.put("/user/:id/editUserInfo", authenticateUser, editUserInfo)
app.post("/sendEnquiry", sendEnquiry)
app.post("/login", registerUser)
app.get("/auth/:id", authenticateUser)
app.get("/refreshAccessToken/:id", refreshAccessToken)
app.all("*", noRoute)

app.listen(3000)