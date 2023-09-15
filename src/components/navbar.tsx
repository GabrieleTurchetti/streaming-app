import logo from '../images/logo.svg'
import search from '../images/search.svg'
import menu from '../images/menu.svg'
import { useState, useContext, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase.js'
import { isMobile } from 'react-device-detect'
import { User } from '../App'

interface Props {
    navbarSection: {
        home: boolean,
        film: boolean,
        series: boolean
    },
    changeSearchName: (name: string) => void
    changeUser: (user: User) => void
}

export default function Navbar({ navbarSection, changeSearchName, changeUser }: Props) {
    const [searchBarDisplay, setSearchBarDisplay] = useState(false)
    const user = useContext(UserContext)
    const navigate = useNavigate()
    const searchBar = useRef<HTMLInputElement>(null)
    const [menuDisplay, setMenuDisplay] = useState(false)
    const [logoutConfirm, setLogoutConfirm] = useState(false)

    function logout() {
        signOut(auth).then(() => {
            changeUser({
                logged: false,
                id: "",
                email: "",
                nickname: "",
                pic: 0,
                saved: {},
                joined: "",
                verified: false
            })

            navigate("/")
        }).catch(error => {
            alert(error.message)
        })
    }

    return (
        <>
            <div id="navbar" className={`flex h-16 ${isMobile ? "px-6" : "px-16"} justify-between items-center fixed w-full z-20 gap-8`}>
                {(!isMobile || !searchBarDisplay) && <div className={`flex items-center ${isMobile ? "gap-6" : "gap-8"}`}>
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
                    {isMobile && <img src={menu} className="w-6" onClick={() => setMenuDisplay(true)} />}
                </div>}
                <div className={`flex items-center ${isMobile ? searchBarDisplay ? "w-full px-2" : "gap-1" : "gap-8"} transition-[gap] duration-300`}>
                    {!isMobile && <div id="search-bar" className={`flex items-center p-2 border gap-2 transition-[border-color] duration-300 ${searchBarDisplay ? "search-bar-active" : ""}`}>
                        <img src={search} className="w-6 min-w-[1.5rem] cursor-pointer" onClick={() => {setSearchBarDisplay(!searchBarDisplay)}} />
                        <input ref={searchBar} id="search-bar-input" className={`bg-transparent text-white transition-[width] duration-300 ${searchBarDisplay ? "w-48" : "w-0"}`} type="text" placeholder="Cerca" autoComplete="off" onChange={() => searchBar.current !== null && changeSearchName(searchBar.current.value)} />
                    </div>}
                    {isMobile && <div id="search-bar" className={`flex items-center p-2 border gap-2 ${searchBarDisplay ? "search-bar-active w-full" : ""}`}>
                        <img src={search} className="w-6 min-w-[1.5rem] cursor-pointer" onClick={() => {setSearchBarDisplay(!searchBarDisplay)}} />
                        <input ref={searchBar} id="search-bar-input" className={`w-0 bg-transparent text-white ${searchBarDisplay ? "w-full" : ""}`} type="text" placeholder="Cerca" autoComplete="off" onChange={() => searchBar.current !== null && changeSearchName(searchBar.current.value)} />
                    </div>}
                    {(!isMobile || !searchBarDisplay) && <div id="navbar-profile-pic-container" className="py-4 flex justify-center items-center">
                        <div id="navbar-profile-pic" className={`relative w-9 h-9 profile-pic-${user.pic}`}>
                            <div id="navbar-account-option-container" className="absolute right-0 translate-y-12 border-[1px] text-white">
                                {user.logged && <>
                                    <Link to="/profile" className="cursor-pointer">
                                        <p className="navbar-account-option px-4 py-[0.2rem] text-lg font-medium">Profilo</p>
                                    </Link>
                                    <div className="navbar-account-option cursor-pointer" onClick={() => setLogoutConfirm(true)}>
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
                <div className={`absolute w-screen h-screen top-0 bg-black transition-all duration-300 ${menuDisplay ? "opacity-50" : "opacity-0 invisible"}`} onClick={() => setMenuDisplay(false)} />
                <div id="navbar-menu" className={`absolute h-screen left-0 top-0 duration-300 transition-all ${menuDisplay ? "w-[50vw]" : "w-0"}`}>
                    <div className={`flex flex-col gap-4 items-center w-full py-10 transition-[visibility] ${menuDisplay ? "" : "invisible"}`}>
                        <Link to="/" onClick={() => setMenuDisplay(false)}>
                            <p className={`navbar-section font-medium text-lg h-7 cursor-pointer ${navbarSection.home ? "navbar-section-active" : ""} hover:text-white transition-[color] duration-150`}>Home</p>
                        </Link>
                        <Link to="/film" onClick={() => setMenuDisplay(false)}>
                            <p className={`navbar-section font-medium text-lg h-7 cursor-pointer ${navbarSection.film ? "navbar-section-active" : ""} hover:text-white transition-[color] duration-150`}>Film</p>
                        </Link>
                        <Link to="/series" onClick={() => setMenuDisplay(false)}>
                            <p className={`navbar-section font-medium text-lg h-7 whitespace-nowrap cursor-pointer ${navbarSection.series ? "navbar-section-active" : ""} hover:text-white transition-[color] duration-150`}>Serie TV</p>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={`w-screen h-screen top-0 bg-black fixed transition-all duration-300 z-20 ${logoutConfirm ? "opacity-50" : "invisible opacity-0"}`} onClick={() => setLogoutConfirm(false)} />
            <div className={`w-[20rem] container fixed left-[50vw] top-[50vh] flex flex-col rounded-md text-white h-fit transition-all duration-300 translate-x-[-50%] z-20 ${logoutConfirm ? "translate-y-[-50%]" : "opacity-0 translate-y-[-60%] invisible"}`}>
                <p className="text-2xl px-10 h-16 flex items-center">Conferma</p>
                <div className="container-line-break w-full h-[1px]" />
                <div className="flex flex-col p-10 gap-10">
                    <p>Vuoi davvero uscire?</p>
                    <div className="flex gap-10 justify-end">
                        <p className="logout-choice cursor-pointer transition-[color] duration-150" onClick={() => setLogoutConfirm(false)}>No</p>
                        <p className="logout-choice cursor-pointer transition-[color] duration-150" onClick={() => {
                            logout()
                            setLogoutConfirm(false)
                        }}>Sì</p>
                    </div>
                </div>
            </div>
        </>
    )
}