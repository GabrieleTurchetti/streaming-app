import EpisodesSliderCell from './episodesSliderCell'
import { useState, useEffect } from 'react'
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
    const [index, setIndex] = useState(0)
    const [translate, setTranslate] = useState(5)
    const { reset } = useTimeout(changeSliderSideDisplay, 100)

    const [sliderSideDisplay, setSliderSideDisplay] = useState({
        left: "none",
        right: "none"
    })

    window.addEventListener("resize", reset)

    useEffect(() => {
        setTranslate(5 - 87 * index)
        changeSliderSideDisplay()
    }, [index])

    useEffect(() => {
        changeSliderSideDisplay()
    }, [episodes])

    function increaseIndex() {
        let sliderItems = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--slider-items"))

        if (index + 1 < Math.ceil(episodes.length / sliderItems)) {
            setIndex(index + 1)
        }
    }

    function decreaseIndex() {
        if (index > 0) {
            setIndex(index - 1)
        }
    }

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
            <div className="relative">
                <div className="slider-bar flex overflow-hidden">
                    <div className="slider-side w-[4vw] absolute z-10 hover:bg-[rgba(0,0,0,0.5)]" style={{display: sliderSideDisplay.left}} onClick={decreaseIndex}>
                        <div className="flex h-full items-center justify-center">
                            <img src={sliderSideLeft} className="w-10" />
                        </div>
                    </div>
                    <div className="slider-center w-[80vw] flex transition-transform duration-700 ease-[cubic-bezier(0.42,0,0.58,1)]" style={{transform: `translateX(${translate}vw)`}}>
                        {episodes.map(e => (
                            <EpisodesSliderCell
                                episode = {e}
                            />
                        ))}
                    </div>
                    <div className="slider-side w-[4vw] absolute right-0 hover:bg-[rgba(0,0,0,0.5)] text-white font-bold text-4xl" style={{display: sliderSideDisplay.right}} onClick={increaseIndex}>
                        <div className="flex h-full items-center justify-center">
                            <img src={sliderSideRight} className="w-10" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}