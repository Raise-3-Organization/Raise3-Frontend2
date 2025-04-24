import Image from "next/image";
import  Header  from "@/components/landingPage/Header";
import Hero from "@/components/landingPage/Hero";
import Funding from "@/components/landingPage/Funding";


export default function Home() {
  return (
    <main className="min-h-screen bg-black">
    <Header />
    <Hero />
    <Funding />
  </main>
  );
}
