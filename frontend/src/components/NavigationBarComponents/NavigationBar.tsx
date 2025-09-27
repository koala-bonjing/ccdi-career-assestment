import React from "react";

function NavigationBar() {
  return (
    <nav
      className="
        fixed top-0 left-0 
        w-[calc(100%-24rem)]  /* full width minus sidebar */
        bg-white/3 backdrop-blur-sm
        text-white px-6 py-3 
        flex justify-between items-center
        z-50 shadow-md
        h-16 /* fixed height */
      "
    >
      {/* Logo */}
      <div className="flex gap-2">
        <h1 className="font-poppins font-bold">CCDI</h1>
        <p className="mt-2.5 font-poppins font-thin">Career Assessment</p>
      </div>

      {/* Links */}
      <ul className="flex list-none m-0 p-0 gap-8 font-mono">
        <li>
          <a
            href="#home"
            className="text-white no-underline hover:text-primary transition"
          >
            Courses
          </a>
        </li>
        <li>
          <a
            href="#about"
            className="text-white no-underline hover:text-primary transition"
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#contact"
            className="text-white no-underline hover:text-primary transition"
          >
            Contact
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default NavigationBar;