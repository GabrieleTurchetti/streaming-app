import './App.css';
import { useState, useEffect, createContext } from 'react'
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { updateDoc, doc } from "firebase/firestore"
import { db } from './firebase'
import Home from './pages/home'
import Film from './pages/film'
import Series from './pages/series'
import Search from './pages/search'
import Watch from './pages/watch'
import Navbar from './components/navbar'
import Title from './pages/title'
import SmoothScroll from './components/smoothScroll'
import Profile from './pages/profile'
import Login from './pages/login'
import Register from './pages/register'

export const UserContext = createContext({
    logged: false,
    id: "",
    email: "",
    nickname: "",
    pic: 0,
    saved: [],
    joined: ""
})

export default function App() {
    const [navbarDisplay, setNavbarDisplay] = useState(true)
    const [searchName, setSearchName] = useState("")
    const [prevPage, setPrevPage] = useState("")
    const location = useLocation()
    const navigate = useNavigate()

    const [user, setUser] = useState({
        logged: false,
        id: "",
        email: "",
        nickname: "",
        pic: 0,
        saved: [],
        joined: ""
    })

    const [navbarSection, setNavbarSection] = useState({
        home: false,
        film: false,
        series: false
    })

    useEffect(() => {
        if (location.pathname === "/search") {
            navigate("/")
        }
    }, [])

    useEffect(() => {
        if (searchName !== "") {
            if (location.pathname !== "/search") {
                setPrevPage(location.pathname)
                navigate("/search")
            }
        }
        else if (prevPage !== "" && location.pathname === "/search"){
            navigate(prevPage)
        }
    }, [searchName])

    useEffect(() => {
        if (location.pathname.startsWith("/film/watch") || location.pathname.startsWith("/series/watch")) {
            setNavbarDisplay(false)
        }
        else {
            setNavbarDisplay(true)
        }

        switch (location.pathname) {
            case "/":
                setNavbarSection({
                    home: true,
                    film: false,
                    series: false
                })

                break

            case "/film":
                setNavbarSection({
                    home: false,
                    film: true,
                    series: false
                })

                break

            case "/series":
                setNavbarSection({
                    home: false,
                    film: false,
                    series: true
                })

                break

            default:
                setNavbarSection({
                    home: false,
                    film: false,
                    series: false
                })
        }
    }, [location])

    function changeSearchName() {
        let searchBar = document.getElementById("search-bar") as HTMLInputElement

        if (searchBar !== null) {
            setSearchName(searchBar.value)
        }
    }

    async function changeProfilePicNumber(profilePicNumber: number) {
        const docRef = doc(db, "users", user.id)

        await updateDoc(docRef, {
            pic: profilePicNumber
        })

        setUser(prev => ({
            ...prev,
            pic: profilePicNumber
        }))
    }

    function changeUser(id: string, email: string, nickname: string, pic: number, saved: any, joined: string) {
        setUser({
            logged: true,
            id: id,
            email: email,
            nickname,
            pic: pic,
            saved: saved,
            joined: joined
        })
    }

    return (
        <UserContext.Provider value={user}>
            {navbarDisplay && <>
                <Navbar
                    navbarSection = {navbarSection}
                    changeSearchName = {changeSearchName}
                />
                <div className="h-16"></div>
            </>}
            <SmoothScroll>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/film" element={<Film />} />
                    <Route path="/series" element={<Series />} />
                    <Route path="/:type/title/:id" element={<Title />} />
                    <Route path="/:type/watch/:id" element={<Watch />} />
                    <Route path="/search" element={<Search
                        searchName = {searchName}
                    />} />
                    <Route path="/profile" element={<Profile
                        changeProfilePicNumber = {changeProfilePicNumber}
                    />} />
                    <Route path="/login" element={<Login
                        changeUser = {changeUser}
                    />} />
                    <Route path="/register" element={<Register
                        changeUser = {changeUser}
                    />} />
                </Routes>
            </SmoothScroll>
        </UserContext.Provider>
    );
}