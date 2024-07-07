import { Link } from "react-router-dom"
import logo from "../assets/stickman.png"

type NavbarProps = {
  username: string | undefined
  isLoggedIn: boolean
}

function Navbar(props: NavbarProps) {
  return (
    <nav className="h-16 bg-blue-300 flex justify-between items-center pl-5">
      <Link to="/">
        <img src={logo} alt="logo" className="h-14" />
      </Link>
      <div>
        <ul>
          <li className="inline mr-8">
            <Link to="/" className="list-link">Home</Link>
          </li>
          <li className="inline mr-8">
            <Link to="/contact">Contact</Link>
          </li>
          <li className="inline mr-8">
            {
              props.isLoggedIn
                ?
                <Link to={`/user/${props.username}`}>
                  {`Hello ${props.username}`}
                </Link>
                :
                <Link to="/login">
                  Login
                </Link>
            }
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar