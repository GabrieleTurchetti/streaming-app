import genres from "./getGenres"

type Titles = {
    id: number,
    type: string,
    name: string,
    genres: string[],
    coverPic: string
}[]

interface ResponseSuccess {
    results: {
        genre_ids: number[],
        id: number,
        title?: string,
        backdrop_path: string | null,
        vote_average: number,
        name?: string
    }[]
}

interface ResponseError {
    status_message: string,
    status_code: number,
    success: boolean
}

type Response = ResponseSuccess | ResponseError

export default async function getRelated(id: number, type: string) {
    const response: Response = await fetch(`https://api.themoviedb.org/3/${type === "film" ? "movie" : "tv"}/${id}/recommendations?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=it-IT&page=1`).then(res => res.json())

    if ("status_code" in (response as (ResponseSuccess & ResponseError))) {
        const responseError: ResponseError = response as ResponseError
        throw new Error(responseError.status_message)
    }

    return convertResponseToTitles(response as ResponseSuccess, type)
}

function convertResponseToTitles(response: ResponseSuccess, type: string) {
    const titles: Titles = []

    response.results.forEach(result => {
        titles.push({
            id: result.id,
            type: type,
            name: result.name || result.title || "",
            genres: result.genre_ids.map((n: number) => genres[n]),
            coverPic: result.backdrop_path !== null ? "https://image.tmdb.org/t/p/w500" + result.backdrop_path : "https://www.kcpls.org/sites/default/files/2023-02/movienight-graphic_0.jpg",
        })
    })


    return titles
}