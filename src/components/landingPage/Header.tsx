"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Wallet, Moon, Sun, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"

const Header = () => {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = theme === "system" ? systemTheme : theme

  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark")
  }

  const handleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu)
  }

  const navLinkClass =
    "relative hover:text-[#FF7171] transition-colors duration-200 cursor-pointer after:block after:h-[2px] after:bg-[#FF7171] after:absolute after:-bottom-1 after:left-0 after:w-0 hover:after:w-full after:transition-all after:duration-300"

  return (
    <header className="w-full px-6 py-4 flex items-center justify-between bg-white dark:bg-[#0B0B0F] backdrop-blur-md z-50 transition-colors duration-300">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Image src="/Subtract.png" alt="Raise3 Logo" width={28} height={28} />
        <span className="text-xl font-semibold text-black dark:text-white font-krona">Raise3</span>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-6 text-sm text-black dark:text-white relative font-krona">
        <div className={navLinkClass}>Home</div>

        {/* Dropdowns */}
        {[
          { label: "About us", items: ["Our Story", "Team", "Careers"] },
          { label: "For Founders", items: ["Raise Capital", "Launch Campaign"] },
          { label: "For Investors", items: ["Browse Projects", "Investor Dashboard"] },
        ].map(({ label, items }) => (
          <div
            key={label}
            className="relative"
            onMouseEnter={() => handleDropdown(label)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <div className={`${navLinkClass} flex items-center gap-1`}>
              {label}
              <ChevronDown size={14} />
            </div>

            {openDropdown === label && (
              <div className="absolute top-full mt-3 w-48 rounded-md bg-white dark:bg-[#1c1c24] shadow-xl py-2 z-40 animate-fade-in">
                {items.map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[#2c2c34] transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}

        <a href="#" className={navLinkClass}>
          Features
        </a>
        <a href="#" className={navLinkClass}>
          FAQs
        </a>
      </nav>

      {/* Theme Toggle and Wallet Button */}
      <div className="flex items-center gap-4">
        {mounted && (
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-black dark:text-white bg-gray-200 dark:bg-black/30 hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {currentTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}

        <button className="px-4 py-2 text-sm text-white rounded-full bg-gradient-to-r from-[#2F50FF] via-[#FF7171] to-[#9360BB] hover:opacity-90 flex items-center gap-2 transition">
          <Wallet size={16} />
          Connect Wallet
        </button>
      </div>
    </header>
  )
}

export default Header
