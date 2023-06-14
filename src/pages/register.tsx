import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import { auth, db } from '../firebase.js'
import { isMobile } from 'react-device-detect'

export default function Register() {
    const navigate = useNavigate()
    const [sendEmailDisplay, setSendEmailDisplay] = useState(true)

    const [errorDisplay, setErrorDisplay] = useState({
        nickname: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    function signUp() {
        const nickname = document.getElementById("account-input-nickname") as HTMLInputElement
        const email = document.getElementById("account-input-email") as HTMLInputElement
        const password = document.getElementById("account-input-password") as HTMLInputElement
        const confirmPassword = document.getElementById("account-input-confirm-password") as HTMLInputElement

        setErrorDisplay({
            nickname: "",
            email: "",
            password: "",
            confirmPassword: ""
        })

        if (nickname.value.length > 0 && email.value.length > 0 && password.value.length > 0 && confirmPassword.value.length > 0) {
            if (password.value === confirmPassword.value) {
                createUserWithEmailAndPassword(auth, email.value, password.value).then(userCredential => {
                    const date = new Date()
                    const currentDay = String(date.getDate()).padStart(1, "0")
                    const currentMonth = String(date.getMonth() + 1).padStart(2, "0")
                    const currentYear = date.getFullYear()
                    const today = `${currentDay}/${currentMonth}/${currentYear}`
                    createUser(email.value, nickname.value, userCredential.user.uid, today)
                    sendEmail()
                    setSendEmailDisplay(true)
                }).catch(error => {
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
                                password: "Password troppo debole :("
                            }))

                            break
                    }
                })
            }
            else {
                setErrorDisplay(prev => ({
                    ...prev,
                    confirmPassword: "Le password non combaciano"
                }))
            }
        }
        else {
            setErrorDisplay({
                nickname: nickname.value.length === 0 ? "compila questo campo" : "",
                email: email.value.length === 0 ? "compila questo campo" : "",
                password: password.value.length === 0 ? "compila questo campo" : "",
                confirmPassword: confirmPassword.value.length === 0 ? "compila questo campo" : ""
            })
        }
    }

    function sendEmail() {
        sendEmailVerification(auth.currentUser || ({} as any)).then(() => {
            console.log(auth.currentUser)
            console.log("verificata")
        }).catch(error => {
            console.log(error)
            // troppe richieste
        })
    }

    async function createUser(email: string, nickname: string, id: string, today: string) {
        await setDoc(doc(db, "users", id), {
            email: email,
            nickname: nickname,
            joined: today,
            pic: 1
        })
    }

    return (
        <div className="flex my-14 justify-center">
            {!sendEmailDisplay && <div id="account-container" className={`${isMobile ? "w-[20rem]" : "w-[32rem]"} flex flex-col rounded-md text-white`}>
                <p className="text-2xl px-10 h-16 flex items-center">Registrati</p>
                <div id="account-line-break" className="w-full h-[1px]"></div>
                <div className={`${isMobile ? "px-12" : "px-16"} flex flex-col py-10 gap-5`}>
                    <div className="flex flex-col gap-1">
                        <p className="account-header">Nickname</p>
                        <input id="account-input-nickname" className="account-input h-9 px-3 w-full" type="text" />
                        {errorDisplay.nickname !== "" && <p className="text-red-600">{errorDisplay.nickname}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="account-header">Email</p>
                        <input id="account-input-email" className="account-input h-9 px-3 w-full" type="email" />
                        {errorDisplay.email !== "" && <p className="text-red-600">{errorDisplay.email}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="account-header">Password</p>
                        <input id="account-input-password" className="account-input h-9 px-3 w-full" type="password" />
                        {errorDisplay.password !== "" && <p className="text-red-600">{errorDisplay.password}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="account-header">Conferma password</p>
                        <input id="account-input-confirm-password" className="account-input h-9 px-3 w-full" type="password" />
                        {errorDisplay.confirmPassword !== "" && <p className="text-red-600">{errorDisplay.confirmPassword}</p>}
                    </div>
                    <button id="account-button" className="w-full h-9 mt-6 transition-[background-color] duration-15" onClick={signUp}>
                        <p>Registrati</p>
                    </button>
                </div>
            </div>}
            {sendEmailDisplay && <div id="sendemail-container" className={`${isMobile ? "w-[20rem]" : "w-[32rem]"} flex flex-col rounded-md text-white`}>
                <p className="text-2xl px-10 h-16 flex items-center">Email di verifica</p>
                <div id="sendemail-line-break" className="w-full h-[1px]"></div>
                <div className={`${isMobile ? "px-12" : "px-16"} flex flex-col py-10 gap-5`}>
                    <p>Ti abbiamo inviato un email per la verifica.</p>
                    <p id="sendemail-resend" className="mt-6 cursor-pointer transition-[color] duration-150" onClick={sendEmail}>Rimanda l'email</p>
                </div>
            </div>}
        </div>
    )
}