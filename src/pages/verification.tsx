import { isMobile } from 'react-device-detect'
import { sendEmailVerification } from 'firebase/auth'
import { auth } from '../firebase.js'
import { useEffect, useState } from 'react'

export default function Verification() {
    const [message, setMessage] = useState("") // variabile di stato contenente il messaggio da mostrare in base all'esito dell'invio dell'email

    // invia l'email di verifica dell'account
    useEffect(() => {
        sendEmail()
    }, [])

    // funzione che invia l'email di verifica dell'account
    function sendEmail() {
        if (auth.currentUser !== null) {
            sendEmailVerification(auth.currentUser).then(() => {
                setMessage("Ti abbiamo inviato una email per la verifica dell'account.")
            }).catch(() => {
                setMessage("Purtroppo c'è stato un errore durante l'invio della email. Riprova tra qualche minuto.")
            })
        }
    }

    return (
        <>
            {message !== "" && <div id="verification-wrapper" className="flex justify-center items-center">
                <div className={`container ${isMobile ? "w-[20rem]" : "w-[32rem]"} flex flex-col rounded-md text-white h-fit`}>
                    <p className="text-2xl px-10 h-16 flex items-center">Email di verifica</p>
                    <div className="container-line-break w-full h-[1px]" />
                    <div className={`${isMobile ? "px-12" : "px-16"} flex flex-col py-10 gap-5`}>
                        <p>{message}</p>
                        <p id="send-email-resend" className="mt-6 cursor-pointer transition-[color] duration-150" onClick={sendEmail}>Rimanda l'email</p>
                    </div>
                </div>
            </div>}
        </>
    )
}