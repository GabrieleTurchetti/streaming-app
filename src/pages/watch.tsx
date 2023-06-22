import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import getVideo from '../requests/getVideo'


export default function Watch() {
    const { type, id } = useParams() // parametri contenuti nell'URL associati al titolo
    const [video, setVideo] = useState<string>() // variabile di stato contenente l'URL del video da mostrare
    const [videoAvailable, setVideoAvailable] = useState(true) // variabile di stato che rappresenta la presenza del video o meno

    // acquisisce l'URL del video
    useEffect(() => {
        if (id !== undefined && type !== undefined) {
            getVideo(parseInt(id), type).then(res => {
                if (res !== "") {
                    setVideo(res)
                }
                else {
                    setVideoAvailable(false)
                }
            }).catch(error => console.error(error))
        }
    }, [])

    return (
        <>
            {videoAvailable && <iframe className="h-screen w-screen" src={video} allowFullScreen></iframe>}
            {!videoAvailable && <div className="flex justify-center my-[30vh]">
                <div className={`container ${isMobile ? "w-[20rem]" : "w-[32rem]"} flex flex-col rounded-md text-white`}>
                    <p className="text-2xl px-10 h-16 flex items-center">Ci dispiace</p>
                    <div className="container-line-break w-full h-[1px]" />
                    <div className={`${isMobile ? "px-12" : "px-16"} flex flex-col py-10 gap-5`}>
                        <p>Purtroppo non è disponibile nessun trailer per questo titolo.</p>
                    </div>
                </div>
            </div>}
        </>
    )
}