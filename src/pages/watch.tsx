import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import getVideo from '../requests/getVideo'

export default function Watch() {
    const { type, id } = useParams()
    const [video, setVideo] = useState<string>()

    useEffect(() => {
        getVideo(parseInt(id || "0"), type || "").then(res => {
            setVideo(res)
        })
    }, [])

    return (
        <iframe className="h-screen w-screen" src={video} allowFullScreen></iframe>
    )
}