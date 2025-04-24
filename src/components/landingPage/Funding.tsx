import React from 'react';
import Image from 'next/image';

const Funding: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-10 ">
      <div className="mx-auto w-[50%] mb-12">
        <p className="text-sm text-[#FFFFFF] w-30 bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] px-2 py-2 rounded-full">Why We Exist?</p>
        <h1 className="text-3xl md:text-6xl my-4 font-krona">
          Funding a <span className="text-gradient bg-gradient-to-r from-[#FF7171] to-[#2F50FF] bg-clip-text text-transparent">Web3</span> project is hard.
        </h1>
        <p className="text-lg text-gray-300">Raising your first check shouldn’t be.</p>
        <div className="mt-6 flex justify-center gap-4">
          <button className="px-10 py-2 rounded-full bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] hover:opacity-90 text-white font-semibold cursor-pointer">Get Started</button>
          <button className="px-6 py-3 rounded-full border border-white text-white font-semibold cursor-pointer">Explore Projects</button>
        </div>
      </div>

      <div className="gap-6 flex mx-56">
        {/* Founders Card */}
        <div className="relative text-white rounded-2xl px-8 py-6 shadow-lg overflow-hidden">
          <Image
            src="https://res.cloudinary.com/detc4yjdi/image/upload/v1745454604/Frame_34_ermems.png"
            alt="Founders background"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            width={300}
            height={300}
          />
          <div className="relative flex flex-col items-center text-center z-10">
            <Image
              src="https://res.cloudinary.com/detc4yjdi/image/upload/v1745454661/rocket_with_up_arrow_1_qh5rc8.png"
              alt="Rocket"
              className="mb-4"
              width={300}
              height={300}
            />
            <h3 className="text-xs font-bold mb-2 text-">Founders</h3>
            <p className="text-xs text-gray-300">
              Founders who want to focus on building, not chasing investor intros
            </p>
          </div>
        </div>

        {/* Investors Card */}
        <div className="relative text-white rounded-2xl p-4 shadow-lg overflow-hidden">
          <Image
            src="https://res.cloudinary.com/detc4yjdi/image/upload/v1745454594/Frame_35_jy4xur.png"
            alt="Investors background"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            width={300}
            height={300}
          />
          <div className="relative flex flex-col items-center text-center z-10">
          <Image
              src="https://res.cloudinary.com/detc4yjdi/image/upload/v1745454301/research_of_statistical_data_and_analytics_hgxisk.png"
              alt="Rocket"
              className="mb-4"
              width={300}
              height={300}
            />
            <h3 className="text-xl font-bold mb-2">Investors</h3>
            <p className="text-sm text-gray-300">
              Investors who want early access to real projects with real terms
            </p>
          </div>
        </div>

        {/* Teams Card */}
        <div className="relative text-white rounded-2xl p-6 shadow-lg overflow-hidden">
          <Image
            src="https://res.cloudinary.com/detc4yjdi/image/upload/v1745454589/Frame_36_shsgm6.png"
            alt="Teams background"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            width={300}
            height={300}
          />
          <div className="relative flex flex-col items-center text-center z-10">
          <Image
              src="https://res.cloudinary.com/detc4yjdi/image/upload/v1745454248/income_growth_vkgye6.png"
              alt="Rocket"
              className="mb-4"
              width={300}
              height={300}
            />
            <h3 className="text-xl font-bold mb-2">Teams</h3>
            <p className="text-sm text-gray-300">
              Teams who care about transparency, speed, and doing things on-chain
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Funding;
