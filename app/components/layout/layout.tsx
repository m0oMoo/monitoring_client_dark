"use client";

import React, { ReactNode, useState } from "react";
import Header from "./header";
import LeftMenu from "./leftMenu";

const Layout = ({ children }: { children: ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(true);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header toggleMenu={() => setMenuOpen(!menuOpen)} />

      {/* Left Menu */}
      <div
        className={`fixed left-0 top-[44px] h-full bg-white shadow-md w-60 transition-transform duration-500 ${
          menuOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <LeftMenu />
      </div>

      <main
        className={`flex-1 transition-all duration-500
          bg-modern-bg
          ${menuOpen ? "ml-60" : "ml-0"}`}
      >
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
