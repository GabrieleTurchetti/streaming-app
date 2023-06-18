import genres from "./getGenres"

type Titles = {
    id: number,
    type: string,
    name: string,
    genres: string,
    coverPic: string
    popularity: number
}[]

type Results = {
    poster_path: string | null,
    adult?: boolean,
    overview: string,
    release_date?: string,
    genre_ids: number[],
    id: number,
    original_title?: string,
    original_language?: string,
    title?: string,
    backdrop_path: string | null,
    popularity: number,
    vote_count: number,
    video?: boolean,
    vote_average: number,
    first_air_date?: string,
    origin_country?: string[],
    name?: string,
    original_name?: string,
}[]

interface Response {
    page?: number,
    results?: Results,
    total_results?: number,
    total_pages?: number,
    status_message?: string,
    status_code?: number
}

export default async function getPopular(page: string = "home") {
    if (page !== "home") {
        const response: Response = await fetch(`https://api.themoviedb.org/3/${page === "film" ? "movie" : "tv"}/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=it-IT&page=1`).then(res => res.json())

        if (response.results === undefined) {
            return []
        }

        return convertResultsToTitles(response.results, page)
    }

    const filmResponse: Response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=it-IT&page=1`).then(res => res.json())
    const seriesResponse: Response = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=it-IT&page=1`).then(res => res.json())

    if (filmResponse.results === undefined && seriesResponse.results === undefined) {
        return []
    }

    return convertResultsToTitles(filmResponse.results || [], "film").concat(convertResultsToTitles(seriesResponse.results || [], "series")).sort((a, b) => b.popularity - a.popularity).slice(0, 20)
}

function convertResultsToTitles(results: Results, type: string) {
    const titles: Titles = []

    results.forEach(result => {
        titles.push({
            id: result.id,
            type: type,
            name: result.name || result.title || "",
            genres: result.genre_ids.map((n: number) => genres[n]).join(","),
            coverPic: result.backdrop_path !== null ? "https://image.tmdb.org/t/p/w500" + result.backdrop_path : "https://www.orange.nsw.gov.au/gallery/wp-content/uploads/2021/12/Fall-Movie-Review-GBtGCT.tmp_.jpg",
            popularity: result.popularity
        })
    })

    return titles
}