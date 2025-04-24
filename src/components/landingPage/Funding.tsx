import React from 'react';
import { RocketIcon, WalletIcon, UsersIcon } from 'lucide-react';

const Funding: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="text-center mb-12">
        <p className="text-sm text-gray-400">Why We Exist?</p>
        <h1 className="text-4xl md:text-6xl font-bold my-4">
          Funding a <span className="text-gradient bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">Web3</span> project is hard.
        </h1>
        <p className="text-lg text-gray-300">Raising your first check shouldn’t be.</p>
        <div className="mt-6 flex justify-center gap-4">
          <button className="px-10 py-2 rounded-full bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] hover:opacity-90  text-white font-semibold cursor-pointer">Get Started</button>
          <button className="px-6 py-3 rounded-full border border-white text-white font-semibold cursor-pointer">Explore Projects</button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-b from-[#381d4c] to-black text-white rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <RocketIcon size={48} className="mb-4 text-pink-400" />
            <h3 className="text-xl font-bold mb-2">Founders</h3>
            <p className="text-sm text-gray-400">
              Founders who want to focus on building, not chasing investor intros
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#3b1d40] to-black text-white rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <WalletIcon size={48} className="mb-4 text-purple-400" />
            <h3 className="text-xl font-bold mb-2">Investors</h3>
            <p className="text-sm text-gray-400">
              Investors who want early access to real projects with real terms
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#1e1f3b] to-black text-white rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col items-center text-center">
            <UsersIcon size={48} className="mb-4 text-blue-400" />
            <h3 className="text-xl font-bold mb-2">Teams</h3>
            <p className="text-sm text-gray-400">
              Teams who care about transparency, speed, and doing things on-chain
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Funding;
