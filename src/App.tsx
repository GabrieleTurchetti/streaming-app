import './App.css';
import { useState, useEffect, createContext } from 'react'
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import { updateDoc, getDoc, doc } from "firebase/firestore"
import { db, auth } from './firebase.js'
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

// oggetto contenente i dati dell'utente da condividere tra diversi componenti
export const UserContext = createContext({
    logged: false,
    id: "",
    email: "",
    nickname: "",
    pic: 0,
    joined: "",
    verified: false
})

export default function App() {
    const [navbarDisplay, setNavbarDisplay] = useState(true) // variabile di stato utilizzata per decidere se renderizzare la navabar o meno
    const [searchName, setSearchName] = useState("") // variabile di stato contenente il nome del titolo da cercare
    const [prevPage, setPrevPage] = useState("") // variabile di stato contenente l'URL della pagina precedente a cui fare ritorno una volta che il valore della search bar è nullo
    const location = useLocation() // oggetto contenente le informazioni dell'URL
    const navigate = useNavigate() // funzione utilizzata per spostarsi da una pagina all'altra

    // variabile di stato contenente i dati effettivi dell'utente
    const [user, setUser] = useState({
        logged: localStorage.getItem("logged") !== null ? localStorage.getItem("logged") === "true" : false,
        id: "",
        email: "",
        nickname: "",
        pic: parseInt(localStorage.getItem("pic") || "0"),
        joined: "",
        verified: false
    })

    // variabile di stato utilizzata per decidere quale nome della pagina mettere in risalto
    const [navbarSection, setnavbarSection] = useState({
        home: false,
        film: false,
        series: false
    })

    useEffect(() => {
        if (location.pathname === "/search") {
            navigate("/")
        }

        // funzione che imposta i dati dell'utente se precedentemente ha effettuato il login
        auth.onAuthStateChanged(async user => {
            const docRef = doc(db, "users", user?.uid || "")
            const docSnap = await getDoc(docRef)

            if (user) {
                changeUser(true, user.uid, user.email || "", docSnap.data()?.nickname, docSnap.data()?.pic, docSnap.data()?.joined, user.emailVerified)
            }
        })
    }, [])

    useEffect(() => {
        // gestisce il ritorno alla pagina precedente al cambiare del valore della search bar
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
        // gestisce la visualizzazione della navbar in base alla pagina corrente
        if (location.pathname.startsWith("/film/watch") || location.pathname.startsWith("/series/watch")) {
            setNavbarDisplay(false)
        }
        else {
            setNavbarDisplay(true)
        }

        // mette in evidenza il nome della pagina corrente
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

    // funzione che aggiorna la foto di profilo dell'utente
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

    // funzione che imposta i dati dell'utente
    function changeUser(logged: boolean, id: string, email: string, nickname: string, pic: number, joined: string, verified: boolean) {
        setUser({
            logged: logged,
            id: id,
            email: email,
            nickname,
            pic: pic,
            joined: joined,
            verified: verified
        })

        localStorage.setItem("pic", String(pic))
        localStorage.setItem("logged", String(logged))
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
            </SmoothScroll>
        </UserContext.Provider>
    );
}