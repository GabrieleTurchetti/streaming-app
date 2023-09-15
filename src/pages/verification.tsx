import { isMobile } from 'react-device-detect'
import { sendEmailVerification } from 'firebase/auth'
import { auth } from '../firebase.js'
import { useEffect, useState } from 'react'

export default function Verification() {
    const [message, setMessage] = useState("")

    useEffect(() => {
        sendEmail()
    }, [])

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
                    <div className="flex flex-col p-10 gap-10">
                        <p>{message}</p>
                        <p id="send-email-resend" className="cursor-pointer transition-[color] duration-150" onClick={sendEmail}>Rimanda l'email</p>
                    </div>
                </div>
            </div>}
        </>
    )
}