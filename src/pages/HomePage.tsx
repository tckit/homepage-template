import { IJson, IUser } from "../services/data"

type homepageProps = {
    user: IUser
}

export default function HomePage({ user }: homepageProps) {
    return (
        <div className="flex flex-col flex-auto mx-auto text-center text-neutral-300">
            <section className="bg-gray-900 py-4">
                <span
                    className={`absolute bg-cover bg-no-repeat right-4 w-10 h-10`}
                    style={{ backgroundImage: `url(${user.homeBackground.about})` }}
                >
                </span>
                <h1 className="font-bold mb-2 text-lg">
                    Welcome to my home page
                </h1>
                <p className="text-justify px-20 py-3">
                    {user.about}
                </p>
            </section>
            <section className="bg-gray-800 py-4">
                <span
                    className={`absolute bg-cover bg-no-repeat right-4 w-10 h-10`}
                    style={{ backgroundImage: `url(${user.homeBackground.experiences})` }}
                >
                </span>
                <h2 className="font-bold mb-2 text-lg">
                    Experiences
                </h2>
                {
                    user.experiences.map((exp: IJson) => {
                        return (
                            <details key={exp.title}>
                                <summary>
                                    {exp.title}
                                </summary>
                                <p className="text-justify px-20 py-3">
                                    {exp.description}
                                </p>
                            </details>
                        )
                    })
                }
            </section>
            <section className="bg-gray-900 py-4">
                <span
                    className={`absolute bg-cover bg-no-repeat right-4 w-10 h-10`}
                    style={{ backgroundImage: `url(${user.homeBackground.projects})` }}
                >
                </span>
                <h2 className="font-bold mb-2 text-lg">
                    Projects
                </h2>
                {
                    user.projects.map((proj: IJson) => {
                        return (
                            <details key={proj.title}>
                                <summary>
                                    {proj.title}
                                </summary>
                                <p className="text-justify px-20 py-3">
                                    {proj.description}
                                </p>
                            </details>
                        )
                    })
                }
            </section>
            <section className="bg-gray-800 py-4">
                <span
                    className={`absolute bg-cover bg-no-repeat right-4 w-10 h-10`}
                    style={{ backgroundImage: `url(${user.homeBackground.skills})` }}
                >
                </span>
                <h2 className="font-bold mb-2 text-lg">
                    Skills
                </h2>
                {
                    user.skills.map((skill: IJson) => {
                        return (
                            <details key={skill.title}>
                                <summary>
                                    {skill.title}
                                </summary>
                                <p className="text-justify px-20 py-3">
                                    {skill.description}
                                </p>
                            </details>
                        )
                    })
                }
            </section>
        </div>
    )
}