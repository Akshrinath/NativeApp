import React from "react";
import SideMenu from "../components/SideMenu";
import DailyActivity from "./DailyActivity";
import Header from "../components/Header";

const Layout: React.FC = () => {
  return (
    <>
      <div className="flex w-screen">
        <SideMenu />
        
        <div className="w-full ">
        <Header name = "KV" />
          <DailyActivity />
        </div>
      </div>
    </>
  );
};
export default Layout;
