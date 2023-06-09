import Head from '../components/head'
import { useState, useEffect } from 'react'
import getPopular from '../requests/getPopular'
import getTopRated from '../requests/getTopRated'
import getUpcoming from '../requests/getUpcoming'
import TitleSlider from '../components/titleSlider'

type Titles = {
    id: number,
    type: string,
    name: string,
    genres: string,
    coverPic: string
}[]

export default function Home() {
    const [popular, setPopular] = useState<Titles>([])
    const [topRated, setTopRated] = useState<Titles>([])
    const [upcoming, setUpcoming] = useState<Titles>([])

    useEffect(() => {
        getPopular("film").then(res => {
            const titles: Titles = res as Titles
            setPopular(titles)
        })
        getTopRated("film").then(res => {
            const titles: Titles = res as Titles
            setTopRated(titles)
        })
        getUpcoming().then(res => {
            const titles: Titles = res as Titles
            setUpcoming(titles)
        })
    }, [])

    return (
        <>
            <Head
                page = "film"
            />
            <div className="py-14 flex flex-col gap-12 items-center">
                <TitleSlider
                    name = {"Attualmente popolari"}
                    titles = {popular}
                />
                <TitleSlider
                    name = {"Più votati"}
                    titles = {topRated}
                />
                <TitleSlider
                    name = {"In arrivo"}
                    titles = {upcoming}
                />
            </div>
        </>
    )
}