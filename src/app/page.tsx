import Image from "next/image";
import  Header  from "@/components/landingPage/Header";
import Hero from "@/components/landingPage/Hero";
import Funding from "@/components/landingPage/Funding";
import Footer from "@/components/landingPage/Footer"
// import Waitlist from "@/components/ui/waitlist-modal";
import Features from "@/components/landingPage/Features";


export default function Home() {
  return (
    <main className="min-h-screen bg-black">
    {/* <Waitlist/> */}
    <Header />
    <Hero />
    <Funding />
    <Features />


    
    <Footer/>
    
  </main>
  );
}
