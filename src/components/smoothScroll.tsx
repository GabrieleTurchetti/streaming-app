import { useLocation, useNavigationType } from 'react-router-dom'
import { useEffect, ReactNode } from 'react'

interface Props {
    children: ReactNode
}

export default function SmoothScrool({ children }: Props) {
    const location = useLocation()
    const navType = useNavigationType()

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