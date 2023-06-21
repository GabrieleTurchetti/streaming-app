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

    const [loaded, setLoaded] = useState({
        popular: false,
        topRated: false,
        upComing: false
    })

    useEffect(() => {
        getPopular("film").then(res => {
            const titles: Titles = res as Titles
            setPopular(titles)

            setLoaded(prev => ({
                ...prev,
                popular: true
            }))
        }).catch(error => console.error(error))
        getTopRated("film").then(res => {
            const titles: Titles = res as Titles
            setTopRated(titles)

            setLoaded(prev => ({
                ...prev,
                topRated: true
            }))
        }).catch(error => console.error(error))
        getUpcoming().then(res => {
            const titles: Titles = res as Titles
            setUpcoming(titles)

            setLoaded(prev => ({
                ...prev,
                upComing: true
            }))
        }).catch(error => console.error(error))
    }, [])

    return (
        <>
            <Head
                page = "film"
            />
            <div className="py-14 flex flex-col gap-12 items-center">
            {loaded.popular && <TitleSlider
                name = {"Attualmente popolari"}
                titles = {popular}
            />}
            {loaded.topRated && <TitleSlider
                name = {"Più votati"}
                titles = {topRated}
            />}
            {loaded.upComing && <TitleSlider
                name = {"In arrivo"}
                titles = {upcoming}
            />}
            </div>
        </>
    )
}