import playRectangular from '../images/play-rectangular.svg'
import info from '../images/info.svg'
import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import { SavedTitlesContext, UserContext } from '../App'
import getHead from '../requests/getHead'
import checkFilled from '../images/check-filled.svg'
import addFilled from '../images/add-filled.svg'
interface Props {
    page: string
}

interface Title {
    id: number,
    type: string,
    pic: string,
    name: string,
    plot: string
}

export default function Head({ page }: Props) {
    const [title, setTitle] = useState<Title>()
    const [loaded, setLoaded] = useState(false)
    const savedTitle = useContext(SavedTitlesContext)
    const user = useContext(UserContext)
    const [isPlotExpanded, setIsPlotExpanded] = useState(false)

    useEffect(() => {
        getHead(page).then((res) => {
            const title: Title = res as Title
            setTitle(title)
            setLoaded(true)
        })
    }, [page])

    return (
        <div id="head" className="h-[32rem] bg-cover bg-top" style={{backgroundImage: `url(${title?.pic})`}}>
            <div className="head-over absolute w-full h-[32rem] opacity-75"></div>
            {loaded && <div className={`${isMobile ? "w-full p-12" : "w-3/5 min-w-[40rem] p-28"} flex flex-col gap-6`}>
                <p className="text-white text-3xl font-medium z-10">{title?.name}</p>
                {title?.plot !== undefined ? title.plot.length <= 150 && <p className="head-plot text-xl z-10">{title.plot}</p> : <></>}
                {title?.plot !== undefined ? title.plot.length > 150 && !isPlotExpanded && <p className="head-plot text-xl z-10 cursor-pointer" onClick={() => setIsPlotExpanded(true)}>{title.plot.substring(0, 150) + " ..."}</p> : <></>}
                {title?.plot !== undefined ? title.plot.length > 150 && isPlotExpanded && <p className="head-plot text-xl z-10 cursor-pointer max-h-48 overflow-auto" onClick={() => setIsPlotExpanded(false)}>{title.plot}</p> : <></>}
                {!isPlotExpanded && <div className="flex gap-10 z-10">
                    <Link to={title?.type === "film" ? `/film/watch/${title?.id}` : `/series/watch/${title?.id}`}>
                        <button className={`${isMobile ? "w-28" : "w-36"} bg-white rounded-sm font-medium text-lg flex items-center justify-center h-10 hover:brightness-[0.8] duration-150`}>
                            <img src={playRectangular} className="w-8" />
                            <p>Play</p>
                        </button>
                    </Link>
                    <Link to={`/${title?.type}/title/${title?.id}`}>
                        <button id="head-info" className={`${isMobile ? "w-28" : "w-36"} rounded-sm text-white font-medium text-lg flex items-center justify-center gap-2 h-10 hover:brightness-[0.8] duration-150`}>
                            <img src={info} className="w-5" />
                            <p>Info</p>
                        </button>
                    </Link>
                    {!isMobile && <img src={(title?.id || 0) in user.saved ? checkFilled : addFilled} className="w-10 opacity-80 hover:opacity-100 duration-150 cursor-pointer" onClick={() => title !== undefined && (title.id in user.saved ? savedTitle.remove(title.id, title.type) : savedTitle.add(title.id, title.type))} />}
                </div>}
            </div>}
        </div>
    )
}