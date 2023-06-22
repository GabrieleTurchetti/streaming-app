import genres from "./getGenres"

type Titles = {
    id: number,
    type: string,
    name: string,
    genres: string,
    coverPic: string
}[]

interface Dates {
    maximum: string,
    minimum: string
}

interface ResponseSuccess {
    results: {
        genre_ids: number[],
        id: number,
        title: string,
        backdrop_path: string | null
    }[]
}

interface ResponseError {
    status_message: string,
    status_code: number,
    success: boolean
}

type Response = ResponseSuccess | ResponseError

export default async function getUpcoming() {
    const response: Response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=it-IT&page=1`).then(res => res.json())

    if ("status_code" in (response as (ResponseSuccess & ResponseError))) {
        const responseError: ResponseError = response as ResponseError
        throw new Error(responseError.status_message)
    }

    return convertResponseToTitles(response as ResponseSuccess)
}

function convertResponseToTitles(response: ResponseSuccess) {
    const titles: Titles = []

    response.results.forEach(result => {
        titles.push({
            id: result.id,
            type: "film",
            name: result.title,
            genres: result.genre_ids.map(n => genres[n]).join(","),
            coverPic: result.backdrop_path !== null ? "https://image.tmdb.org/t/p/w500" + result.backdrop_path : "https://www.orange.nsw.gov.au/gallery/wp-content/uploads/2021/12/Fall-Movie-Review-GBtGCT.tmp_.jpg",
        })
    })

    return titles
}