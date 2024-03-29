import TitleSliderCell from './titleSliderCell'
import { useState, useEffect } from 'react'
import { isMobile } from 'react-device-detect'
import sliderSideRight from '../images/slider-side-right.svg'
import sliderSideLeft from '../images/slider-side-left.svg'

interface Props {
    name: string,
    titles: {
        id: number,
        type: string,
        name: string,
        genres: string[],
        coverPic: string
    }[],
}

export default function TitleSlider({ name, titles }: Props) {
    const [index, setIndex] = useState(0)

    const [sliderSideDisplay, setSliderSideDisplay] = useState({
        left: "none",
        right: "none"
    })

    useEffect(() => {
        window.addEventListener("resize", changeSliderSideDisplay)

        return () => {
            window.removeEventListener("resize", changeSliderSideDisplay)
        }
    })

    useEffect(() => {
        changeSliderSideDisplay()
    }, [index])

    useEffect(() => {
        changeSliderSideDisplay()
    }, [titles])

    function increaseIndex() {
        let sliderItems = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--slider-items"))

        if (index + 1 < Math.ceil(titles.length / sliderItems)) {
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

        if (index + 1 < Math.ceil(titles.length / sliderItems)) {
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
        console.log("ciaoa")
    }

    return (
        <div className="slider flex flex-col gap-2">
            <p className="text-2xl font-medium slider-title">{name}</p>
            <div className={`${isMobile ? "overflow-auto" : "overflow-hidden"} slider-bar flex relative`}>
                <div className={`slider-side w-[4vw] absolute z-10 ${isMobile ? "" : "hover:bg-[rgba(0,0,0,0.5)] text-white font-bold text-4xl"}`} style={{display: sliderSideDisplay.left}} onClick={decreaseIndex}>
                    {!isMobile && <div className="flex h-full items-center justify-center">
                        <img src={sliderSideLeft} className="w-10" />
                    </div>}
                </div>
                <div className="slider-center w-[80vw] flex transition-transform duration-700 ease-[cubic-bezier(0.42,0,0.58,1)]" style={{transform: `translateX(${5 - 87 * index}vw)`}}>
                    {titles.map(title => (
                        <TitleSliderCell
                            title = {title}
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