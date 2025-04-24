import React from 'react';
import Image from 'next/image';

const Funding: React.FC = () => {
  return (
    <>
    < div className="mx-auto  bg-black text-white py-10 ">
      <div className='w-[50%] mx-auto '>

        <p className="text-xs text-[#FFFFFF] w-35 bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] px-3 py-1 mb-6 rounded-full font-krona">Why We Exist?</p>
        <h1 className="text-3xl md:text-5xl my-4  font-krona mt-3 leading-18">
          Funding a <span className="text-gradient bg-gradient-to-r from-[#FF7171] to-[#2F50FF] bg-clip-text text-transparent pb-1.5s font-krona">Web3</span> project is hard.
        </h1>
        </div>
        <p className="text-lg text-gray-300 text-center mr-[17rem] font-krona">Raising your first check shouldn’t be.</p>
        <div className="mt-6 flex justify-center gap-4">
          <button className="px-10 py-2 rounded-full bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] hover:opacity-90 text-white font-semibold cursor-pointer font-krona">Get Started</button>
          <button className="px-6 py-3 rounded-full border border-white text-white font-semibold cursor-pointer font-krona">Explore Projects</button>
        </div>
      

      <div className="gap-6 flex mx-56 px-10 py-10 justify-center">
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
              width={200}
              height={200}
            />
            <h3 className="text-xl font-bold mb-2 font-krona">Founders</h3>
            <p className="text-sm text-gray-300 font-krona">
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
              alt="Investors"
              className="mb-4"
              width={200}
              height={200}
            />
            <h3 className="text-xl font-bold mb-2 font-krona">Investors</h3>
            <p className="text-sm text-gray-300 font-krona">
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
              src="https://res.cloudinary.com/detc4yjdi/image/upload/v1745509135/team_sign_on_puzzle_vui7b5.png"
              alt="Income"
              className="mb-4"
              width={200}
              height={200}
            />
            <h3 className="text-xl font-bold mb-2 font-krona">Teams</h3>
            <p className="text-sm text-gray-300 font-krona">
              Teams who care about transparency, speed, and doing things on-chain
            </p>
          </div>
        </div>
      </div>
    </div>

    </>
  );
};

export default Funding;
