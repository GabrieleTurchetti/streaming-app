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
    const [index, setIndex] = useState(0) // variabile di stato contenente il valore dell'indice dello slider
    const [translate, setTranslate] = useState(5) // variabile di stato contenente il valore di quanto lo slider deve essere spostato

    // funzione che chiama "changeSliderSideDisplay" al massimo una volta ogni 100 ms
    // guardare "hooks/useTimeout.ts" per informazioni sul funzionamento della custom hook
    const { reset } = useTimeout(changeSliderSideDisplay, 100)

    // variabile di stato contenente le proprietà "display" delle frecce dello slider
    const [sliderSideDisplay, setSliderSideDisplay] = useState({
        left: "none",
        right: "none"
    })

    // aggiunge un event listener per l'evento "resize" alla quale associa la funzione "reset"
    useEffect(() => {
        window.addEventListener("resize", reset)

        return () => {
            window.removeEventListener("resize", reset)
        }
    })

    // muove lo slider quando il valore di "index" cambia e chiama la funzione di impostazione di visualizzazione delle frecce
    useEffect(() => {
        setTranslate(5 - 87 * index)
        changeSliderSideDisplay()
    }, [index])

    // muove lo slider fino all'inizio ogni volta che i dati degli episodi cambiano e chiama la funzione di impostazione di visualizzazione delle frecce
    useEffect(() => {
        setIndex(0)
        changeSliderSideDisplay()
    }, [episodes])

    // funzione che incrementa il valore di "index" a meno che non abbia raggiunto il suo valore massimo
    function increaseIndex() {
        let sliderItems = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--slider-items"))

        if (index + 1 < Math.ceil(episodes.length / sliderItems)) {
            setIndex(index + 1)
        }
    }

    // funzione che decrementa il valore di "index" a meno che non sia 0
    function decreaseIndex() {
        if (index > 0) {
            setIndex(index - 1)
        }
    }

    // funzione che imposta quali frecce visualizzare in base al valore di "index"
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