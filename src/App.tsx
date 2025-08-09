import React from "react";
import HeaderComponent from "@/components/header/header.component.tsx";
import { Outlet } from "react-router-dom";

const App: React.FC = () => {
  return (
    <>
      <HeaderComponent />
      <Outlet />
    </>
  );
};

export default App;
