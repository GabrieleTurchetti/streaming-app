type Episodes = {
    id: number,
    coverPic: string,
    number: number,
    name: string
}[]

interface ResponseSuccess {
    episodes: {
        id: number,
        still_path: string,
        episode_number: number,
        name: string
    }[]
}

interface ResponseError {
    status_message: string,
    status_code: number,
    success: boolean
}

type Response = ResponseSuccess | ResponseError

export default async function getSeasonsEpisodes(seriesId: number, seasons: number) {
    const seasonsEpisodes: Episodes[] = []

    for (let i = 1; i <= seasons; i++) {
        const response: Response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}}/season/${i}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=it-IT`).then(res => res.json())

        if ("status_code" in (response as (ResponseSuccess & ResponseError))) {
            const responseError: ResponseError = response as ResponseError
            throw new Error(responseError.status_message)
        }

        seasonsEpisodes.push(convertResponseToEpisodes(response as ResponseSuccess))
    }

    return seasonsEpisodes
}

function convertResponseToEpisodes(response: ResponseSuccess) {
    const episodes: Episodes = []

    response.episodes.forEach(episode => {
        episodes.push({
            id: episode.id,
            coverPic: episode.still_path !== null ? "https://image.tmdb.org/t/p/original" + episode.still_path : "https://www.kcpls.org/sites/default/files/2023-02/movienight-graphic_0.jpg",
            number: episode.episode_number,
            name: episode.name
        })
    })

    return episodes
}