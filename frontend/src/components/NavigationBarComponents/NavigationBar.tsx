import React, { useState } from "react";
import { Menu, X } from "lucide-react";

function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav
        className="
          fixed top-0 left-0 
          w-[calc(100%-24rem)] lg:w-[calc(100%-20rem)] xl:w-[calc(100%-24rem)]
          bg-white/10 backdrop-blur-md
          text-white 
          flex justify-between items-center
          z-50 shadow-lg border-b border-white/10
          h-16
          px-4 sm:px-6 lg:px-8
          transition-all duration-300
        "
      >
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="font-poppins font-bold text-lg sm:text-xl lg:text-2xl">
            CCDI
          </h1>
          <p className="font-poppins font-thin text-sm sm:text-base lg:text-lg mt-0.5 sm:mt-1">
            Career Assessment
          </p>
        </div>

        {/* Desktop Links - Hidden on mobile */}
        <ul className="hidden md:flex list-none m-0 p-0 gap-6 lg:gap-8 font-mono">
          <li>
            <a
              href="#home"
              className="text-white no-underline hover:text-blue-400 transition-colors duration-300 text-sm lg:text-base"
            >
              Courses
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="text-white no-underline hover:text-orange-400 transition-colors duration-300 text-sm lg:text-base"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="text-white no-underline hover:text-purple-400 transition-colors duration-300 text-sm lg:text-base"
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-300"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X size={20} className="text-white" />
          ) : (
            <Menu size={20} className="text-white" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Slide-in */}
      <div
        className={`
          fixed top-16 right-0 h-[calc(100vh-4rem)]
          bg-gradient-to-b from-black/95 to-gray-900/95 backdrop-blur-md
          text-white shadow-2xl border-l border-white/10
          z-40 transition-transform duration-300 ease-in-out
          w-64 sm:w-72
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          md:hidden
        `}
      >
        <div className="p-6 space-y-6">
          <h3 className="font-poppins font-semibold text-lg mb-4 text-center">
            Navigation
          </h3>
          
          <ul className="space-y-4">
            <li>
              <a
                href="#home"
                onClick={toggleMobileMenu}
                className="
                  block py-3 px-4 rounded-lg
                  bg-blue-500/10 border border-blue-500/30
                  text-blue-400 no-underline
                  hover:bg-blue-500/20 hover:border-blue-500/50
                  transition-all duration-300
                  text-center
                "
              >
                Courses
              </a>
            </li>
            <li>
              <a
                href="#about"
                onClick={toggleMobileMenu}
                className="
                  block py-3 px-4 rounded-lg
                  bg-orange-500/10 border border-orange-500/30
                  text-orange-400 no-underline
                  hover:bg-orange-500/20 hover:border-orange-500/50
                  transition-all duration-300
                  text-center
                "
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={toggleMobileMenu}
                className="
                  block py-3 px-4 rounded-lg
                  bg-purple-500/10 border border-purple-500/30
                  text-purple-400 no-underline
                  hover:bg-purple-500/20 hover:border-purple-500/50
                  transition-all duration-300
                  text-center
                "
              >
                Contact
              </a>
            </li>
          </ul>

          {/* Additional mobile-only info */}
          <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-white/60 text-center">
              CCDI Career Guidance Program
            </p>
            <p className="text-xs text-white/40 text-center mt-1">
              Find your perfect career path
            </p>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden under fixed nav */}
      <div className="h-16"></div>
    </>
  );
}

export default NavigationBar;