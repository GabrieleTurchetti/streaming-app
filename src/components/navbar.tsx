import logo from '../images/logo.svg'
import search from '../images/search.svg'
import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase.js'
import { isMobile } from 'react-device-detect'

interface Props {
    navbarSection: {
        home: boolean,
        film: boolean,
        series: boolean
    },
    changeSearchName: () => void
    changeUser: (logged: boolean, id: string, email: string, nickname: string, pic: number, joined: string, verified: boolean) => void
}

export default function Navbar({ navbarSection, changeSearchName, changeUser }: Props) {
    const [searchDisplay, setSearchDisplay] = useState(false) // variabile di stato che gestisce la visibilità della search bar
    const user = useContext(UserContext) // oggetto contenente le informazioni dell'utente
    const navigate = useNavigate() // funzione utilizzata per spostarsi da una pagina all'altra

    // funzione che effettua il logout tramite la procedura di Firebase e la cancellazione delle informazioni riguardanti l'utente nel sito
    function logout() {
        signOut(auth).then(() => {
            changeUser(false, "", "", "", 0, "", false)
            navigate("/")
        }).catch(error => {
            alert(error.message)
        })
    }

    return (
        <div id="navbar" className={`flex h-16 ${isMobile ? "px-6" : "px-16"} justify-between items-center fixed w-full z-20 gap-8`}>
            {(!isMobile || !searchDisplay) && <div className={`flex items-center ${isMobile ? "gap-6" : "gap-8"}`}>
                <Link to="/">
                    <img src={logo} className="w-9 min-w-[2.25rem] cursor-pointer" />
                </Link>
                {!isMobile && <>
                    <Link to="/">
                        <p className={`navbar-section font-medium text-lg h-7 cursor-pointer ${navbarSection.home ? "navbar-section-active" : ""} hover:text-white transition-[color] duration-150`}>Home</p>
                    </Link>
                    <Link to="/film">
                        <p className={`navbar-section font-medium text-lg h-7 cursor-pointer ${navbarSection.film ? "navbar-section-active" : ""} hover:text-white transition-[color] duration-150`}>Film</p>
                    </Link>
                    <Link to="/series">
                        <p className={`navbar-section font-medium text-lg h-7 whitespace-nowrap cursor-pointer ${navbarSection.series ? "navbar-section-active" : ""} hover:text-white transition-[color] duration-150`}>Serie TV</p>
                    </Link>
                </>}
                {isMobile && <div className="w-20 flex gap-4 overflow-auto">
                    <Link to="/">
                        <p className={`navbar-section font-medium text-lg h-7 cursor-pointer ${navbarSection.home ? "navbar-section-active" : ""} hover:text-white transition-[color] duration-150`}>Home</p>
                    </Link>
                    <Link to="/film">
                        <p className={`navbar-section font-medium text-lg h-7 cursor-pointer ${navbarSection.film ? "navbar-section-active" : ""} hover:text-white transition-[color] duration-150`}>Film</p>
                    </Link>
                    <Link to="/series">
                        <p className={`navbar-section font-medium text-lg h-7 whitespace-nowrap cursor-pointer ${navbarSection.series ? "navbar-section-active" : ""} hover:text-white transition-[color] duration-150`}>Serie TV</p>
                    </Link>
                </div>}
            </div>}
            <div className={`flex items-center ${isMobile ? searchDisplay ? "w-full px-2" : "gap-1" : "gap-8"} transition-[gap] duration-300`}>
                {!isMobile && <div id="search" className={`flex items-center p-2 border gap-2 transition-[border-color] duration-300 ${searchDisplay ? "search-active" : ""}`}>
                    <img src={search} className="w-6 min-w-[1.5rem] cursor-pointer" onClick={() => {setSearchDisplay(!searchDisplay)}} />
                    <input id="search-bar" className={`w-0 bg-transparent text-white transition-[width] duration-300 ${searchDisplay ? "search-bar-active" : ""}`} type="text" placeholder="Cerca" autoComplete="off" onChange={changeSearchName} />
                </div>}
                {isMobile && <div id="search" className={`flex items-center p-2 border gap-2 ${searchDisplay ? "search-active w-full" : ""}`}>
                    <img src={search} className="w-6 min-w-[1.5rem] cursor-pointer" onClick={() => {setSearchDisplay(!searchDisplay)}} />
                    <input id="search-bar" className={`w-0 bg-transparent text-white ${searchDisplay ? "w-full" : ""}`} type="text" placeholder="Cerca" autoComplete="off" onChange={changeSearchName} />
                </div>}
                {(!isMobile || !searchDisplay) && <div id="navbar-profile-pic-container" className="py-4 flex justify-center items-center">
                    <div id="navbar-profile-pic" className={`relative w-9 h-9 profile-pic-${user.pic}`}>
                        <div id="navbar-account-option-container" className="absolute right-0 translate-y-12 border-[1px] text-white">
                            {user.logged && <>
                                <Link to="/profile" className="cursor-pointer">
                                    <p className="navbar-account-option px-4 py-[0.2rem] text-lg font-medium">Profilo</p>
                                </Link>
                                <div className="navbar-account-option cursor-pointer" onClick={logout}>
                                    <p className="navbar-account-option px-4 py-[0.2rem] text-lg font-medium">Esci</p>
                                </div>
                            </>}
                            {!user.logged && <>
                                <Link to="/login" className="cursor-pointer">
                                    <p className="navbar-account-option px-4 py-[0.2rem] text-lg font-medium">Accedi</p>
                                </Link>
                                <Link to="/register" className="navbar-account-option cursor-pointer">
                                    <p className="navbar-account-option px-4 py-[0.2rem] text-lg font-medium">Registrati</p>
                                </Link>
                            </>}
                        </div>
                        <div id="navbar-account-option-container-appendix" className="translate-y-10 translate-x-2 w-0 h-0" />
                    </div>
                </div>}
            </div>
        </div>
    )
}