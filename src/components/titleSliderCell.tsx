import { Link } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import { useRef, useEffect, useContext } from 'react'
import { SavedTitlesContext, UserContext } from '../App'
import playCircle from '../images/play-circle.svg'
import checkFilled from '../images/check-filled.svg'
import addFilled from '../images/add-filled.svg'

interface Props {
    title: {
        id: number,
        type: string,
        name: string,
        genres: string[],
        coverPic: string
    },
}

export default function SliderCell({ title }: Props) {
    const sliderCell = useRef<HTMLInputElement>(null)
    const saveTitleButton = useRef<any>(null)
    const savedTitle = useContext(SavedTitlesContext)
    const user = useContext(UserContext)
    useEffect(() => {
        saveTitleButton.current?.addEventListener('click', function(event: any) {
            event.preventDefault();
        });
    }, [])

    return (
        <Link to={`/${title.type}/title/${title.id}`}>
            <div ref={sliderCell} className="slider-cell aspect-video cursor-pointer bg-[length:100%_100%] hover:bg-[length:115%_115%] bg-center transition-[background] duration-300" style={{backgroundImage: `url(${title.coverPic})`}}>
                <div className={`slider-cell-over invisible flex flex-col ${isMobile ? "justify-end" : "justify-between"} p-[7.5%] text-white h-full shadow-[inset_0_-100px_100px_0_rgba(0,0,0,0.75)]`}>
                    {!isMobile && <div className="flex gap-[5%]">
                        <Link className="inline-block w-1/5" to={title.type === "film" ? `/film/watch/${title.id}` : `/series/watch/${title.id}`}>
                            <img src={playCircle} className="opacity-80 duration-150 hover:opacity-100" />
                        </Link>
                        <img ref={saveTitleButton} src={(title?.id || 0) in user.saved ? checkFilled : addFilled} className="w-8 opacity-80 hover:opacity-100 cursor-pointer" onClick={() => title !== undefined && (title.id in user.saved ? savedTitle.remove(title.id, title.type) : savedTitle.add(title.id, title.type))} />
                    </div>}
                    <div>
                        <p className="font-medium" style={{fontSize: `${(sliderCell.current?.offsetWidth || 0) / 14}px`}}>{title.name.length < 20 ? title.name : title.name.substring(0, 20) + " ..."}</p>
                        <p style={{fontSize: `${(sliderCell.current?.offsetWidth || 0) / 18}px`}}>{title.genres.join(" • ").length < 25 ? title.genres.join(" • ") : title.genres.join(" • ").substring(0, 25) + " ..."}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}