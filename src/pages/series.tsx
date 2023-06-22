import Head from '../components/head'
import { useState, useEffect } from 'react'
import getPopular from '../requests/getPopular'
import getTopRated from '../requests/getTopRated'
import TitleSlider from '../components/titleSlider'

type Titles = {
    id: number,
    type: string,
    name: string,
    genres: string,
    coverPic: string
}[]

export default function Home() {
    const [popular, setPopular] = useState<Titles>([]) // variabile di stato contenente le informazioni dei titoli più popolari
    const [topRated, setTopRated] = useState<Titles>([]) // variabile di stato contenente le informazioni dei titoli con il voto più alto

    // variabile di stato utilizzata per il rendering degli slider solo quando le informazioni relative sono state acquisite
    const [loaded, setLoaded] = useState({
        popular: false,
        topRated: false
    })

    // acquisisce le informazioni dei titoli delle varie sezioni
    useEffect(() => {
        getPopular("series").then(res => {
            const titles: Titles = res as Titles
            setPopular(titles)

            setLoaded(prev => ({
                ...prev,
                popular: true
            }))
        }).catch(error => console.error(error))
        getTopRated("series").then(res => {
            const titles: Titles = res as Titles
            setTopRated(titles)

            setLoaded(prev => ({
                ...prev,
                topRated: true
            }))
        }).catch(error => console.error(error))
    }, [])

    return (
        <>
            <Head
                page = "series"
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
            </div>
        </>
    )
}