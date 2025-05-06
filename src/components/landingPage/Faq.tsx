"use client";
import Image from "next/image";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}


const faqData: FAQItem[] = [
  { question: "How can I get started?", answer: "Raise3 is a decentralized crowdfunding platform where founders raise funds in milestone-based tranches. Funds are only released after milestone completion and investor approval — protecting investors while keeping founders accountable." },
  { question: " How is Raise3 different from Kickstarter or Juicebox?", answer: "Raise3 offers smart contract-enforced milestone funding. Unlike traditional platforms, funds are held in escrow and released only when investors approve milestone completion, reducing the risk of fraud or mismanagement." },
  { question: "What tokens can I use on Raise3", answer: "Raise3 supports major ERC20 tokens like ETH, USDC, DAI, etc. Token support depends on the project’s configuration." },
  { question: "How can I get started?", answer: "Features" },

];

const faqinvestors:  FAQItem[] = [
  { question: "How does Raise3 protect my investment?", answer: " Your funds are locked in a smart contract. They’re released milestone-by-milestone, and only if you and other investors approve the progress. If a milestone is rejected, funds for future milestones stay locked or are refunded." },
  { question: " Can I exit a project midway?", answer: " Not yet. Raise3 will soon support secondary markets where you can resell your investment. For now, your commitment lasts until milestone voting is complete."},
  { question: " What happens if a project fails to meet a milestone?", answer: "If the majority of investors reject a milestone, the project is paused. Unused funds can either be refunded or held until the issue is resolved, based on the campaign's terms." },
  { question: "Do I earn returns or tokens?", answer: "Some projects may offer tokens, perks, or revenue sharing. Raise3 is infrastructure — rewards are determined by each campaign." },
];
const faqFounders: FAQItem[] = [
  {question: " How do I start a campaign?",
    answer: " Connect your wallet, submit your pitch (with milestone breakdown), and get verified (e.g., via KarmaGap or other partners). Once approved, your campaign goes live."
  },{question: "What is the Raise3 verification process?",
    answer: "Projects are reviewed for team identity, milestone feasibility, and community credibility. Verification may include social KYC, audit checks, or partnerships with vetting services."
  },{question: "Can I change milestones after launching?",
    answer: "No. Once a campaign is live, milestones are locked to protect investor trust. However, you can post updates and future plans."
  },{question: "When do I get paid?",
    answer: " After you mark a milestone as “complete” and enough investors approve, Raise3’s smart contract releases only the milestone-specific funds to you — minus a small platform fee."
  },
];
const faqTrust:  FAQItem[] = [
  {question: "Are smart contracts audited?",
    answer: " Yes, Raise3’s contracts are undergoing formal audits. All code is open-source and viewable on GitHub."
  },{question: "Can Raise3 access or move my funds?",
    answer: "No. Raise3 is non-custodial. Only the smart contract — governed by milestone logic — controls the fund flows."
  },{question: " What fees does Raise3 charge?",
    answer: "Raise3 charges a 5% fee on each milestone withdrawal, which is deducted before funds reach the founder."
  },
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
          <h1>For Investors</h1>
          <div className="space-y-4">
            {faqinvestors.map((faq, index) => (
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
          </div><h1>For Founders </h1>
          <div className="space-y-4">
            {faqFounders.map((faq, index) => (
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
          </div><h1>Trust and Secuirity</h1>
          <div className="space-y-4">
            {faqTrust.map((faq, index) => (
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
