import playHead from '../images/play-head.svg'
import info from '../images/info.svg'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import getHead from '../requests/getHead'

interface Props {
    page: string
}

interface Head {
    id: number,
    type: string,
    pic: string,
    name: string,
    plot: string
}

export default function Head({ page }: Props) {
    const [title, setTitle] = useState<Head>()
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        getHead(page).then((res) => {
            const head: Head = res as Head

            setTitle(head)

            setLoaded(true)
        })
    }, [page])

    return (
        <div id="head" className="h-[32rem] bg-cover" style={{backgroundImage: `url(${title?.pic})`}}>
            <div className="head-over absolute w-full h-[32rem] opacity-75"></div>
            {loaded && <div className="w-3/5 min-w-[40rem] flex flex-col gap-6 p-28">
                <p className="text-white text-3xl font-medium z-10">{title?.name}</p>
                <p className="head-plot text-xl z-10">{title?.plot}</p>
                <div className="flex gap-10 z-10">
                    <Link to={title?.type === "film" ? `/film/watch/${title?.id}` : `/series/watch/${title?.id}`}>
                        <button className="w-36 bg-white rounded-sm font-medium text-lg flex items-center justify-center cursor-pointer h-10">
                            <img src={playHead} className="w-8" />
                            <p>Play</p>
                        </button>
                    </Link>
                    <Link to={`/${title?.type}/title/${title?.id}`}>
                        <button id="head-info" className="w-36 rounded-sm text-white font-medium text-lg flex items-center justify-center gap-2 cursor-pointer h-10">
                            <img src={info} className="w-5" />
                            <p>Info</p>
                        </button>
                    </Link>
                </div>
            </div>}
        </div>
    )
}