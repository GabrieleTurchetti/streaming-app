import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { Link } from 'react-router-dom'
import getSearch from '../requests/getSearch'
import TitleSlider from '../components/titleSlider'

interface Props {
    searchName: string
}

type Titles = {
    id: number,
    type: string,
    name: string,
    genres: string[],
    coverPic: string
}[]

export default function Search({ searchName }: Props) {
    const [searchTitles, setSearchTitles] = useState<Titles>([])
    const [sliderItems, setSliderItems] = useState(5)

    useEffect(() => {
        if (searchName !== "") {
            getSearch(searchName).then(res => {
                const titles: Titles = res as Titles
                setSearchTitles(titles)
            }).catch(error => console.error(error))
        }
    }, [searchName])

    useEffect(() => {
        window.addEventListener("resize", changeSliderItems)
        changeSliderItems()

        return () => {
            window.removeEventListener("resize", changeSliderItems)
        }
    })

    function getSliders(sliderItems: number) {
        const result = []

        for (let i = 0; i < Math.ceil(searchTitles.length / sliderItems); i++) {
            result.push(<TitleSlider
                name = {""}
                titles = {searchTitles.slice(i * sliderItems, (i * sliderItems) + sliderItems)}
            />)
        }

        return result
    }

    function changeSliderItems() {
        const sliderItems = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--slider-items"))
        setSliderItems(sliderItems)
    }

    return (
        <>
            {!isMobile && <div className="flex gap-16 py-16 flex-col items-center">
                {getSliders(sliderItems)}
            </div>}
            {isMobile && <div className="p-2">
                {searchTitles.map(title => (
                    <Link to={`/${title.type}/title/${title.id}`} className="flex gap-2 p-2">
                        <div className="flex-1 aspect-video bg-cover" style={{backgroundImage: `url(${title.coverPic})`}} />
                        <div className="flex-1 text-white">
                            <p className="font-medium text-lg">{title.name.length < 30 ? title.name : title.name.substring(0, 30) + " ..."}</p>
                            <p>{title.genres.join(" • ").length < 15 ? title.genres.join(" • ") : title.genres.join(" • ").substring(0, 15) + " ..."}</p>
                        </div>
                    </Link>
                ))}
            </div>}
        </>
    )
}