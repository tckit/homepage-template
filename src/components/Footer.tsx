import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <>
            <nav className="h-16 bg-blue-300 flex place-items-center place-content-center">
                <span className="mr-5">&#169; tckit 2024</span>
                <div>
                    <ul className="flex gap-x-5">
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/contact">Contact</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}