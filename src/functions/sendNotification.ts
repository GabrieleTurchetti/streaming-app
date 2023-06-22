import logo from '../images/logo.svg'

// invia una notifica desktop se possibile
export default function sendNotification(title: string, message: string) {
    if (!("Notification" in window)) {
        alert("Questo browser non supporta le notifiche desktop")
    }
    else if (Notification.permission === "granted") {
        const notification = new Notification(title, {
            lang: "it",
            body: message,
            icon: logo
        })
    }
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                const notification = new Notification(title, {
                    lang: "it",
                    body: message,
                    icon: logo
                })
            }
        })
    }
}