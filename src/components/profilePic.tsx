import check from '../images/check.svg'

interface Props {
    number: number,
    changeProfilePicNumber: (number: number) => void,
    changeProfilePicDisplay: () => void
}

export default function ProfilePic({ number, changeProfilePicNumber, changeProfilePicDisplay }: Props) {
    return (
        <div className="relative">
            <div className={`profile-pic-${number} absolute rounded-full w-full h-full`} />
            <div className="absolute w-full h-full opacity-0 bg-black hover:opacity-50 rounded-full transition-opacity duration-150 flex justify-center" onClick={() => {
                changeProfilePicNumber(number)
                changeProfilePicDisplay()
            }}>
                <img src={check} className="w-24" />
            </div>
        </div>
    )
}