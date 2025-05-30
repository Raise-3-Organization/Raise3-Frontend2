'use client'

import { RocketIcon, X } from "lucide-react"
import Link from "next/link";
import {MouseEventHandler, useState} from 'react'

type form = {
    fullname: string;
    email: string;
    country: string;
}

const Waitlist = (props: { close: MouseEventHandler<SVGSVGElement> | undefined; }) =>{

    const [fullname, setFullname] = useState<form['fullname']>('')
    const [email, setEmail] = useState<form['email']>('')
    const [country, setCountry] = useState<form['country']>('')
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = () =>{
        setSubmitting(true);
    }
   

    return(
        <>
        
        <div className='flex items-center flex-col fixed z-1000  justify-center w-screen h-screen'>
            <div className="flex -mt-10 gap-3 rounded-lg shadow-2xl bg-[#05091B] sm:w-6/12  w- 9/12 px-6 py-6 flex-col">
                <div className="flex w-full justify-between items-center">
                    <h1 className="capitalize sm:text-3xl text-2xl font-bold font-krona">join our <span>waitlist </span></h1>
                    <span><X onClick={props.close}/></span>
                </div>
                <p className="text-xs">Join the Raise3 waitlist today! Connect with innovative founders  <br/>and investors 
                in Web3 and gain early access to exclusive networking tools!</p>
                <div className='w-full flex   '>
                    <form action="" className='w-full gap-3 flex flex-col '>

                        <span className='flex flex-col gap-1 '>
                            <label htmlFor="fullname" className='text-xs text-white'>Full Name</label>
                            <input 
                            type="text" 
                            name="fullname"
                            id="fullname" 
                            value={fullname}
                            placeholder="Enter Your Full Name"
                            onChange = {(e) => setFullname(e.target.value)}
                            className='p-2 text-sm rounded-sm  bg-[#1A1D2E]'
                            />
                        </span>
                        <span className='flex flex-col gap-1 '>
                            <label htmlFor="fullname" className='text-xs text-white'>Email</label>
                            <input 
                            type="text" 
                            name="fullname"
                            id="fullname" 
                            value={email}
                            placeholder="example@gmail.com"
                            onChange = {(e) => setEmail(e.target.value)}
                            className='p-2 text-sm rounded-sm bg-[#1A1D2E]'
                            />
                        </span>
                        <span className='flex flex-col gap-1 '>
                            <label htmlFor="fullname" className='text-xs text-white'>Country</label>
                            <input 
                            type="text" 
                            name="fullname"
                            id="fullname" 
                            value={country}
                            placeholder="Enter your country"
                            onChange = {(e) => setCountry(e.target.value)}
                            className='p-2 text-sm rounded-sm bg-[#1A1D2E]' 
                            />
                        </span>

                        <button 
                        type="submit"
                        className="py-2 px-10 bg-white rounded-4xl text-black flex items-center justify-center font-semibold  text-xs gap-2 mt-8"
                        >
                           <RocketIcon size={18}/> {submitting? 'Joining Waitlist': 'Join The Waitlist'}
                        </button>
                        
                        <div className="mt-10  gap-4 flex text-center flex-col items-center justify-center w-full">
                            <div>
                                <p className="text-xs">you got questions?</p>
                                <p className="text-md">Contact for Support</p>
                            </div>
                            <div className="text-center items-center justify-center flex flex-col">
                                <p className='text-xs'>Accept <Link href='#' className='text-blue-800'>terms of service</Link>  or  <Link href='#' className='text-blue-800'>privacy policy</Link></p>
                                <span className="flex gap-2"><input type="checkbox" name="accept" id="" /><p className='text-xs'>i read and accept</p></span>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>

        </>
    )
}

export default Waitlist