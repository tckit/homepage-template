type UserObject = {
    title?: string
    description?: string
    [key: string]: any
}

type UserBackground = {
    about?: string
    experiences?: string
    projects?: string
    skills?: string
    [key: string]: any
}

type UserPayload = {
    id: number
    username: string
}

interface IUser {
    id: number
    username: string
    password: string
    email?: string
    phoneNumber?: string
    linkedinUrl?: string
    about?: string
    country?: string
    experiences: UserObject[]
    projects: UserObject[]
    skills: UserObject[]
    // correspond to each section of background image
    homeBackground: UserBackground
    [key: string]: any
}

interface IJson {
    [key: string]: string
}

const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur malesuada imperdiet pharetra. Phasellus et viverra neque. Nam urna mauris, laoreet quis ante eu, rhoncus commodo metus. Cras orci neque, aliquam at nulla eget, fermentum facilisis nisl. Nulla lobortis non odio ac auctor. Duis finibus molestie erat ac tempus. Proin vel facilisis mi, ut placerat sapien. In vitae nibh risus. Ut non massa sit amet arcu pharetra iaculis ut eu nibh."
const defaultUser = {
    id: 0,
    username: "yourUsername",
    password: "",
    email: "yourEmail@mail.com",
    phoneNumber: "+0123456789",
    linkedinUrl: "linkedin/in/username",
    about: lorem,
    country: "Malaysia",
    experiences: [
        {
            title: "Chef",
            description: lorem
        }
    ],
    projects: [
        {
            title: "Moon with Earth",
            description: lorem
        }
    ],
    skills: [
        {
            title: "Creating bugs",
            description: lorem
        }
    ],
    homeBackground: {
        about: "/vite.svg",
        experiences: "/stickman.png",
    },
}

const users: IUser[] = [defaultUser]

export { users }
export { defaultUser }
export type { IUser, IJson, UserPayload }
