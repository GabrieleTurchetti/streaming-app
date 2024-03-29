interface Head {
    id: number,
    type: string,
    pic: string
    name: string,
    plot: string,
}

interface ResponseSuccess {
    results: {
        overview: string,
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

interface SingleResponse {
    overview: string
}

export default async function getHead(page: string = "home") {
    const response: Response = await fetch(`https://api.themoviedb.org/3/trending/${page === "film" ? "movie" : page === "series" ? "tv" : "all"}/week?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=it-IT`).then(res => res.json())

    if ("status_code" in (response as (ResponseSuccess & ResponseError))) {
        const responseError: ResponseError = response as ResponseError
        throw new Error(responseError.status_message)
    }

    return convertResponseToHead(response as ResponseSuccess)
}

async function convertResponseToHead(response: ResponseSuccess) {
    const headResponse: SingleResponse = await fetch(`https://api.themoviedb.org/3/${response.results[0].media_type}/${response.results[0].id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=it-IT`).then(res => res.json())

    const head: Head = {
        id: response.results[0].id,
        type: response.results[0].media_type === "movie" ? "film" : "series",
        pic: response.results[0].backdrop_path !== null ? "https://image.tmdb.org/t/p/original" + response.results[0].backdrop_path : "https://www.kcpls.org/sites/default/files/2023-02/movienight-graphic_0.jpg",
        name: response.results[0].name || response.results[0].title || "",
        plot: headResponse.overview
    }

    return head
}