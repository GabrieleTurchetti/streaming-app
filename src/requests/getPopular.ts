import genres from "./getGenres"

type Titles = {
    id: number,
    type: string,
    name: string,
    genres: string,
    coverPic: string
    popularity: number
}[]

interface ResponseSuccess {
    results: {
        genre_ids: number[],
        id: number,
        title?: string,
        backdrop_path: string | null,
        vote_average: number,
        name?: string,
        popularity: number
    }[]
}

interface ResponseError {
    status_message: string,
    status_code: number,
    success: boolean
}

type Response = ResponseSuccess | ResponseError

export default async function getPopular(page: string = "home") {
    if (page !== "home") {
        const response: Response = await fetch(`https://api.themoviedb.org/3/${page === "film" ? "movie" : "tv"}/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=it-IT&page=1`).then(res => res.json())

        if ("status_code" in (response as (ResponseSuccess & ResponseError))) {
            const responseError: ResponseError = response as ResponseError
            throw new Error(responseError.status_message)
        }

        return convertResponseToTitles(response as ResponseSuccess, page)
    }

    const filmResponse: Response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=it-IT&page=1`).then(res => res.json())
    const seriesResponse: Response = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=it-IT&page=1`).then(res => res.json())

    if ("status_code" in (filmResponse as (ResponseSuccess & ResponseError)) && "status_code" in (seriesResponse as (ResponseSuccess & ResponseError))) {
        const filmResponseError: ResponseError = filmResponse as ResponseError
        const seriesResponseError: ResponseError = seriesResponse as ResponseError
        throw new Error(filmResponseError.status_message + "\n" + seriesResponseError.status_message)
    }

    return convertResponseToTitles(filmResponse as ResponseSuccess, "film").concat(convertResponseToTitles(seriesResponse as ResponseSuccess, "series")).sort((a, b) => b.popularity - a.popularity).slice(0, 20)
}

function convertResponseToTitles(response: ResponseSuccess, type: string) {
    const titles: Titles = []

    if (response.results !== undefined) {
        response.results.forEach(result => {
            titles.push({
                id: result.id,
                type: type,
                name: result.name || result.title || "",
                genres: result.genre_ids.map((n: number) => genres[n]).join(","),
                coverPic: result.backdrop_path !== null ? "https://image.tmdb.org/t/p/w500" + result.backdrop_path : "https://www.orange.nsw.gov.au/gallery/wp-content/uploads/2021/12/Fall-Movie-Review-GBtGCT.tmp_.jpg",
                popularity: result.popularity
            })
        })
    }

    return titles
}