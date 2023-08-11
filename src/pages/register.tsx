import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import { auth, db } from '../firebase.js'
import { isMobile } from 'react-device-detect'
import openEye from '../images/open-eye.svg'
import closedEye from '../images/closed-eye.svg'
import sendNotification from '../functions/sendNotification'

export default function Register() {
    const navigate = useNavigate() // funzione utilizzata per spostarsi da una pagina all'altra
    const [showPassword, setShowPassword] = useState(false) // variabile di stato utilizzata per la visualizzazione del testo della password
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false) // variabile di stato tutlizzata per la visualizzazione del testo della conferma della password

    // variabile di stato contenente i messaggi da inviare come errore
    const [errorDisplay, setErrorDisplay] = useState({
        nickname: "",
        email: "",
        password: "",
        passwordConfirm: ""
    })

    // funzione che effettua la registrazione
    function signUp() {
        const nickname = document.getElementById("container-input-nickname") as HTMLInputElement
        const email = document.getElementById("container-input-email") as HTMLInputElement
        const password = document.getElementById("container-input-password") as HTMLInputElement
        const passwordConfirm = document.getElementById("container-input-password-confirm") as HTMLInputElement

        setErrorDisplay({
            nickname: "",
            email: "",
            password: "",
            passwordConfirm: ""
        })

        if (nickname.value.length > 0 && email.value.length > 0 && password.value.length > 0 && passwordConfirm.value.length > 0) {
            if (password.value === passwordConfirm.value) {
                // se la registrazione va a buon fine viene creato il documento relativo all'utente nel database Firestore e viene inviata una notifica desktop
                createUserWithEmailAndPassword(auth, email.value, password.value).then(userCredential => {
                    const date = new Date()
                    const currentDay = String(date.getDate()).padStart(1, "0")
                    const currentMonth = String(date.getMonth() + 1).padStart(2, "0")
                    const currentYear = date.getFullYear()
                    const today = `${currentDay}/${currentMonth}/${currentYear}`
                    createUser(email.value, nickname.value, userCredential.user.uid, today)
                    sendNotification("Registrazione effettuata", `Benvenuto ${nickname.value}.`)
                    navigate("/verification")
                }).catch(error => {
                    // vengono impostati i messaggi di errore in base al codice dell'errore ritornato dalla funzione di Firebase
                    switch (error.code) {
                        case "auth/invalid-email":
                            setErrorDisplay(prev => ({
                                ...prev,
                                email: "Email non valida"
                            }))

                            break

                        case "auth/weak-password":
                            setErrorDisplay(prev => ({
                                ...prev,
                                password: "Password troppo debole"
                            }))

                            break

                        case "auth/email-already-in-use":
                            setErrorDisplay(prev => ({
                                ...prev,
                                email: "Email già in uso"
                            }))

                            break

                        default:
                            alert(error.code)
                    }
                })
            }
            else {
                setErrorDisplay(prev => ({
                    ...prev,
                    passwordConfirm: "Le password non combaciano"
                }))
            }
        }
        else {
            setErrorDisplay({
                nickname: nickname.value.length === 0 ? "compila questo campo" : "",
                email: email.value.length === 0 ? "compila questo campo" : "",
                password: password.value.length === 0 ? "compila questo campo" : "",
                passwordConfirm: passwordConfirm.value.length === 0 ? "compila questo campo" : ""
            })
        }
    }

    // funzione utilizzata per la creazione del documento associato all'utente nel database Firestore
    async function createUser(email: string, nickname: string, id: string, today: string) {
        await setDoc(doc(db, "users", id), {
            email: email,
            nickname: nickname,
            joined: today,
            pic: 1
        })
    }

    return (
        <div className="flex justify-center my-16">
            <div className={`container ${isMobile ? "w-[20rem]" : "w-[32rem]"} flex flex-col rounded-md text-white`}>
                <p className="text-2xl px-10 h-16 flex items-center">Registrati</p>
                <div className="container-line-break w-full h-[1px]"></div>
                <div className={`${isMobile ? "px-12" : "px-16"} flex flex-col py-10 gap-5`}>
                    <div className="flex flex-col gap-1">
                        <p className="container-header">Nickname</p>
                        <input id="container-input-nickname" className="container-input h-9 px-3 w-full rounded-none" type="text" />
                        {errorDisplay.nickname !== "" && <p className="text-red-600">{errorDisplay.nickname}</p>}
                    </div>
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
                    <div className="flex flex-col gap-1">
                        <p className="container-header">Conferma password</p>
                        <div className="flex">
                            <input id="container-input-password-confirm" className="container-input h-9 pl-3 w-full rounded-none" type={showPasswordConfirm ? "text" : "password"} />
                            <div className="container-eye flex px-2 cursor-pointer" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                                <img src={showPasswordConfirm ? closedEye : openEye} className="w-6" />
                            </div>
                        </div>
                        {errorDisplay.passwordConfirm !== "" && <p className="text-red-600">{errorDisplay.passwordConfirm}</p>}
                    </div>
                    <button className="container-button w-full h-9 mt-6 transition-[background-color] duration-15" onClick={signUp}>
                        <p>Registrati</p>
                    </button>
                </div>
            </div>
        </div>
    )
}