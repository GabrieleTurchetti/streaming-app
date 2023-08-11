import { isMobile } from 'react-device-detect'
import { useNavigate } from 'react-router-dom'
import { updatePassword } from 'firebase/auth'
import { auth } from '../firebase.js'
import { useState } from 'react'
import openEye from '../images/open-eye.svg'
import closedEye from '../images/closed-eye.svg'
import sendNotification from '../functions/sendNotification'

export default function ChangePassword() {
    const [showPassword, setShowPassword] = useState(false) // variabile di stato utilizzata per la visualizzazione del testo della password
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false) // variabile di stato utilizzata per la visualizzazione del testo della conferma della password
    const navigate = useNavigate() // funzione utilizzata per spostarsi da una pagina all'altra

    // variabile di stato contenente i messaggi da inviare come errore
    const [errorDisplay, setErrorDisplay] = useState({
        password: "",
        passwordConfirm: ""
    })

    // funzione che effettua il cambio della password
    function changePassword() {
        const password = document.getElementById("container-input-password") as HTMLInputElement
        const passwordConfirm = document.getElementById("container-input-password-confirm") as HTMLInputElement

        setErrorDisplay({
            password: "",
            passwordConfirm: ""
        })

        if (password.value.length > 0 && passwordConfirm.value.length > 0) {
            if (password.value === passwordConfirm.value) {
                if (auth.currentUser !== null) {
                    // se il cambio della password va a buon fine viene inviata una notifica desktop
                    updatePassword(auth.currentUser, password.value).then(() => {
                        sendNotification("Cambio password", "Il cambio della password è avvenuto con successo.")
                        navigate("/profile")
                    }).catch(error => {
                        // vengono impostati i messaggi di errore in base al codice dell'errore ritornato dalla funzione di Firebase
                        switch (error.code) {
                            case "auth/weak-password":
                                setErrorDisplay(prev => ({
                                    ...prev,
                                    password: "Password troppo debole"
                                }))

                                break

                            default:
                                alert(error.message)
                        }
                    })
                }
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
                password: password.value.length === 0 ? "compila questo campo" : "",
                passwordConfirm: passwordConfirm.value.length === 0 ? "compila questo campo" : ""
            })
        }
    }

    return (
        <div className="flex justify-center my-16">
            <div className={`container ${isMobile ? "w-[20rem]" : "w-[32rem]"} flex flex-col rounded-md text-white`}>
                <p className="text-2xl px-10 h-16 flex items-center">Cambio password</p>
                <div className="container-line-break w-full h-[1px]" />
                <div className={`${isMobile ? "px-12" : "px-16"} flex flex-col py-10 gap-5`}>
                    <div className="flex flex-col gap-1">
                        <p className="container-header">Inserisci la nuova password</p>
                        <div className="flex">
                            <input id="container-input-password" className="container-input h-9 pl-3 w-full rounded-none" type={showPassword ? "text" : "password"} />
                            <div className="container-eye flex px-2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                <img src={showPassword ? closedEye : openEye} className="w-6" />
                            </div>
                        </div>
                        {errorDisplay.password !== "" && <p className="text-red-600">{errorDisplay.password}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="container-header">Conferma la nuova password</p>
                        <div className="flex">
                            <input id="container-input-password-confirm" className="container-input h-9 pl-3 w-full rounded-none" type={showPasswordConfirm ? "text" : "password"} />
                            <div className="container-eye flex px-2 cursor-pointer" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                                <img src={showPasswordConfirm ? closedEye : openEye} className="w-6" />
                            </div>
                        </div>
                        {errorDisplay.passwordConfirm !== "" && <p className="text-red-600">{errorDisplay.passwordConfirm}</p>}
                    </div>
                    <button className="container-button w-full h-9 mt-6 transition-[background-color] duration-150" onClick={changePassword}>
                        <p>Cambia</p>
                    </button>
                </div>
            </div>
        </div>
    )
}