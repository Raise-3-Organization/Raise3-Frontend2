"use client";
import Image from "next/image";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  { question: "How can I get started?", answer: "Features" },
  { question: "How can I get started?", answer: "Features" },
  { question: "How can I get started?", answer: "Features" },
  { question: "How can I get started?", answer: "Features" },
  { question: "How can I get started?", answer: "Features" },
  { question: "How can I get started?", answer: "Features" },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-black text-white p-8">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side */}
        <div>
          <span className="bg-pink-500 text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
            FAQs
          </span>
          <h2 className="text-4xl font-bold leading-tight mb-8">
            We got <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">answers</span> for you.
          </h2>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="border border-gray-700 rounded-lg">
                <button
                  className="flex justify-between items-center w-full p-4 text-left"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="text-lg">{faq.question}</span>
                  <span>{openIndex === index ? "-" : "+"}</span>
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-4 text-sm text-gray-400">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side (Image/Illustration) */}
        <div className="flex justify-center relative w-[400px] h-[400px]">
      {/* Background Image */}
        <Image
        src="https://res.cloudinary.com/detc4yjdi/image/upload/v1745709471/checklist_with_questions_mark_1_uuj4ev.png"
        alt="Background Illustration"
        fill
        className="object-cover opacity-40"
        priority
        />

      {/* Foreground FAQ Illustration */}
        <div className="relative w-[250px] h-[250px] z-10">
        <Image
            src="https://res.cloudinary.com/detc4yjdi/image/upload/v1745690935/checklist_with_questions_mark_pgbs0t.png"
            alt="FAQ Illustration"
            fill
            className="object-contain"
            priority
        />
      </div>
    </div>
      </div>
    </section>
  );
}
