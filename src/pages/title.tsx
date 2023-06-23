import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import getTitle from '../requests/getTitle'
import getSeasonsEpisodes from '../requests/getSeasonsEpisodes'
import getRelated from '../requests/getRelated'
import playHeadTitle from '../images/play-head-title.svg'
import EpisodesSlider from '../components/episodesSlider'
import arrowDown from '../images/arrow-down.svg'
import TitleSlider from '../components/titleSlider'

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
    const [title, setTitle] = useState<Title>() // variabile di stato contenente le informazioni del titolo principale
    const [seasonsEpisodes, setSeasonsEpisodes] = useState<Episodes[]>([]) // variabile di stato contenente le informazioni degli episodi per le serie TV
    const [percentage, setPercentage] = useState(0) // variabile di stato che rappresenta il numero del voto del titolo in certo istante
    const [season, setSeason] = useState(1) // variabile di stato contenente il numero della stagione attualmente selezionata per le serie TV
    const [seasonOptionsDisplay, setSeasonOptionsDisplay] = useState(false) // variabile di stato utilizzata per la visualizzazione della lista delle stagioni per le serie TV
    const [related, setRelated] = useState<Titles>([]) // variabile di stato contenente le informazioni dei titoli correlati
    const [loaded, setLoaded] = useState(false) // variabile di stato utilizzata per il rendering del titolo principale solo quando le informazioni relative sono state acquisite
    const { type, id } = useParams() // parametri contenuti nell'URL associati al titolo
    const [reload, setReload] = useState(false) // variabile di stato utilizzata per ricaricare la pagina dopo aver selezionato un titolo correlato

    // variabile di stato utilizzata per il rendering delle sezioni della pagina
    const [sectionDisplay, setSectionDisplay] = useState({
        general: true,
        episodes: false,
        details:  false
    })

    // acquisisce le informazioni del titolo principale e dei correlati
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
                    }).catch(error => console.error(error))
                }

                setLoaded(true)
            }).catch(error => console.error(error))
        }
    }, [])

    // riporta la pagina in cima una volta selezionato e acquisiti i dati di un titolo correlato
    useEffect(() => {
        if (loaded) {
            window.scrollTo({
                top: 0
            })
        }
    }, [loaded])

    // fa partire l'animazione della barra del voto del titolo
    useEffect(() => {
        if (title !== undefined) {
            startRatingAnimation(title.rating)
        }
    }, [sectionDisplay, title])

    // ricarica la pagina una volta selezionato un titolo correlato
    useEffect(() => {
        if (reload) {
            window.location.reload()
        }
        else {
            setReload(true)
        }
    }, [id])

    // funzione che fa partire l'animazione della barra del voto del titolo
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

    // funzione che incrementa gradualmente il numero relativo al voto del titolo
    function increasePercentage(rating: number) {
        for (let i = 1; i <= rating; i++) {
            setTimeout(() => {
                setPercentage(i)
            }, (i * i) * (10 / rating))
        }
    }

    // funzione che imposta quale sezione mostrare
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

    // funzione che restituisce un array di componenti relativi alle stagioni da selezionare
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
            <div className="h-[32rem] flex flex-col justify-between bg-cover bg-top" style={{backgroundImage: `url(${title?.pic})`}}>
                <div className="head-over absolute w-full h-[32rem] opacity-75"></div>
                {loaded && <>
                    {sectionDisplay.general && <div className={`${isMobile ? "w-full p-12" : "w-3/5 min-w-[40rem] px-28 py-20"} flex flex-col gap-3`}>
                        <p className="text-white text-3xl font-medium z-10">{title?.name}</p>
                        <p className="text-white text-lg z-10">{title?.year} - {title?.time !== -1 ? title?.time + " min" : title?.seasons + (title?.seasons === 1 ? " stagione" : " stagioni")}</p>
                        <p className="head-plot text-xl z-10">{isMobile && (title?.plot || "").length > 100 ? title?.plot.substring(0, 100) + "..." : title?.plot}</p>
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
                                    {seasonOptionsDisplay && <div id="season-option-container" className="absolute border-[1px]">
                                        {getSeasonOptions().map(e => e)}
                                    </div>}
                                </div>
                            </div>
                        </div>
                        <div className="flex h-full items-center justify-center">
                            <EpisodesSlider
                                episodes = {seasonsEpisodes[season - 1]}
                            />
                        </div>
                    </>}
                    {sectionDisplay.details && <>
                        <div className={`${isMobile ? "w-full px-12 pt-12" : "w-3/5 min-w-[40rem] px-28 pt-20"} flex flex-col gap-3`}>
                            <p className="text-white text-3xl font-medium z-10">{title?.name}</p>
                            <p className="text-white text-lg z-10">{title?.year} - {title?.time !== -1 ? title?.time + " min" : title?.seasons + (title?.seasons === 1 ? " stagione" : " stagioni")}</p>
                        </div>
                        <div className={`z-10 h-full mt-6 ${isMobile ? "overflow-auto" : ""}`}>
                            <div className={`${isMobile ? "px-12 w-[30rem]" : "w-2/5 min-w-[40rem] px-28"} flex h-full justify-between z-30 text-white`}>
                                <div className={`max-w-[12rem]`}>
                                    <p className="title-details-col-header py-2">Generi</p>
                                    {title?.genres.slice(0, 5).map(e => (
                                        <p>{e}</p>
                                    ))}
                                </div>
                                <div className={`max-w-[12rem]`}>
                                    <p className="title-details-col-header py-2">Case cinematografiche</p>
                                    {title?.companies.slice(0, 5).map(e => (
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
                            <div id="title-section-underline" className="h-1 w-full px-4 rounded-lg transition-[transform] duration-150 title-section-undeline-0"></div>
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