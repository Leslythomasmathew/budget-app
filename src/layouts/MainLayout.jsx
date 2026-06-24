import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { fetchData } from "../helpers";
import Navbar from "../components/Navbar";

// Loader to fetch user details for the main layout
export function mainLoader() {
  const userName = fetchData("userName");
  return { userName };
}

const MainLayout = () => {
  const { userName } = useLoaderData();

  return (
    <div className="layout">
      <Navbar userName={userName} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
