import { useLocation, useNavigationType } from 'react-router-dom'
import { useEffect, ReactElement } from 'react'

interface Props {
    children: ReactElement<any, any>
}

export default function Watch({ children }: Props) {
    const location = useLocation()
    const navType = useNavigationType()

    useEffect(() => {
        if (!location.pathname.startsWith("/film/title") && !location.pathname.startsWith("/series/title")) {
            if (navType !== "REPLACE") {
                window.scrollTo({
                    top: 0
                })
            }
            else {
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