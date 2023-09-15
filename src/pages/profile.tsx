import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import { isMobile } from 'react-device-detect'
import pencil from '../images/pencil.svg'
import verified from '../images/verified.svg'
import notVerified from '../images/not-verified.svg'
import ProfilePic from '../components/profilePic'
import TitleSlider from '../components/titleSlider'
import getTitle from '../requests/getTitle'

type Title = {
    id: number,
    type: string,
    name: string,
    genres: string[],
    coverPic: string
}

interface Props {
    changeProfilePicNumber: (profilePicNumber: number) => void
}

export default function Profile({ changeProfilePicNumber }: Props) {
    const [profilePicsDisplay, setProfilePicsDisplay] = useState(false)
    const user = useContext(UserContext)
    const navigate = useNavigate()
    const profilePics = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const [savedTitles, setSavedTitles] = useState<Title[]>([])

    useEffect(() => {
        getSavedTitles().then(res => setSavedTitles(res))
    }, [user.saved])

    async function getSavedTitles() {
        const tempSavedTitles: Title[] = []

        for (let i = 0; i < Object.keys(user.saved).length; i++) {
            await getTitle(parseInt(Object.keys(user.saved)[i]), user.saved[parseInt(Object.keys(user.saved)[i])]).then((res: Title) => {
                tempSavedTitles.push(res)
            }).catch(error => console.error(error))
        }

        return tempSavedTitles
    }

    return (
        <>
            <div className="flex justify-center my-16">
                <div className={`container ${isMobile ? "w-[20rem]" : "w-[56rem]"} flex-col flex rounded-md text-white`}>
                    <p className="text-2xl px-10 h-16 flex items-center">Profilo</p>
                    <div className="container-line-break w-full h-[1px]"></div>
                    <div className={`${isMobile ? "flex-col gap-6" : "gap-14"} flex p-10`}>
                        <div className={`${isMobile ? "w-full" : "w-36"} h-36 flex justify-center`}>
                            <div className={`w-32 h-32 absolute profile-pic-${user.pic}`} />
                            <div className="absolute w-32 h-32 opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {setProfilePicsDisplay(!profilePicsDisplay)}}>
                                <img src={pencil} className="w-20" />
                            </div>
                        </div>
                        {user.id !== "" && <div className="flex flex-col gap-6 text-lg">
                            <div>
                                <p className="profile-info-header">Nickname</p>
                                <p>{user.nickname}</p>
                            </div>
                            <div>
                                <p className="profile-info-header">Email</p>
                                <div className="flex gap-4">
                                    {!isMobile && <p>{user.email}</p>}
                                    {isMobile && <div>
                                        {(user.email.match(/.{1,20}/g) ?? []).map(str => (<p>{str}</p>))}
                                    </div>}
                                    <img src={user.verified ? verified : notVerified} className="w-6 cursor-pointer" title={user.verified ? "verificata" : "non verificata"} onClick={() => {
                                        if (!user.verified) {
                                            navigate("/verification")
                                        }
                                    }} />
                                </div>
                            </div>
                            <div>
                                <p className="profile-info-header">Iscritto il:<span className="ml-4 text-white">{user.joined}</span></p>
                            </div>
                            <div>
                                <p id="profile-info-change-password" className="cursor-pointer transition-[color] duration-150" onClick={() => navigate("/change-password")}>Cambia password</p>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
            {savedTitles.length !== 0 && <div className="pb-14 pt-2 flex justify-center">
                <TitleSlider
                    name = {"Salvati"}
                    titles = {savedTitles}
                />
            </div>}
            <div className={`w-screen h-screen fixed top-0 bg-black transition-all duration-300 z-20 ${profilePicsDisplay ? "opacity-50" : "invisible opacity-0"}`} onClick={() => setProfilePicsDisplay(false)} />
            <div id="profile-pics-container" className={`z-20 left-[50vw] top-[50vh] fixed p-4 rounded-md ${isMobile ? "w-[20rem] h-[20rem]" : "w-[28rem] h-[28rem]"} transition-all duration-300 gap-4 translate-x-[-50%] ${profilePicsDisplay ? "translate-y-[-50%]" : "opacity-0 translate-y-[-60%] invisible"}`}>
                {profilePics.map(e => <ProfilePic
                    number = {e}
                    changeProfilePicNumber = {changeProfilePicNumber}
                    changeProfilePicDisplay = {() => setProfilePicsDisplay(false)}
                />)}
            </div>
        </>
    )
}