import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import getTitle from '../requests/getTitle'
import getSeasonsEpisodes from '../requests/getSeasonsEpisodes'
import getRelated from '../requests/getRelated'
import playHeadTitle from '../images/play-head-title.svg'
import EpisodesSlider from '../components/episodesSlider'
import arrowDown from '../images/arrow-down.svg'
import Slider from '../components/slider'

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
    genres: string,
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
    const [loaded, setLoaded] = useState(false)
    const { type, id } = useParams()
    const didMountOnChangeId = useRef(false)

    const [sectionDisplay, setSectionDisplay] = useState({
        general: true,
        episodes: false,
        details:  false
    })

    useEffect(() => {
        getTitle(parseInt(id || "0"), type || "").then(res => {
            const title: Title = res as Title

            setTitle({
                id: title.id,
                type: title.type,
                pic: title.pic,
                name: title.name,
                year: title.year,
                time: title.time,
                seasons: title.seasons,
                plot: title.plot.length < 150 ? title.plot : title.plot.substring(0, 150) + " ...",
                rating: title.rating,
                genres: title.genres,
                companies: title.companies
            })

            getRelated(title.id, title.type).then(res => {
                const titles: Titles = res as Titles
                setRelated(titles)
            })

            if (type === "series") {
                getSeasonsEpisodes(title.id, title.seasons || 0).then(res => {
                    const seasonsEpisodes: Episodes[] = res as Episodes[]
                    setSeasonsEpisodes(seasonsEpisodes)
                })
            }

            setLoaded(true)
        })
    }, [])

    useEffect(() => {
        if (loaded) {
            window.scrollTo({
                top: 0
            })
        }
    }, [loaded])

    useEffect(() => {
        startRatingAnimation((title?.rating || 0))
    }, [sectionDisplay, title])

    useEffect(() => {
        if (didMountOnChangeId.current) {
            window.location.reload()
        }
        else {
            didMountOnChangeId.current = true
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

                    document.getElementById("title-section-underline")?.classList.remove("title-section-underline-1", "title-section-underline-2")
                    document.getElementById("title-section-underline")?.classList.add("title-section-underline-0")
                }

                break

            case "episodes":
                if (!sectionDisplay.episodes) {
                    setSectionDisplay({
                        general: false,
                        episodes: true,
                        details:  false
                    })

                    document.getElementById("title-section-underline")?.classList.remove("title-section-underline-0", "title-section-underline-2")
                    document.getElementById("title-section-underline")?.classList.add("title-section-underline-1")
                }

                break

            case "details":
                if (!sectionDisplay.details) {
                    setSectionDisplay({
                        general: false,
                        episodes: false,
                        details:  true
                    })

                    if (title?.type === "film") {
                        document.getElementById("title-section-underline")?.classList.remove("title-section-underline-0")
                        document.getElementById("title-section-underline")?.classList.add("title-section-underline-1")
                    }
                    else {
                        document.getElementById("title-section-underline")?.classList.remove("title-section-underline-0", "title-section-underline-1")
                        document.getElementById("title-section-underline")?.classList.add("title-section-underline-2")
                    }
                }

                break
        }
    }

    function getSeasonOptions() {
        let result = []

        for (let i = 1; i <= (title?.seasons || 0); i++) {
            result.push(<div className="season-option cursor-pointer pl-2 pr-7 py-[0.1rem] whitespace-nowrap" onClick={() => {
                setSeason(i)
                setSeasonOptionsDisplay(!seasonOptionsDisplay)
            }}>Stagione {i}</div>)
        }

        return result
    }

    return (
        <>
            <div className="h-[32rem] flex flex-col justify-between bg-cover" style={{backgroundImage: `url(${title?.pic})`}}>
                <div className="head-over absolute w-full h-[32rem] opacity-75"></div>
                {loaded && <>
                    {sectionDisplay.general && <div className="w-3/5 min-w-[40rem] flex flex-col gap-3 px-28 py-20">
                        <p className="text-white text-3xl font-medium z-10">{title?.name}</p>
                        <p className="text-white text-lg z-10">{title?.year} - {title?.time !== -1 ? title?.time + " min" : title?.seasons + (title?.seasons === 1 ? " stagione" : " stagioni")}</p>
                        <p className="head-plot text-xl z-10">{title?.plot}</p>
                        <div className="flex gap-6 z-10 items-center py-2">
                            <svg viewBox="0 0 36 36" className="w-16">
                                <path id="rating-circle" className="circle" strokeDasharray={`${title?.rating}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <text x="18" y="20.35" className="percentage">{percentage}%</text>
                            </svg>
                            <Link to={type === "film" ? `/film/watch/${title?.id}` : `/series/watch/${title?.id}`}>
                                <img src={playHeadTitle} id="play-head-title" className="w-14 opacity-80 duration-150 hover:opacity-100" />
                            </Link>
                        </div>
                    </div>}
                    {sectionDisplay.episodes && <>
                        <div className="flex justify-between">
                            <div className="w-3/5 min-w-[40rem] flex flex-col gap-3 px-28 pt-20">
                                <p className="text-white text-3xl font-medium z-10">{title?.name}</p>
                                <p className="text-white text-lg z-10">{title?.year} - {title?.time !== -1 ? title?.time + " min" : title?.seasons + (title?.seasons === 1 ? " stagione" : " stagioni")}</p>
                            </div>
                            <div className="text-white pr-28 pt-28 z-10">
                                <div id="season-select" className="cursor-pointer px-2 py-[0.1rem] border-[1px] whitespace-nowrap flex gap-2 min-w-max" onClick={() => setSeasonOptionsDisplay(!seasonOptionsDisplay)}>
                                    Stagione {season}
                                    <img src={arrowDown} className={`w-3 transition-[transform] duration-150 ${seasonOptionsDisplay ? "rotate-180" : ""}`} />
                                </div>
                                {seasonOptionsDisplay && <div id="season-option-container" className="absolute border-[1px]">
                                    {getSeasonOptions().map(e => e)}
                                </div>}
                            </div>
                        </div>
                        <div className="flex h-full items-center justify-center">
                            <EpisodesSlider
                                episodes = {seasonsEpisodes[season - 1]}
                            />
                        </div>
                    </>}
                    {sectionDisplay.details && <>
                        <div className="w-3/5 min-w-[40rem] flex flex-col gap-3 px-28 pt-20">
                            <p className="text-white text-3xl font-medium z-10">{title?.name}</p>
                            <p className="text-white text-lg z-10">{title?.year} - {title?.time !== -1 ? title?.time + " min" : title?.seasons + (title?.seasons === 1 ? " stagione" : " stagioni")}</p>
                        </div>
                        <div className="flex w-2/5 min-w-[40rem] h-full justify-between px-28 z-10 text-white mt-6">
                            <div>
                                <p className="title-details-col-header py-2">Generi</p>
                                {title?.genres.map(e => (
                                    <p>{e}</p>
                                ))}
                            </div>
                            <div>
                                <p className="title-details-col-header py-2">Case cinematografiche</p>
                                {title?.companies?.map(e => (
                                    <p>{e}</p>
                                ))}
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
                            <div id="title-section-underline" className="h-1 w-full px-4 rounded-lg transition-[transform] duration-150 title-section-undeline-0"></div>
                        </div>
                    </div>
                </>}
            </div>
            <div className="py-14 flex justify-center">
                <Slider
                    name = {"Correlati"}
                    titles = {related}
                />
            </div>
        </>
    )
}