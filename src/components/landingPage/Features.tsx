import React from 'react';

const Features: React.FC = () => {
  return (
    <section
      className="relative my-10 w-full h-[90vh] flex flex-col items-center justify-center text-center py-[30rem] px-4 text-white bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: "url('https://res.cloudinary.com/detc4yjdi/image/upload/v1745486871/Frame_39_ufvwgh.png')",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-27 text-center">
        <span className="inline-block text-xs font-medium bg-gradient-to-r from-[#6448fe] to-[#fa52a0] text-white px-4 py-1 rounded-full mb-4">
          What You Get
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Best features provided <br /> by <span className="text-gradient bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">Raise3</span>
        </h2>
        <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto">
          A clean, founder-first dashboard, Smart contract-powered fundraising campaigns, Verified investor profiles, Conditional fund release based on milestones, Real-time updates, no guesswork
        </p>

        {/* Grid of Cards */}
        <div className="gap-6 ">
            <div className='flex gap-6 justify-center'>
            {/* For Founders */}
          <div className="w-full mb-5 sm:w-[45%] md:w-[22%] bg-[#16141d]/60 backdrop-blur-md border border-[#5e5eff33] rounded-xl p-4 text-left hover:scale-[1.01] transition-transform">
            <img src="https://res.cloudinary.com/detc4yjdi/image/upload/v1745454661/rocket_with_up_arrow_1_qh5rc8.png" alt="For Founders" className="w-16 h-16 mb-4" />
            <h3 className="text-lg font-bold mb-1">For Founders</h3>
            <p className="text-xs text-gray-300">
              Upload your docs, set your terms, and go live. We’ll handle compliance, investor access, and fund flows.
            </p>
          </div>

          {/* For Investors */}
          <div className="w-full sm:w-[45%] md:w-[22%] bg-[#ff3eaa33]/30 backdrop-blur-md border border-[#ff3eaa33] rounded-xl p-6 text-left hover:scale-[1.01] transition-transform">
            <img src="https://res.cloudinary.com/detc4yjdi/image/upload/v1745454301/research_of_statistical_data_and_analytics_hgxisk.png" alt="For Investors" className="w-16 h-16 mb-4" />
            <h3 className="text-lg font-bold mb-1">For Investors</h3>
            <p className="text-xs text-gray-300">
              Filter projects, review docs, commit capital, and track performance. All in one place — with nothing hidden.
            </p>
          </div>

            </div>
            <div className='flex gap-6 justify-center'>
          {/* Built-in Compliance */}
          <div className="mb-5 w-full sm:w-[45%] md:w-[22%] bg-[#ff3eaa33]/30 backdrop-blur-md border border-[#ff3eaa33] rounded-xl p-6 text-left hover:scale-[1.01] transition-transform">
            <img src="https://res.cloudinary.com/detc4yjdi/image/upload/v1745487596/compliance_img_t6lcna.png" alt="Compliance" className="w-16 h-16 mb-4" />
            <h3 className="text-lg font-bold mb-1">Built-in Compliance</h3>
            <p className="text-xs text-gray-300">
              KYC, investor accreditation, and transaction monitoring included by default.
            </p>
          </div>
          {/* Make Raising Simple */}
          <div className="w-full sm:w-[45%] md:w-[22%] bg-[#16141d]/60 backdrop-blur-md border border-[#5e5eff33] rounded-xl p-6 text-left hover:scale-[1.01] transition-transform">
            <img src="https://res.cloudinary.com/detc4yjdi/image/upload/v1745487604/make_raise_simple_img_fpwv6a.png" alt="Raising Simple" className="w-16 h-16 mb-4" />
            <h3 className="text-lg font-bold mb-1">Make Raising Simple Again</h3>
            <p className="text-xs text-gray-300">
              On-chain fundraising designed for real teams — not tech-obsessed devs. Let’s build the future better.
            </p>
          </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default Features;
