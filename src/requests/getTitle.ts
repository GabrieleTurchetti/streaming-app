interface Title {
    id: number,
    type: string,
    pic: string,
    name: string,
    year: number,
    time?: number,
    seasons?: number,
    plot: string,
    rating: number,
    genres: string[],
    companies: string[]
}

interface ResponseSuccess {
    id: number,
    backdrop_path: string,
    title?: string,
    name?: string,
    release_date?: string,
    first_air_date?: string,
    runtime?: number | null,
    number_of_seasons?: number,
    overview: string,
    vote_average: number,
    genres: {
        id: number,
        name: string
    }[],
    production_companies: {
        id: number,
        logo_path: string,
        name: string,
        origin_country: string
    }[]
}

interface ResponseError {
    status_message: string,
    status_code: number,
    success: boolean
}

type Response = ResponseSuccess | ResponseError

export default async function getTitle(id: number, type: string) {
    const response: Response = await fetch(`https://api.themoviedb.org/3/${type === "film" ? "movie" : "tv"}/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=it-IT`).then(res => res.json())

    if ("status_code" in (response as (ResponseSuccess & ResponseError))) {
        return {}
    }

    return convertResponseToTitle(response as ResponseSuccess, type)
}

function convertResponseToTitle(response: ResponseSuccess, type: string) {
    const title: Title = {
        id: response.id,
        type: type,
        pic: response.backdrop_path !== null ? "https://image.tmdb.org/t/p/original" + response.backdrop_path : "https://www.orange.nsw.gov.au/gallery/wp-content/uploads/2021/12/Fall-Movie-Review-GBtGCT.tmp_.jpg",
        name: response.name || response.title || "",
        year: parseInt(response.release_date?.substring(0, 4) || response.first_air_date?.substring(0, 4) || "0"),
        plot: response.overview.length <= 150 ? response.overview : response.overview.substring(0, 150) + " ...",
        rating: response.vote_average * 10,
        genres: response.genres.map(e => e.name),
        companies: response.production_companies.map(e => e.name),
        seasons: response.number_of_seasons,
        time: response.runtime || -1
    }

    return title
}