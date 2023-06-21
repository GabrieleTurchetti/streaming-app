import EpisodesSliderCell from './episodesSliderCell'
import { useState, useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import sliderSideRight from '../images/slider-side-right.svg'
import sliderSideLeft from '../images/slider-side-left.svg'
import useTimeout from '../hooks/useTimeout'

interface Props {
    episodes: {
        id: number,
        coverPic: string,
        number: number,
        name: string
    }[]
}

export default function EpisodeSlider({ episodes }: Props) {
    const [index, setIndex] = useState(0) // indice dello slider
    const [translate, setTranslate] = useState(5) // valore con cui effettuare lo spostamento dello slider

    /* funzione de eseguire in caso di resize della pagina
    il controllo viene eseguito ogni 100 ms per non gravare sulle prestazioni durante il resize
    (guardare "hooks/useTimeout.ts" per informazioni sul funzionamento della custom hook") */
    const { reset } = useTimeout(changeSliderSideDisplay, 100)

    // contiene le proprietà display delle frecce dello slider
    const [sliderSideDisplay, setSliderSideDisplay] = useState({
        left: "none",
        right: "none"
    })

    // aggiunge un event listener per l'evento "resize" con cui associa la funzione "reset" descritta sopra
    useEffect(() => {
        window.addEventListener("resize", reset)

        return () => {
            window.removeEventListener("resize", reset)
        }
    })

    // muove lo slider quando "index" cambia
    useEffect(() => {
        setTranslate(5 - 87 * index)
        changeSliderSideDisplay()
    }, [index])

    // se l'utente cambia stagione rimando "index" a 0
    useEffect(() => {
        setIndex(0)
        changeSliderSideDisplay()
    }, [episodes])

    // se non sono arrivato alla fine dello slider incrementa "index"
    function increaseIndex() {
        let sliderItems = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--slider-items"))

        if (index + 1 < Math.ceil(episodes.length / sliderItems)) {
            setIndex(index + 1)
        }
    }

    // se non sono all'inizio dello slider decrementa "index"
    function decreaseIndex() {
        if (index > 0) {
            setIndex(index - 1)
        }
    }

    // decide quali frecce dello slider mostrare in base a "index"
    function changeSliderSideDisplay() {
        let sliderItems = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--slider-items"))

        if (index > 0) {
            setSliderSideDisplay(prev => ({
                ...prev,
                left: "block"
            }))
        }
        else {
            setSliderSideDisplay(prev => ({
                ...prev,
                left: "none"
            }))
        }

        if (index + 1 < Math.ceil(episodes.length / sliderItems)) {
            setSliderSideDisplay(prev => ({
                ...prev,
                right: "block"
            }))
        }
        else {
            setSliderSideDisplay(prev => ({
                ...prev,
                right: "none"
            }))
        }
    }

    return (
        <div className="slider flex flex-col gap-2">
            <div className={`${isMobile ? "overflow-auto" : "overflow-hidden"} slider-bar flex relative`}>
                <div className={`slider-side w-[4vw] absolute z-10 ${isMobile ? "" : "hover:bg-[rgba(0,0,0,0.5)] text-white font-bold text-4xl"}`} style={{display: sliderSideDisplay.left}} onClick={decreaseIndex}>
                    {!isMobile && <div className="flex h-full items-center justify-center">
                        <img src={sliderSideLeft} className="w-10" />
                    </div>}
                </div>
                <div className="slider-center w-[80vw] flex transition-transform duration-700 ease-[cubic-bezier(0.42,0,0.58,1)]" style={{transform: `translateX(${translate}vw)`}}>
                    {episodes.map(e => (
                        <EpisodesSliderCell
                            episode = {e}
                        />
                    ))}
                </div>
                <div className={`slider-side w-[4vw] absolute right-0 ${isMobile ? "" : "hover:bg-[rgba(0,0,0,0.5)] text-white font-bold text-4xl"}`} style={{display: sliderSideDisplay.right}} onClick={increaseIndex}>
                    {!isMobile && <div className="flex h-full items-center justify-center">
                        <img src={sliderSideRight} className="w-10" />
                    </div>}
                </div>
            </div>
        </div>
    )
}