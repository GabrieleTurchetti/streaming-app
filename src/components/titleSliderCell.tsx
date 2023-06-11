import { Link } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
interface Props {
    title: {
        id: number,
        type: string,
        name: string,
        genres: string,
        coverPic: string
    },
}

export default function SliderCell({ title }: Props) {
    return (
        <Link to={`/${title.type}/title/${title.id}`}>
            <div className="slider-cell aspect-video cursor-pointer bg-[length:100%_100%] hover:bg-[length:115%_115%] bg-center transition-[background] duration-300" style={{backgroundImage: `url(${title.coverPic})`}}>
                <div className={`slider-cell-over flex flex-col justify-end ${isMobile ? "p-3" : "p-4"} text-white h-full invisible shadow-[inset_0_-100px_100px_0_rgba(0,0,0,0.75)]`}>
                    <p className={`font-medium ${isMobile ? "text-sm" : "text-lg"}`}>{title.name.length < (isMobile ? 30 : 20) ? title.name : title.name.substring(0, (isMobile ? 30 : 20)) + " ..."}</p>
                    {!isMobile && <p className="text-sm">{title.genres.length < 20 ? title.genres.replaceAll(",", " • ") : title.genres.substring(0, 20).replaceAll(",", " • ") + " ..."}</p>}
                </div>
            </div>
        </Link>
    )
}