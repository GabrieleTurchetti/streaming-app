import { useState } from 'react'
import Slider from '../components/slider'
import pencil from '../images/pencil.svg'
import check from '../images/check.svg'

interface Props {
    profilePicNumber: string
    changeProfilePicNumber: (profilePicNumber: string) => void
}

export default function Profile({ profilePicNumber, changeProfilePicNumber }: Props) {
    const [profilePicDisplay, setProfilePicDisplay] = useState(false)

    return (
        <>
            <div className="absolute">
                <div className="flex mt-14 justify-center">
                    <div id="profile-info-container" className="h-[28rem] w-[56rem] flex flex-col rounded-md text-white">
                        <p className="text-2xl px-10 h-16 flex items-center">Profilo</p>
                        <div id="profile-info-linebreak" className="w-full h-[1px]"></div>
                        <div className="flex gap-14 p-10">
                            <div className="w-36 flex justify-center">
                                <div className={`w-32 h-32 absolute profile-pic-${profilePicNumber}`} />
                                <div className="absolute w-32 h-32 opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {setProfilePicDisplay(!profilePicDisplay)}}>
                                    <img src={pencil} className="w-20" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-6 text-lg">
                                <div className="flex gap-16">
                                    <div>
                                        <p className="profile-info-header">Nome</p>
                                        <p>Mario</p>
                                    </div>
                                    <div>
                                        <p className="profile-info-header">Cognome</p>
                                        <p>Rossi</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="profile-info-header">Email</p>
                                    <p>mariorossi@gmail.com</p>
                                </div>
                                <div>
                                    <p className="profile-info-header">Telefono</p>
                                    <p>1231231234</p>
                                </div>
                                <div>
                                    <p className="profile-info-header">Iscritto il:<span className="ml-3 text-white">1 gennaio 2023</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-14 flex justify-center">
                    <Slider
                        name = {"Salvati"}
                        titles = {[]}
                    />
                </div>
            </div>
            <div className={`w-full h-full bg-black absolute invisible opacity-0 transition-all duration-300 ${profilePicDisplay ? "profile-pic-filter-active" : ""}`} />
            <div className={`w-full h-full invisible absolute flex justify-center items-center ${profilePicDisplay ? "profile-pic-background-active" : ""}`} onClick={() => {setProfilePicDisplay(!profilePicDisplay)}}>
                <div id="profile-pic-container" className={`translate-y-[-6rem] p-4 rounded-md fixed w-[28rem] h-[28rem] transition-all duration-300 gap-4 opacity-0 ${profilePicDisplay ? "profile-pic-container-active" : ""}`}>
                    <div className="relative">
                        <div className="profile-pic-0 absolute w-full h-full" />
                        <div className="absolute w-full h-full opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {changeProfilePicNumber("0")}}>
                            <img src={check} className="w-24" />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="profile-pic-1 absolute w-full h-full" />
                        <div className="absolute w-full h-full opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {changeProfilePicNumber("1")}}>
                            <img src={check} className="w-24" />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="profile-pic-2 absolute w-full h-full" />
                        <div className="absolute w-full h-full opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {changeProfilePicNumber("2")}}>
                            <img src={check} className="w-24" />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="profile-pic-3 absolute w-full h-full" />
                        <div className="absolute w-full h-full opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {changeProfilePicNumber("3")}}>
                            <img src={check} className="w-24" />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="profile-pic-4 absolute w-full h-full" />
                        <div className="absolute w-full h-full opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {changeProfilePicNumber("4")}}>
                            <img src={check} className="w-24" />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="profile-pic-5 absolute w-full h-full" />
                        <div className="absolute w-full h-full opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {changeProfilePicNumber("5")}}>
                            <img src={check} className="w-24" />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="profile-pic-6 absolute w-full h-full" />
                        <div className="absolute w-full h-full opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {changeProfilePicNumber("6")}}>
                            <img src={check} className="w-24" />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="profile-pic-7 absolute w-full h-full" />
                        <div className="absolute w-full h-full opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {changeProfilePicNumber("7")}}>
                            <img src={check} className="w-24" />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="profile-pic-8 absolute w-full h-full" />
                        <div className="absolute w-full h-full opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {changeProfilePicNumber("8")}}>
                            <img src={check} className="w-24" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}