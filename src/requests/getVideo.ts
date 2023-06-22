interface ResponseSuccess {
    results: {
        key: string
    }[]
}
interface ResponseError {
    status_message: string,
    status_code: number,
    success: boolean
}

type Response = ResponseSuccess | ResponseError

export default async function getVideo(id: number, type: string) {
    const response: Response = await fetch(`https://api.themoviedb.org/3/${type === "film" ? "movie" : type === "series" ? "tv" : "all"}/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`).then(res => res.json())

    if ("status_code" in (response as (ResponseSuccess & ResponseError))) {
        const responseError: ResponseError = response as ResponseError
        throw new Error(responseError.status_message)
    }

    return convertResponseToVideo(response as ResponseSuccess)
}

async function convertResponseToVideo(response: ResponseSuccess) {
    if (response.results.length !== 0) {
        return "https://www.youtube.com/embed/" + response.results[0].key
    }

    return ""
}