import { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import { SavedTitlesContext, UserContext } from '../App'
import getTitle from '../requests/getTitle'
import getSeasonsEpisodes from '../requests/getSeasonsEpisodes'
import getRelated from '../requests/getRelated'
import playCircle from '../images/play-circle.svg'
import EpisodesSlider from '../components/episodesSlider'
import arrowDown from '../images/arrow-down.svg'
import TitleSlider from '../components/titleSlider'
import checkFilled from '../images/check-filled.svg'
import addFilled from '../images/add-filled.svg'

interface Title {
    id: number,
    type: string,
    pic: string,
    name: string,
    year: number,
    time?: number,
    seasons?: number,
    plot: string,
    rating: number,
    genres: string[],
    companies: string[]
}

type Titles = {
    id: number,
    type: string,
    name: string,
    genres: string[],
    coverPic: string
}[]

type Episodes = {
    id: number,
    coverPic: string,
    number: number,
    name: string
}[]

export default function Title() {
    const [title, setTitle] = useState<Title>()
    const [seasonsEpisodes, setSeasonsEpisodes] = useState<Episodes[]>([])
    const [percentage, setPercentage] = useState(0)
    const [season, setSeason] = useState(1)
    const [seasonOptionsDisplay, setSeasonOptionsDisplay] = useState(false)
    const [related, setRelated] = useState<Titles>([])
    const { type, id } = useParams()
    const [reload, setReload] = useState(false)
    const [sectionUnderlinePosition, setSectionUnderlinePosition] = useState(0)
    const [isPlotExpanded, setIsPlotExpanded] = useState(false)
    const savedTitle = useContext(SavedTitlesContext)
    const user = useContext(UserContext)

    const [loaded, setLoaded] = useState({
        title: false,
        seasonsEpisodes: false,
    })

    const [sectionDisplay, setSectionDisplay] = useState({
        general: true,
        episodes: false,
        details:  false
    })

    useEffect(() => {
        if (id !== undefined && type !== undefined) {
            getTitle(parseInt(id), type).then(res => {
                const title: Title = res as Title
                setTitle(title)

                getRelated(title.id, title.type).then(res => {
                    const titles: Titles = res as Titles
                    setRelated(titles)
                }).catch(error => console.error(error))

                if (type === "series") {
                    getSeasonsEpisodes(title.id, title.seasons || 0).then(res => {
                        const seasonsEpisodes: Episodes[] = res as Episodes[]
                        setSeasonsEpisodes(seasonsEpisodes)

                        setLoaded(prev => ({
                            ...prev,
                            seasonsEpisodes: true
                        }))
                    }).catch(error => console.error(error))
                }

                setLoaded(prev => ({
                    ...prev,
                    title: true
                }))
            }).catch(error => console.error(error))
        }
    }, [])

    useEffect(() => {
        if (title !== undefined) {
            startRatingAnimation(title.rating)
        }
    }, [sectionDisplay, title])

    useEffect(() => {
        if (reload) {
            window.location.reload()
        }
        else {
            setReload(true)
        }
    }, [id])

    function startRatingAnimation(rating: number) {
        let ratingCircle = document.getElementById("rating-circle")
        increasePercentage(rating)

        if (ratingCircle != null) {
            if (rating >= 75) {
                ratingCircle.style.animation = "svg-border-yellow-green 1s ease-out forwards, progress 1s ease-out forwards"
            }
            else if (rating >= 50) {
                ratingCircle.style.animation = "svg-border-yellow 1s ease-out forwards, progress 1s ease-out forwards"
            }
        }
    }

    function increasePercentage(rating: number) {
        for (let i = 1; i <= rating; i++) {
            setTimeout(() => {
                setPercentage(i)
            }, (i * i) * (10 / rating))
        }
    }

    function changeSectionDisplay(section: string) {
        switch (section) {
            case "general":
                if (!sectionDisplay.general) {
                    setSectionDisplay({
                        general: true,
                        episodes: false,
                        details:  false
                    })

                    setSectionUnderlinePosition(0)
                }

                break

            case "episodes":
                if (!sectionDisplay.episodes) {
                    setSectionDisplay({
                        general: false,
                        episodes: true,
                        details:  false
                    })

                    setSectionUnderlinePosition(1)
                }

                break

            case "details":
                if (!sectionDisplay.details) {
                    setSectionDisplay({
                        general: false,
                        episodes: false,
                        details:  true
                    })

                    setSectionUnderlinePosition(title?.type === "film" ? 1 : 2)
                }

                break
        }
    }

    function getSeasonOptions() {
        let result = []

        for (let i = 1; i <= (title?.seasons || 0); i++) {
            result.push(<div className="season-option cursor-pointer px-2 py-[0.1rem] whitespace-nowrap" onClick={() => {
                setSeason(i)
                setSeasonOptionsDisplay(!seasonOptionsDisplay)
            }}>Stagione {i}</div>)
        }

        return result
    }

    return (
        <>
            <div className="h-[32rem] flex flex-col justify-between bg-cover bg-top" style={{backgroundImage: `url(${title?.pic})`}}>
                <div className="head-over absolute w-full h-[32rem] opacity-80" />
                {loaded.title && <>
                    {sectionDisplay.general && <div className={`${isMobile ? "w-full p-12" : "w-3/5 min-w-[40rem] px-28 pt-20"} flex flex-col gap-3`}>
                        <p className="text-white text-3xl font-medium z-10">{title?.name}</p>
                        <p className="text-white text-lg z-10">{title?.year} - {title?.time !== -1 ? title?.time + " min" : title?.seasons + (title?.seasons === 1 ? " stagione" : " stagioni")}</p>
                        {!isMobile && <>
                            {title?.plot !== undefined ? title.plot.length <= 150 && <p className="head-plot text-xl z-10">{title.plot}</p> : <></>}
                            {title?.plot !== undefined ? title.plot.length > 150 && !isPlotExpanded && <p className="head-plot text-xl z-10 cursor-pointer" onClick={() => setIsPlotExpanded(true)}>{title.plot.substring(0, 150) + " ..."}</p> : <></>}
                            {title?.plot !== undefined ? title.plot.length > 150 && isPlotExpanded && <p className="head-plot text-xl z-10 cursor-pointer max-h-48 overflow-auto" onClick={() => {
                                setIsPlotExpanded(false)
                                increasePercentage(title.rating)
                            }}>{title.plot}</p> : <></>}
                        </>}
                        {isMobile && <>
                            {title?.plot !== undefined ? title.plot.length <= 100 && <p className="head-plot text-xl z-10">{title.plot}</p> : <></>}
                            {title?.plot !== undefined ? title.plot.length > 100 && !isPlotExpanded && <p className="head-plot text-xl z-10 cursor-pointer" onClick={() => setIsPlotExpanded(true)}>{title.plot.substring(0, 100) + " ..."}</p> : <></>}
                            {title?.plot !== undefined ? title.plot.length > 100 && isPlotExpanded && <p className="head-plot text-xl z-10 cursor-pointer max-h-48 overflow-auto" onClick={() => {
                                setIsPlotExpanded(false)
                                increasePercentage(title.rating)
                            }}>{title.plot}</p> : <></>}
                        </>}
                        <div className={`flex gap-6 z-10 items-center py-2 ${isPlotExpanded ? "hidden" : ""}`}>
                            <svg viewBox="0 0 36 36" className="w-16">
                                <path id="rating-circle" className="circle h-0" strokeDasharray={`${title?.rating}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <text x="18" y="20.35" className="percentage">{percentage}%</text>
                            </svg>
                            <Link to={type === "film" ? `/film/watch/${title?.id}` : `/series/watch/${title?.id}`}>
                                <img src={playCircle} className="w-14 opacity-80 duration-150 hover:opacity-100" />
                            </Link>
                            <img src={(title?.id || 0) in user.saved ? checkFilled : addFilled} className="w-10 opacity-80 hover:opacity-100 cursor-pointer" onClick={() => title !== undefined && (title.id in user.saved ? savedTitle.remove(title.id, title.type) : savedTitle.add(title.id, title.type))} />
                        </div>
                    </div>}
                    {sectionDisplay.episodes && <>
                        <div className={`${isMobile ? "flex-col" : ""} flex justify-between`}>
                            <div className={`${isMobile ? "w-full p-12" : " w-3/5 min-w-[40rem] px-28 pt-20"} flex flex-col gap-3`}>
                                <p className="text-white text-3xl font-medium z-10">{title?.name}</p>
                                <p className="text-white text-lg z-10">{title?.year} - {title?.time !== -1 ? title?.time + " min" : title?.seasons + (title?.seasons === 1 ? " stagione" : " stagioni")}</p>
                            </div>
                            <div className={`${isMobile ? "relative mr-12" : "pr-28 pt-28"} text-white z-10`}>
                                <div className={`${isMobile ? "absolute right-0" : ""}`}>
                                    <div id="season-select" className="cursor-pointer px-2 py-[0.1rem] border-[1px] whitespace-nowrap flex gap-2 min-w-max" onClick={() => setSeasonOptionsDisplay(!seasonOptionsDisplay)}>
                                        Stagione {season}
                                        <img src={arrowDown} className={`w-3 transition-[transform] duration-150 ${seasonOptionsDisplay ? "rotate-180" : ""}`} />
                                    </div>
                                    {seasonOptionsDisplay && <div id="season-option-container" className="absolute border-[1px] max-h-[10rem] overflow-y-auto">
                                        {getSeasonOptions().map(e => e)}
                                    </div>}
                                </div>
                            </div>
                        </div>
                        {loaded.seasonsEpisodes && <div className="flex h-full items-center justify-center">
                            <EpisodesSlider
                                episodes = {seasonsEpisodes[season - 1]}
                            />
                        </div>}
                        {!loaded.seasonsEpisodes && <div className="flex h-full items-center justify-center">
                            <div className="lds-ellipsis">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>}
                    </>}
                    {sectionDisplay.details && <>
                        <div className={`${isMobile ? "w-full px-12 pt-12" : "w-3/5 min-w-[40rem] px-28 pt-20"} flex flex-col gap-3`}>
                            <p className="text-white text-3xl font-medium z-10">{title?.name}</p>
                            <p className="text-white text-lg z-10">{title?.year} - {title?.time !== -1 ? title?.time + " min" : title?.seasons + (title?.seasons === 1 ? " stagione" : " stagioni")}</p>
                        </div>
                        <div className={`z-10 h-full mt-6 ${isMobile ? "overflow-auto mx-12" : ""}`}>
                            <div className={`${isMobile ? "gap-20" : "min-w-[40rem] px-28 gap-40"} flex h-full z-30 text-white`}>
                                <div>
                                    <p className="title-details-col-header py-2">Generi</p>
                                    {title?.genres.slice(0, 5).map(e => (
                                        <p>{e}</p>
                                    ))}
                                </div>
                                <div>
                                    <p className="title-details-col-header py-2">Case cinematografiche</p>
                                    {title?.companies.slice(0, isMobile ? 3 : 5).map(e => (
                                        <p>{e}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>}
                    <div className={`flex flex-col w-[${title?.type === "film" ? "14rem" : "21rem"}] self-center gap-2 z-10`}>
                        <div className="flex text-white text-center justify-between">
                            <p className="cursor-pointer title-section-text w-28" onClick={() => changeSectionDisplay("general")}>GENERALE</p>
                            {type === "series" && <p className="cursor-pointer title-section-text w-28" onClick={() => changeSectionDisplay("episodes")}>EPISODI</p>}
                            <p className="cursor-pointer title-section-text w-28" onClick={() => changeSectionDisplay("details")}>DETTAGLI</p>
                        </div>
                        <div className="w-28 px-4">
                            <div id="title-section-underline" className={`h-1 w-full px-4 rounded-lg transition-[transform] duration-150 title-section-underline-${sectionUnderlinePosition}`}></div>
                        </div>
                    </div>
                </>}
            </div>
            {related.length !== 0 && <div className="py-14 flex justify-center">
                <TitleSlider
                    name = {"Correlati"}
                    titles = {related}
                />
            </div>}
        </>
    )
}