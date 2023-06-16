import { useEffect, useState } from 'react'
import getSearch from '../requests/getSearch'
import TitleSlider from '../components/titleSlider'
import useTimeout from '../hooks/useTimeout'

interface Props {
    searchName: string
}

type Titles = {
    id: number,
    type: string,
    name: string,
    genres: string,
    coverPic: string
}[]

export default function Search({ searchName }: Props) {
    const [searchTitles, setSearchTitles] = useState<Titles>([])
    const [sliderItems, setSliderItems] = useState(5)
    const { reset } = useTimeout(changeSliderItems, 100)

    useEffect(() => {
        if (searchName !== "") {
            getSearch(searchName).then(res => {
                const titles: Titles = res as Titles
                setSearchTitles(titles)
            }).catch(error => console.error(error))
        }
    }, [searchName])

    window.addEventListener("resize", reset)

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
        <div className="flex gap-16 py-16 flex-col items-center">
            {getSliders(sliderItems)}
        </div>
    )
}