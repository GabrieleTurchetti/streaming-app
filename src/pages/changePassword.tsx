import { isMobile } from 'react-device-detect'
import { updatePassword } from 'firebase/auth'
import { auth } from '../firebase.js'
import { useState } from 'react'

export default function ChangePassword() {
    const [errorDisplay, setErrorDisplay] = useState({
        password: "",
        confirmPassword: ""
    })

    function changePassword() {
        const password = document.getElementById("container-input-password") as HTMLInputElement
        const confirmPassword = document.getElementById("container-input-confirm-password") as HTMLInputElement

        setErrorDisplay({
            password: "",
            confirmPassword: ""
        })

        if (password.value.length > 0 && confirmPassword.value.length > 0) {
            if (password.value === confirmPassword.value) {
                updatePassword(auth.currentUser || ({} as any), password.value).then(() => {
                    console.log("fatto")
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
                password: password.value.length === 0 ? "compila questo campo" : "",
                confirmPassword: confirmPassword.value.length === 0 ? "compila questo campo" : ""
            })
        }

    }

    return (
        <div className="flex mt-14 justify-center">
            <div className={`container ${isMobile ? "w-[20rem]" : "w-[32rem]"} flex flex-col rounded-md text-white`}>
                <p className="text-2xl px-10 h-16 flex items-center">Cambio password</p>
                <div className="container-line-break w-full h-[1px]" />
                <div className={`${isMobile ? "px-12" : "px-16"} flex flex-col py-10 gap-5`}>
                    <div className="flex flex-col gap-1">
                        <p className="container-header">Inserisci la nuova password</p>
                        <input id="container-input-password" className="container-input h-9 px-3 w-full" type="password" />
                        {errorDisplay.password !== "" && <p className="text-red-600">{errorDisplay.password}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="container-header">Conferma la nuova password</p>
                        <input id="container-input-confirm-password" className="container-input h-9 px-3 w-full" type="password" />
                        {errorDisplay.confirmPassword !== "" && <p className="text-red-600">{errorDisplay.confirmPassword}</p>}
                    </div>
                    <button className="container-button w-full h-9 mt-6 transition-[background-color] duration-150" onClick={changePassword}>
                        <p>Cambia</p>
                    </button>
                </div>
            </div>
        </div>
    )
}