import { isMobile } from 'react-device-detect'
import { sendEmailVerification } from 'firebase/auth'
import { auth } from '../firebase.js'
import { useEffect } from 'react'

export default function Verification() {
    useEffect(() => {
        sendEmail()
    }, [])

    function sendEmail() {
        sendEmailVerification(auth.currentUser || ({} as any)).then(() => {
            console.log(auth.currentUser)
            console.log("verificata")
        }).catch(error => {
            console.log(error)
            // troppe richieste
        })
    }

    return (
        <div className="flex mt-14 justify-center">
            <div className={`container ${isMobile ? "w-[20rem]" : "w-[32rem]"} flex flex-col rounded-md text-white`}>
                <p className="text-2xl px-10 h-16 flex items-center">Email di verifica</p>
                <div className="container-line-break w-full h-[1px]" />
                <div className={`${isMobile ? "px-12" : "px-16"} flex flex-col py-10 gap-5`}>
                    <p>Ti abbiamo inviato un email per la verifica.</p>
                    <p id="send-email-resend" className="mt-6 cursor-pointer transition-[color] duration-150" onClick={sendEmail}>Rimanda l'email</p>
                </div>
            </div>
        </div>
    )
}