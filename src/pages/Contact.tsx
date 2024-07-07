import { useState } from "react"

type onChangeEvent = {
    target: HTMLInputElement | HTMLTextAreaElement
}

export default function Contact(props: { [key: string]: any }) {
    const [formData, setFormData] = useState({
        email: "",
        desc: "",
    })
    const [submitted, setSubmitted] = useState(false)

    function changeText(evt: onChangeEvent) {
        const input = evt.target
        setFormData(prevData => ({
            ...prevData,
            [input.name]: input.value
        }))
    }

    function sendEnquiry(evt: React.MouseEvent<HTMLButtonElement>) {
        evt.preventDefault()
        fetch("http://localhost:3000/sendEnquiry", {
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
                    setSubmitted(true)
                }
            })
    }

    return (
        <div className="container mx-auto text-neutral-100">
            <section className="w-3/5 mx-auto py-4">
                <h1 className="text-center">Contact me through:</h1>
                <ul className="flex flex-auto flex-col gap-8 mb-4 mt-2">
                    <li>
                        Email: {props.email}
                    </li>
                    <li>
                        Phone number: {props.phoneNumber}
                    </li>
                    <li>
                        Linkedin: {props.linkedinUrl}
                    </li>
                    <li>
                        Residence: {props.country}
                    </li>
                </ul>
            </section>
            <section className="flex flex-col gap-4 w-3/5 mx-auto">
                <h2 className="text-center">...or you can contact me here!</h2>
                <input
                    type="text"
                    name="email"
                    onChange={changeText}
                    value={formData.email}
                    placeholder="Your email address"
                    className="h-7"
                />
                <textarea
                    name="desc"
                    onChange={changeText}
                    value={formData.desc}
                    placeholder="Desc..."
                    className="h-24 resize-none"
                >
                </textarea>
                <button
                    type="button"
                    className="bg-blue-600 h-8 rounded"
                    onClick={sendEnquiry}>
                    Send
                </button>
                {submitted && <p className="text-center pb-4">Submitted successfully</p>}
            </section>
        </div>
    )
}