import { Link, useParams } from 'react-router-dom'
interface Props {
    episode: {
        id: number,
        coverPic: string,
        number: number,
        name: string
    }
}

export default function EpisodeSliderCell({ episode }: Props) {
    const { type, id } = useParams()

    return (
        <Link to={type === "film" ? `/film/watch/${id}` : `/series/watch/${id}`}>
            <div className="slider-cell aspect-video cursor-pointer bg-[length:100%_100%] bg-center flex p-3 transition-[background] duration-300" style={{backgroundImage: `url(${episode.coverPic})`}}>
                <div className="text-white text-3xl self-end">{episode.number}</div>
            </div>
            <div className="text-white py-1 font-medium">{episode.name}</div>
        </Link>
    )
}