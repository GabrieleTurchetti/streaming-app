import { useLocation, useNavigationType } from 'react-router-dom'
import { useEffect, ReactNode } from 'react'

interface Props {
    children: ReactNode
}

export default function SmoothScrool({ children }: Props) {
    const location = useLocation()
    const navType = useNavigationType()

    // riporta in cima la pagina corrente con un'animazione nel caso in cui l'utente clicca su un link della pagina in qui è attualmente
    useEffect(() => {
        if (!location.pathname.startsWith("/film/title") && !location.pathname.startsWith("/series/title")) {
            if (navType === "REPLACE") {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                })
            }
        }
    }, [location])

    return (
        <>{children}</>
    )
}