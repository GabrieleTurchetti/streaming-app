import logo from '../images/logo.svg'
import search from '../images/search.svg'
import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

interface Props {
    navbarSection: {
        home: boolean,
        film: boolean,
        series: boolean
    },
    changeSearchName: () => void
    changeUser: (logged: boolean, id: string, email: string, nickname: string, pic: number, saved: any, joined: string) => void
}

export default function Navbar({ navbarSection, changeSearchName, changeUser }: Props) {
    const [searchDisplay, setSearchDisplay] = useState(false)
    const user = useContext(UserContext)
    const navigate = useNavigate()

    function logout() {
        signOut(auth).then(() => {
            changeUser(false, "", "", "", 0, [], "")
            navigate("/")
        }).catch(error => {
            // error!!!
        })
    }

    return (
        <div id="navbar" className="flex h-16 px-16 justify-between items-center fixed w-full z-20 gap-8">
            <div className="flex items-center gap-8">
                <Link to="/">
                    <img src={logo} className="w-9 min-w-[2.25rem] cursor-pointer" />
                </Link>
                <Link to="/">
                    <p className={`navbar-section font-medium text-lg h-7 cursor-pointer ${navbarSection.home ? "navbar-section-active" : ""} hover:text-white transition-[color] duration-150`}>Home</p>
                </Link>
                <Link to="/film">
                    <p className={`navbar-section font-medium text-lg h-7 cursor-pointer ${navbarSection.film ? "navbar-section-active" : ""} hover:text-white transition-[color] duration-150`}>Film</p>
                </Link>
                <Link to="/series">
                    <p className={`navbar-section font-medium text-lg h-7 whitespace-nowrap cursor-pointer ${navbarSection.series ? "navbar-section-active" : ""} hover:text-white transition-[color] duration-150`}>Serie TV</p>
                </Link>
            </div>
            <div className="flex gap-8 items-center">
                <div id="search" className={`flex items-center p-2 border gap-2 transition-[border-color] duration-300 ${searchDisplay ? "search-active" : ""}`}>
                    <img src={search} className="w-6 min-w-[1.5rem] cursor-pointer" onClick={() => {setSearchDisplay(!searchDisplay)}} />
                    <input id="search-bar" className={`w-0 bg-transparent text-white transition-[width] duration-300 ${searchDisplay ? "search-bar-active" : ""}`} type="text" placeholder="Cerca" autoComplete="off" onChange={changeSearchName} />
                </div>
                <div id="navbar-profile-pic-container" className="py-4 flex justify-center items-center">
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
                </div>
            </div>
        </div>
    )
}