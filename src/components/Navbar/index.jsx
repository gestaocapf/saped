import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
    return (
        <Link href='/'>
            <div className="flex items-center bg-[#5BB7B6] w-full text-white h-[90px] px-[45px] py-[24px]">
                <Image
                    aria-hidden
                    src="/capf.svg"
                    alt="CAPF icon"
                    width={44}
                    height={44}
                />
                <div className="flex flex-col pl-[16px]">
                    <p className="font-bold text-[20px]">SAPed <span className="text-[10px]">BETA</span></p>
                    <p className="text-[10px]">Centro Acadêmico Paulo Freire</p>
                </div>
            </div>
        </Link>

    )
}

export default Navbar;