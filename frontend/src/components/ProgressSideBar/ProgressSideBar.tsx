import React from "react";

function ProgressSideBar() {
  return (
    <aside
      className="
        fixed top-0 right-0 
        w-96 h-screen
        bg-white/3 backdrop-blur-sm
        text-white shadow-lg 
        flex flex-col justify-between
        p-6 z-40
      "
    >
      {/* Header - added margin top to account for nav bar */}
      <div className="mt-20 text-xl">
        <h2 className="text-xl font-bold mb-6">Progress</h2>
        <ul className="space-y-4">
          <li className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            Step 1: Introduction
          </li>
          <li className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            Step 2: Assessment
          </li>
          <li className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-gray-400"></span>
            Step 3: Results
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="text-sm text-white/70">
        © {new Date().getFullYear()} CCDI Career Test
      </div>
    </aside>
  );
}

export default ProgressSideBar;