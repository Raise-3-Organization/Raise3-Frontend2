// components/FeatureCard.tsx
'use client';
import React from 'react';

type Props = {
  title: string;
  desc: string;
  img: string;
  bgImage: string;
};

const FeatureCard: React.FC<Props> = ({ title, desc, img, bgImage }) => {
  return (
    <div
      className="rounded-2xl p-6 text-center text-white backdrop-blur-md hover:scale-[1.02] transition-transform shadow-md max-w-xs mx-auto border border-white/10"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <img src={img} alt={title} className="w-16 h-16 mx-auto mb-4" />
      <h3 className="text-lg font-bold mb-2 font-krona">{title}</h3>
      <p className="text-sm text-gray-300 font-krona">{desc}</p>
    </div>
  );
};

export default FeatureCard;
