import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

// Main layout loader (kept for routing compatibility)
export function mainLoader() {
  return null;
}

const MainLayout = () => {
  return (
    <div className="layout">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
