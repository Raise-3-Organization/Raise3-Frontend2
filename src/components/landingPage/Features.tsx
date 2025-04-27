'use client';
import React from 'react';
import FeatureCard from './FeatureCard';


const Features = () => {
  return (
    <section
      className="w-full py-20 px-4 bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/detc4yjdi/image/upload/v1745486871/Frame_39_ufvwgh.png')",
      }}
    >
      <div className="max-w-5xl mx-auto text-center font-krona">
        <span className="inline-block font-krona text-xs font-medium bg-gradient-to-r from-[#6448fe] to-[#fa52a0] text-white px-4 py-1 rounded-full mb-4">
          What You Get
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-krona">
          Best features provided <br />
          by{' '}
          <span className="text-transparent bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text">
            Raise3
          </span>
        </h2>
        <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto font-krona">
          A clean, founder-first dashboard, Smart contract-powered fundraising campaigns, Verified investor profiles, Conditional fund release based on milestones, Real-time updates, no guesswork
        </p>

        {/* Grid of Feature Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FeatureCard
            title="For Founders"
            desc="Upload your docs, set your terms, and go live. We’ll handle compliance, investor access, and fund flows."
            img="https://res.cloudinary.com/detc4yjdi/image/upload/v1745454294/rocket_with_up_arrow_mkhvgk.png"
            bgImage="https://res.cloudinary.com/detc4yjdi/image/upload/v1745454140/founders_wdcn9a.png"
          />
          <FeatureCard
            title="For Investors"
            desc="Filter projects, review docs, commit capital, and track performance. All in one place — with nothing hidden."
            img="https://res.cloudinary.com/detc4yjdi/image/upload/v1745454301/research_of_statistical_data_and_analytics_hgxisk.png"
            bgImage="https://res.cloudinary.com/detc4yjdi/image/upload/v1745454137/for_inestors_ogycas.png"
          />
          <FeatureCard
            title="Built-in Compliance"
            desc="KYC, investor accreditation, and transaction monitoring included by default."
            img="https://res.cloudinary.com/detc4yjdi/image/upload/v1745454205/code_editing_and_software_development_ucgzce.png"
            bgImage="https://res.cloudinary.com/detc4yjdi/image/upload/v1745454137/for_inestors_ogycas.png"
          />
          <FeatureCard
            title="Make Raising Simple Again"
            desc="On-chain fundraising designed for real teams — not pitch decks and gatekeepers. Let’s build the future better."
            img="https://res.cloudinary.com/detc4yjdi/image/upload/v1745454248/income_growth_vkgye6.png"
            bgImage="https://res.cloudinary.com/detc4yjdi/image/upload/v1745454140/founders_wdcn9a.png"
          />
        </div>
      </div>
    </section>
  );
};

// const FeatureCard = ({
//   title,
//   desc,
//   img,
//   bgImage,
// }: {
//   title: string;
//   desc: string;
//   img: string;
//   bgImage: string;
// }) => (
//   <div
//     className="rounded-2xl p-6 text-center text-white backdrop-blur-md hover:scale-[1.02] transition-transform shadow-md max-w-xs mx-auto border border-white/10"
//     style={{
//       backgroundImage: `url(${bgImage})`,
//       backgroundSize: 'cover',
//       backgroundPosition: 'center',
//     }}
//   >
//     <img src={img} alt={title} className="w-16 h-16 mx-auto mb-4 font-krona" />
//     <h3 className="text-lg font-bold mb-2 font-krona">{title}</h3>
//     <p className="text-sm text-gray-300 font-krona">{desc}</p>
//   </div>
// );

export default Features;
