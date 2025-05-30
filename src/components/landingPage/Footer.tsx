import Image from "next/image"
import Link from "next/link"
export default function Footer(){

    return(
        <>
            <div className="flex p-4 items-center flex-col gap-10 justify-center w-full font-krona">
                <div className="sm:w-10/12 w-full flex sm:flex-row flex-col  sm:items-center justify-evenly">
                    <Image src="/image.png" alt="Raise3 Logo" width={80} height={80} />
                 <ul>
                    <h3 className="text-white font-bold text-lg">Platform</h3>
                    <li className="text-sm font-normal text-white"> <Link href='/fetaures'>Security</Link></li>
                    <li className="text-sm font-normal text-white"> <Link href='/fetaures'>Features</Link></li>
                    <li className="text-sm font-normal text-white"> <Link href='/fetaures'>Pricing</Link></li>
                    <li className="text-sm font-normal text-white"> <Link href='/fetaures'>FAQ's</Link></li>
                 </ul>
                 <ul>
                    <h3 className="text-white font-bold text-lg">Resources</h3>
                    <li className="text-sm font-normal text-white"> <Link href='/fetaures'>For Founders</Link></li>
                    <li className="text-sm font-normal text-white"> <Link href='/fetaures'>For Developers</Link></li>
                    <li className="text-sm font-normal text-white"> <Link href='/fetaures'>Blog</Link></li>
                    <li className="text-sm font-normal text-white"> <Link href='/fetaures'>Documentation</Link></li>
                 </ul>
                 <ul>
                    <h3 className="text-white font-bold text-lg">Company</h3>
                    <li className="text-sm font-normal text-white"> <Link href='/fetaures'>About Us</Link></li>
                    <li className="text-sm font-normal text-white"> <Link href='/fetaures'>Careers</Link></li>
                    <li className="text-sm font-normal text-white"> <Link href='/fetaures'>Contact</Link></li>
                    <li className="text-sm font-normal text-white"> <Link href='/fetaures'>Privacy Policy</Link></li>
                 </ul>
                </div>
                <div className="relative overflow-y-hidden w-full items-center self-center justify-center flex">
                    {/* <Image src='/Frame 27 (3).png' alt="Raise3 Logo" width={800} height={800} layout="" /> */}
                    <h1 className="sm:text-9xl text-4xl  p-10 font-bold font-krona text-white">Raise<sup>3</sup> </h1>
                    <div className="absolute sm:-bottom-12 -bottom-8  flex w-full items-center justify-center">
                    <div 
                        className="  sm:px-40 px-20  self-center items-center justify-center flex rounded-4xl h-1/3 pointer-events-none" 
                        style={{
                            boxShadow: '0 0 200px 70px #FF7171, inset 0 0 40px 20px #FF7171' , 
                        }}
                    ></div><div 
                        className=" sm:px-40 px-20  self-center items-center justify-center flex rounded-4xl h-1/3 pointer-events-none" 
                        style={{
                            boxShadow: '0 0 200px 70px #2F50FF, inset 0 0 150px 70px #2F50FF',
                        }}
                    ></div>
                    </div>
                </div>
            </div>
        </>
    )
}