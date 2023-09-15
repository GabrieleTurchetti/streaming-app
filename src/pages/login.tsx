import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../firebase.js'
import { getDoc, doc } from 'firebase/firestore'
import { isMobile } from 'react-device-detect'
import { User } from '../App'
import openEye from '../images/open-eye.svg'
import closedEye from '../images/closed-eye.svg'
import sendNotification from '../functions/sendNotification'

interface Props {
    changeUser: (user: User) => void
}

export default function Login({ changeUser }: Props) {
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)

    const [errorDisplay, setErrorDisplay] = useState({
        email: "",
        password: ""
    })

    function signIn() {
        const email = document.getElementById("container-input-email") as HTMLInputElement
        const password = document.getElementById("container-input-password") as HTMLInputElement

        setErrorDisplay({
            email: "",
            password: ""
        })

        if (email.value.length > 0 && password.value.length > 0) {
            signInWithEmailAndPassword(auth, email.value, password.value).then(async userCredential => {
                const docRef = doc(db, "users", userCredential.user.uid)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    changeUser({
                        logged: true,
                        id: userCredential.user.uid,
                        email: docSnap.data().email,
                        nickname: docSnap.data().nickname,
                        pic: docSnap.data().pic,
                        saved: docSnap.data().saved,
                        joined: docSnap.data().joined,
                        verified: userCredential.user.emailVerified
                    })

                    navigate("/")
                }
                else {
                    sendNotification("Errore login", "Purtroppo non è stato possibile effettuare il login. Contattaci tramite email per risolvere il problema.")
                }
            }).catch(error => {
                switch (error.code) {
                    case "auth/user-not-found":
                        setErrorDisplay(prev => ({
                            ...prev,
                            email: "Email errata"
                        }))

                        break

                    case "auth/invalid-email":
                        setErrorDisplay(prev => ({
                            ...prev,
                            email: "Email non valida"
                        }))

                        break

                    case "auth/wrong-password":
                        setErrorDisplay(prev => ({
                            ...prev,
                            password: "Password errata"
                        }))

                        break

                    default:
                        alert(error.message)
                }
            })
        }
        else {
            setErrorDisplay({
                email: email.value.length === 0 ? "compila questo campo" : "",
                password: password.value.length === 0 ? "compila questo campo" : ""
            })
        }
    }

    return (
        <div className="flex justify-center my-16">
            <div className={`container ${isMobile ? "w-[20rem]" : "w-[32rem]"} flex flex-col rounded-md text-white`}>
                <p className="text-2xl px-10 h-16 flex items-center">Accedi</p>
                <div className="container-line-break w-full h-[1px]"></div>
                <div className={`${isMobile ? "px-10" : "px-16"} flex flex-col py-10 gap-5`}>
                    <div className="flex flex-col gap-1">
                        <p className="container-header">Email</p>
                        <input id="container-input-email" className="container-input h-9 px-3 w-full rounded-none" type="email" />
                        {errorDisplay.email !== "" && <p className="text-red-600">{errorDisplay.email}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="container-header">Password</p>
                        <div className="flex">
                            <input id="container-input-password" className="container-input h-9 pl-3 w-full rounded-none" type={showPassword ? "text" : "password"} />
                            <div className="container-eye flex px-2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                <img src={showPassword ? closedEye : openEye} className="w-6" />
                            </div>
                        </div>
                        {errorDisplay.password !== "" && <p className="text-red-600">{errorDisplay.password}</p>}
                    </div>
                    <button className="container-button w-full h-9 mt-6 transition-[background-color] duration-150" onClick={signIn}>
                        <p>Accedi</p>
                    </button>
                    <Link to="/register">
                        <p id="account-link-register" className="mt-6 cursor-pointer transition-[color] duration-150">È la prima volta che passi di qui?</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}