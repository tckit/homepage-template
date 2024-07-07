import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"

type onChangeEvent = {
    target: HTMLInputElement
}

function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })
    const [userExists, setUserExists] = useState(false)
    const navigate = useNavigate()

    function handleChange(evt: onChangeEvent) {
        const { name, value } = evt.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    function submitForm(evt: FormEvent) {
        evt.preventDefault();
        fetch("http://localhost:3000/login", {
            mode: "cors",
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.success) {
                    // specify Domain such as abc.com
                    // Specify HttpOnly to disallow JS access
                    // Consider creating cookie on server-side
                    document.cookie = `id=${res.token}; Secure; SameSite=Strict; max-age=${res.expiresIn};`
                    navigate("/", { state: { login: true } })
                } else {
                    setUserExists(true)
                }
            })
    }

    return (
        <div className="w-4/5 m-auto">
            <form className="flex flex-col gap-y-6">
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="username"
                    className="h-10 p-4"
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="password"
                    className="h-10 p-4"
                />
                <button
                    className="bg-blue-600 h-10 text-white rounded"
                    onClick={submitForm}>
                    Submit
                </button>
                {userExists 
                && <p className="text-white text-center">Incorrect username / password</p>
                }
            </form>
        </div>
    )
}

export default Login