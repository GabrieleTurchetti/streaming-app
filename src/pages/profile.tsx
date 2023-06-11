import { useState, useContext } from 'react'
import { UserContext } from '../App'
import { isMobile } from 'react-device-detect'
import pencil from '../images/pencil.svg'
import check from '../images/check.svg'

interface Props {
    changeProfilePicNumber: (profilePicNumber: number) => void
}

export default function Profile({ changeProfilePicNumber }: Props) {
    const [profilePicDisplay, setProfilePicDisplay] = useState(false)
    const user = useContext(UserContext)

    return (
        <>
            <div className="flex mt-14 justify-center">
                <div id="profile-info-container" className="h-[28rem] w-[56rem] flex flex-col rounded-md text-white">
                    <p className="text-2xl px-10 h-16 flex items-center">Profilo</p>
                    <div id="profile-info-linebreak" className="w-full h-[1px]"></div>
                    <div className="flex gap-14 p-10">
                        <div className="w-36 flex justify-center">
                            <div className={`w-32 h-32 absolute profile-pic-${user.pic}`} />
                            <div className="absolute w-32 h-32 opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {setProfilePicDisplay(!profilePicDisplay)}}>
                                <img src={pencil} className="w-20" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-6 text-lg">
                            <div>
                                <p className="profile-info-header">Nickname</p>
                                <p>{user.nickname}</p>
                            </div>
                            <div>
                                <p className="profile-info-header">Email</p>
                                <p>{user.email}</p>
                            </div>
                            <div>
                                <p className="profile-info-header">Iscritto il:<span className="ml-3 text-white">{user.joined}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <div className={`w-full h-full top-0 bg-black absolute transition-all duration-300 ${profilePicDisplay ? "profile-pic-filter-active" : "invisible opacity-0"}`} onClick={() => {setProfilePicDisplay(!profilePicDisplay)}} />
            <div className={`w-full h-full top-0 absolute flex justify-center items-center ${profilePicDisplay ? "profile-pic-background-active" : "invisible"}`}>
                <div id="profile-pic-container" className={`translate-y-[-6rem] p-4 rounded-md fixed ${isMobile ? "w-[20rem] h-[20rem]" : "w-[28rem] h-[28rem]"} transition-all duration-300 gap-4 ${profilePicDisplay ? "profile-pic-container-active" : "opacity-0"}`}>
                    <div className="relative">
                        <div className="profile-pic-1 absolute w-full h-full" />
                        <div className="absolute w-full h-full opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {
                            changeProfilePicNumber(1)
                            setProfilePicDisplay(!profilePicDisplay)}}>
                            <img src={check} className="w-24" />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="profile-pic-2 absolute w-full h-full" />
                        <div className="absolute w-full h-full opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {
                            changeProfilePicNumber(2)
                            setProfilePicDisplay(!profilePicDisplay)}}>
                            <img src={check} className="w-24" />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="profile-pic-3 absolute w-full h-full" />
                        <div className="absolute w-full h-full opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {
                            changeProfilePicNumber(3)
                            setProfilePicDisplay(!profilePicDisplay)}}>
                            <img src={check} className="w-24" />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="profile-pic-4 absolute w-full h-full" />
                        <div className="absolute w-full h-full opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {
                            changeProfilePicNumber(4)
                            setProfilePicDisplay(!profilePicDisplay)}}>
                            <img src={check} className="w-24" />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="profile-pic-5 absolute w-full h-full" />
                        <div className="absolute w-full h-full opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {
                            changeProfilePicNumber(5)
                            setProfilePicDisplay(!profilePicDisplay)}}>
                            <img src={check} className="w-24" />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="profile-pic-6 absolute w-full h-full" />
                        <div className="absolute w-full h-full opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {
                            changeProfilePicNumber(6)
                            setProfilePicDisplay(!profilePicDisplay)}}>
                            <img src={check} className="w-24" />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="profile-pic-7 absolute w-full h-full" />
                        <div className="absolute w-full h-full opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {
                            changeProfilePicNumber(7)
                            setProfilePicDisplay(!profilePicDisplay)}}>
                            <img src={check} className="w-24" />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="profile-pic-8 absolute w-full h-full" />
                        <div className="absolute w-full h-full opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {
                            changeProfilePicNumber(8)
                            setProfilePicDisplay(!profilePicDisplay)}}>
                            <img src={check} className="w-24" />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="profile-pic-9 absolute w-full h-full" />
                        <div className="absolute w-full h-full opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {
                            changeProfilePicNumber(9)
                            setProfilePicDisplay(!profilePicDisplay)}}>
                            <img src={check} className="w-24" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}