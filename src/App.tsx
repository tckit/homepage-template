import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import Contact from './pages/Contact'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { defaultUser, IUser } from './services/data'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import UserInfo from './pages/UserInfo'

function App() {
  const [user, setUser] = useState<IUser>(() => {
    console.log("Fetched default user")
    return defaultUser
  })
  const [accessToken, setAccessToken] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // get cookies / access token
    const cookies = document.cookie.split(";")
    const cookie = cookies.find(cookie => {
      cookie = cookie.trim()
      return cookie.startsWith("id")
    })
    if (cookie !== undefined) {
      const token = cookie.slice(cookie.indexOf("=") + 1)
      setAccessToken(token)
      setIsLoggedIn(true)
    }
    else if (user.id) {
      // cookie expired, get new cookie
      fetch(`http://localhost:3000/refreshAccessToken/${user.id}`)
        .then(res => res.json())
        .then(res => {
          if (res.success) {
            // specify Domain such as abc.com
            // Specify HttpOnly to disallow JS access
            // Consider creating cookie on server-side
            setAccessToken(res.accessToken)
            document.cookie = `id=${res.accessToken}; Secure; SameSite=Strict; max-age=${res.expiresIn};`
            setIsLoggedIn(true)
          }
          else {
            document.cookie = 'id=; Max-Age=0;';
            setAccessToken("")
            setIsLoggedIn(false)
            setUser(defaultUser)
          }
        })
        .catch(err => console.log(err))
    }
  }, [location])

  useEffect(() => {
    if (accessToken) {
      // get user data from server
      fetch(`http://localhost:3000/users/${accessToken}`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      })
        .then(res => {
          if (res.status !== 200) {
            throw new Error("Clear cookies")
          }
          return res.json()
        })
        .then(res => {
          setUser(res)
        })
        .catch(_ => {
          // remove cookies if access token is invalid
          document.cookie = 'id=; Max-Age=0;'
          window.location.reload()
        })
      console.log("Fetched user with access token")
    }
  }, [accessToken])

  // ensure empty user dont get passed to props
  if (Object.keys(user).length === 0) {
    return <>Loading...</>
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar
        username={user.username}
        isLoggedIn={isLoggedIn}
      />
      <div className='flex flex-auto bg-gradient-to-b from-gray-800 to-gray-900'>
        <Routes>
          <Route path="/" element={
            <HomePage
              user={user}
            />
          }
          />
          <Route path="/contact" element={
            <Contact
              email={user.email}
              phoneNumber={user.phoneNumber}
              linkedinUrl={user.linkedinUrl}
              country={user.country}
            />
          }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/user/:username" element={
            <UserInfo
              user={user}
              accessToken={accessToken}
            />
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App