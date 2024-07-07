import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/UserInfo.css"
import { IUser } from "../services/data";

type userProps = {
    user: IUser
    accessToken: string
}

function UserInfo({ user, accessToken }: userProps) {
    const [userData, setUserData] = useState(user)
    const { username } = useParams()
    const [userIsVerified, setUserIsVerified] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (accessToken) {
            fetch("http://localhost:3000/users/auth", {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
            })
                .then(res => {
                    if (res.status == 403) {
                        navigate("/login")
                    }
                    return res.json()
                })
                .then(_ => {
                    if (user.username == username) {
                        setUserIsVerified(true)
                        setUserData(user)
                    }
                })
        } else {
            setUserIsVerified(false)
        }

    }, [user])

    function handleChange(evt: ChangeEvent<HTMLInputElement>) {
        const { name, value } = evt.target
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    function handleExperienceChange(evt: ChangeEvent<HTMLInputElement>, index: number) {
        const { name, value } = evt.target
        setUserData(prevData => {
            const newUserData = structuredClone(prevData)
            newUserData.experiences[index][name] = value
            return newUserData
        })
    }

    function handleProjectChange(evt: ChangeEvent<HTMLInputElement>, index: number) {
        const { name, value } = evt.target
        setUserData(prevData => {
            const newUserData = structuredClone(prevData)
            newUserData.projects[index][name] = value
            return newUserData
        })
    }

    function handleSkillChange(evt: ChangeEvent<HTMLInputElement>, index: number) {
        const { name, value } = evt.target
        setUserData(prevData => {
            const newUserData = structuredClone(prevData)
            newUserData.skills[index][name] = value
            return newUserData
        })
    }

    function handleBackgroundChange(evt: ChangeEvent<HTMLInputElement>) {
        const { name, value } = evt.target
        setUserData(prevData => {
            const newUserData = structuredClone(prevData)
            newUserData.homeBackground[name] = value
            return newUserData
        })
    }

    function submitEditUserInfo(evt: React.MouseEvent<HTMLButtonElement>) {
        evt.preventDefault()
        fetch(`http://localhost:3000/user/${userData.id}/editUserInfo`, {
            method: "PUT",
            mode: "cors",
            body: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(_ => {
                console.log("reloaded")
                window.location.reload()
            })
    }

    if (!userIsVerified) {
        return;
    }

    return (
        <div className="flex flex-col m-auto w-3/5 text-white">
            <section>
                <h2 className="userinfo-heading">
                    About You
                </h2>
                <label className="userinfo-label">
                    Email
                    <input
                        type="text"
                        name="email"
                        className="userinfo-input"
                        onChange={handleChange}
                        value={userData.email}
                    />
                </label>
                <label className="userinfo-label">
                    Phone number
                    <input
                        type="text"
                        name="phoneNumber"
                        className="userinfo-input"
                        onChange={handleChange}
                        value={userData.phoneNumber}
                    />
                </label>
                <label className="userinfo-label">
                    Linkedin
                    <input
                        type="text"
                        name="linkedinUrl"
                        className="userinfo-input"
                        onChange={handleChange}
                        value={userData.linkedinUrl}
                    />
                </label>
                <label className="userinfo-label">
                    Residence
                    <input
                        type="text"
                        name="country"
                        className="userinfo-input"
                        onChange={handleChange}
                        value={userData.country}
                    />
                </label>
            </section>
            <section>
                <h2 className="userinfo-heading">
                    Experiences
                </h2>
                {
                    userData.experiences.map((_, index) =>
                        <div key={`exp${index}`}>
                            <label className="userinfo-label">
                                Title
                                <input
                                    type="text"
                                    name="title"
                                    className="userinfo-input"
                                    onChange={e => handleExperienceChange(e, index)}
                                    value={userData.experiences[index].title}
                                />
                            </label>
                            <label className="userinfo-label">
                                Description
                                <input
                                    type="text"
                                    name="description"
                                    className="userinfo-input"
                                    onChange={e => handleExperienceChange(e, index)}
                                    value={userData.experiences[index].description}
                                />
                            </label>
                        </div>
                    )
                }
            </section>
            <section>
                <h2 className="userinfo-heading">
                    Projects
                </h2>
                {
                    userData.projects.map((_, index) =>
                        <div key={`proj${index}`}>
                            <label className="userinfo-label">
                                Title
                                <input
                                    type="text"
                                    name="title"
                                    className="userinfo-input"
                                    onChange={e => handleProjectChange(e, index)}
                                    value={userData.projects[index].title}
                                />
                            </label>
                            <label className="userinfo-label">
                                Description
                                <input
                                    type="text"
                                    name="description"
                                    className="userinfo-input"
                                    onChange={e => handleProjectChange(e, index)}
                                    value={userData.projects[index].description}
                                />
                            </label>
                        </div>
                    )
                }
            </section>
            <section>
                <h2 className="userinfo-heading">
                    Skills
                </h2>
                {
                    userData.skills.map((_, index) =>
                        <div key={`skill${index}`}>
                            <label className="userinfo-label">
                                Title
                                <input
                                    type="text"
                                    name="title"
                                    className="userinfo-input"
                                    onChange={e => handleSkillChange(e, index)}
                                    value={userData.skills[index].title}
                                />
                            </label>
                            <label className="userinfo-label">
                                Description
                                <input
                                    type="text"
                                    name="description"
                                    className="userinfo-input"
                                    onChange={e => handleSkillChange(e, index)}
                                    value={userData.skills[index].description}
                                />
                            </label>
                        </div>
                    )
                }
            </section>
            <section>
                <h2 className="userinfo-heading">
                    Hompage Image Background
                </h2>
                {
                    Object.entries(userData.homeBackground).map(([key, _]) =>
                        <div key={`bg${key}`}>
                            <label className="userinfo-label">
                                {key} background url
                                <input
                                    type="text"
                                    name={key}
                                    className="userinfo-input"
                                    onChange={handleBackgroundChange}
                                    value={userData.homeBackground[key]}
                                />
                            </label>
                        </div>
                    )
                }
            </section>
            <button
                className="h-10 mx-4 mb-3 bg-blue-500 rounded"
                onClick={submitEditUserInfo}>
                Submit
            </button>
        </div>
    )
}

export default UserInfo;