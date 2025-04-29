"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Funding = () => {
  return (
    <div className="bg-black text-white py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <p className="text-start w-[15%] text-xs bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] px-4 py-4 mb-6 rounded-full font-krona">
          Why We Exist?
        </p>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-krona leading-tight mb-4 w-[90%] text-start">
          Funding a <span className="bg-gradient-to-r from-[#FF7171] to-[#2F50FF] bg-clip-text text-transparent">Web3</span> project is hard.
        </h1>

        {/* Subtext */}
        <p className="text-lg text-gray-400 mb-10 font-krona text-start">
          Raising your first check shouldn’t be.
        </p>

        {/* Cards */}
        <p className="text-lg text-start text-gray-400 font-krona">Raise3 is built for:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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

        {/* Animated Button */}
        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <button
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] hover:opacity-90 font-krona text-white text-lg cursor-pointer"
            >
              <img
                src="https://res.cloudinary.com/detc4yjdi/image/upload/v1745863689/Frame_2_xg0ldz.png"
                alt="Launch Icon"
                className="w-5 h-5 text-white"
              />
              Join waitlist
            </button>
          </motion.div>
        </div>
        
      </div>
    </div>
  );
};

export default Funding;
