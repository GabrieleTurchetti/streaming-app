import './App.css';
import { useState, useEffect, createContext } from 'react'
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { updateDoc, getDoc, doc, arrayUnion, arrayRemove } from "firebase/firestore"
import { db, auth } from './firebase.js'
import { isMobile } from 'react-device-detect'
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
import Verification from './pages/verification'
import ChangePassword from './pages/changePassword'

export const UserContext = createContext({
    logged: false,
    id: "",
    email: "",
    nickname: "",
    pic: 0,
    saved: [] as {[id: number]: string},
    joined: "",
    verified: false
})

export const SavedTitlesContext = createContext({
    add: (id: number, type: string) => {},
    remove: (id: number, type: string) => {}
})

export interface User {
    logged: boolean,
    id: string,
    email: string,
    nickname: string,
    pic: number,
    saved: {[id: number]: string},
    joined: string,
    verified: boolean
}

export default function App() {
    const [navbarDisplay, setNavbarDisplay] = useState(true)
    const [searchName, setSearchName] = useState("")
    const location = useLocation()
    const navigate = useNavigate()

    const [user, setUser] = useState({
        logged: localStorage.getItem("logged") !== null ? localStorage.getItem("logged") === "true" : false,
        id: "",
        email: "",
        nickname: "",
        pic: parseInt(localStorage.getItem("pic") || "0"),
        saved: [] as {[id: number]: string},
        joined: "",
        verified: false
    })

    const [navbarSection, setnavbarSection] = useState({
        home: false,
        film: false,
        series: false
    })

    useEffect(() => {
        if (location.pathname === "/search") {
            navigate("/")
        }

        auth.onAuthStateChanged(async user => {
            const docRef = doc(db, "users", user?.uid || "")
            const docSnap = await getDoc(docRef)

            if (user) {
                changeUser({
                    logged: true,
                    id: user.uid,
                    email: user.email || "",
                    nickname: docSnap.data()?.nickname,
                    pic: docSnap.data()?.pic,
                    saved: docSnap.data()?.saved,
                    joined: docSnap.data()?.joined,
                    verified: user.emailVerified
                })
            }
        })

        if (isMobile) {
            let root = document.querySelector(":root") as HTMLElement
            root.style.setProperty("--slider-items", "1.5")
        }
    }, [])

    useEffect(() => {
        if (searchName !== "" && location.pathname !== "/search") {
            navigate("/search")
        }

        if (searchName === "" && location.pathname === "/search"){
            navigate(-1)
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
                setnavbarSection({
                    home: true,
                    film: false,
                    series: false
                })

                break

            case "/film":
                setnavbarSection({
                    home: false,
                    film: true,
                    series: false
                })

                break

            case "/series":
                setnavbarSection({
                    home: false,
                    film: false,
                    series: true
                })

                break

            default:
                setnavbarSection({
                    home: false,
                    film: false,
                    series: false
                })
        }
    }, [location])

    async function changeProfilePicNumber(profilePicNumber: number) {
        const docRef = doc(db, "users", user.id)

        await updateDoc(docRef, {
            pic: profilePicNumber
        })

        setUser(prev => ({
            ...prev,
            pic: profilePicNumber
        }))

        localStorage.setItem("pic", String(profilePicNumber))
    }

    function changeUser(user: User) {
        setUser({
            logged: user.logged,
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            pic: user.pic,
            joined: user.joined,
            saved: user.saved,
            verified: user.verified
        })

        localStorage.setItem("pic", String(user.pic))
        localStorage.setItem("logged", String(user.logged))
    }

    async function addSavedTitle(id: number, type: string) {
        const docRef = doc(db, "users", user.id)
        const docSnap = await getDoc(docRef)
        const userSaved = docSnap.data()?.saved

        if (!(id in userSaved)) {
            userSaved[id] = type

            await updateDoc(docRef, {
                saved: userSaved
            })

            setUser(prev => ({
                ...prev,
                saved: userSaved
            }))
        }
    }

    async function removeSavedTitle(id: number) {
        const docRef = doc(db, "users", user.id)
        const docSnap = await getDoc(docRef)
        const userSaved = docSnap.data()?.saved

        if (id in userSaved) {
            delete userSaved[id]

            await updateDoc(docRef, {
                saved: userSaved
            })

            setUser(prev => ({
                ...prev,
                saved: userSaved
            }))
        }
    }

    return (
        <UserContext.Provider value={user}>
            {navbarDisplay && <>
                <Navbar
                    navbarSection = {navbarSection}
                    changeSearchName = {(name: string) => setSearchName(name)}
                    changeUser = {changeUser}
                />
                <div className="h-16"></div>
            </>}
            <SmoothScroll>
                <SavedTitlesContext.Provider value={{
                    add: addSavedTitle,
                    remove: removeSavedTitle
                }}>
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
                        <Route path="/register" element={<Register />} />
                        <Route path="/verification" element={<Verification />} />
                        <Route path="/change-password" element={<ChangePassword />} />
                    </Routes>
                </SavedTitlesContext.Provider>
            </SmoothScroll>
        </UserContext.Provider>
    );
}