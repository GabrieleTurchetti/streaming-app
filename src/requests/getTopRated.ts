import genres from "./getGenres"

type Titles = {
    id: number,
    type: string,
    name: string,
    genres: string,
    coverPic: string,
    rating: number
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

export default async function getTopRated(page: string = "home") {
    if (page !== "home") {
        const response: Response = await fetch(`https://api.themoviedb.org/3/${page === "film" ? "movie" : "tv"}/top_rated?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=it-IT&page=1`).then(res => res.json())

        if ("status_code" in (response as (ResponseSuccess & ResponseError))) {
            const responseError: ResponseError = response as ResponseError
            throw new Error(responseError.status_message)
        }

        return convertResponseToTitles(response as ResponseSuccess, page)
    }

    const filmResponse: Response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=it-IT&page=1`).then(res => res.json())
    const seriesResponse: Response = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=it-IT&page=1`).then(res => res.json())

    if ("status_code" in (filmResponse as (ResponseSuccess & ResponseError)) && "status_code" in (seriesResponse as (ResponseSuccess & ResponseError))) {
        const filmResponseError: ResponseError = filmResponse as ResponseError
        const seriesResponseError: ResponseError = seriesResponse as ResponseError
        throw new Error(filmResponseError.status_message + "\n" +  seriesResponseError.status_message)
    }

    return convertResponseToTitles(filmResponse as ResponseSuccess, "film").concat(convertResponseToTitles(seriesResponse as ResponseSuccess, "series")).sort((a, b) => b.rating - a.rating).slice(0, 20)
}

function convertResponseToTitles(response: ResponseSuccess, type: string) {
    const titles: Titles = []

    if (response.results !== undefined) {
        response.results.forEach(result => {
            titles.push({
                id: result.id,
                type: type,
                name: result.name || result.title || "",
                genres: result.genre_ids.map(n => genres[n]).join(","),
                coverPic: result.backdrop_path !== null ? "https://image.tmdb.org/t/p/w500" + result.backdrop_path : "https://www.orange.nsw.gov.au/gallery/wp-content/uploads/2021/12/Fall-Movie-Review-GBtGCT.tmp_.jpg",
                rating: result.vote_average
            })
        })
    }

    return titles
}