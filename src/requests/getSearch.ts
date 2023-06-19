import genres from "./getGenres"


type Titles = {
    id: number,
    type: string,
    name: string,
    genres: string,
    coverPic: string
}[]
interface ResponseSuccess {
    results: {
        genre_ids: number[],
        id: number,
        media_type: string,
        title?: string,
        backdrop_path: string | null,
        name?: string
    }[]
}
interface ResponseError {
    status_message: string,
    status_code: number,
    success: boolean
}

type Response = ResponseSuccess | ResponseError

export default async function getSearch(name: string) {
    const response: Response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${name}&include_adult=false&language=it-IT&page=1`).then(res => res.json())

    if ("status_code" in (response as (ResponseSuccess & ResponseError))) {
        return []
    }

    return await convertResponseToTitles(response as ResponseSuccess)
}

function convertResponseToTitles(response: ResponseSuccess) {
    const titles: Titles = []

    response.results.filter(e => e.media_type !== "person").forEach(result => {
        titles.push({
            id: result.id,
            type: result.media_type === "movie" ? "film" : "series",
            name: result.name || result.title || "",
            genres: result.genre_ids.map(n => genres[n]).join(","),
            coverPic: result.backdrop_path !== null ? "https://image.tmdb.org/t/p/w500" + result.backdrop_path : "https://www.orange.nsw.gov.au/gallery/wp-content/uploads/2021/12/Fall-Movie-Review-GBtGCT.tmp_.jpg",
        })
    })

    return titles
}