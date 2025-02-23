import React from "react";
import { SalaryTabs } from "./salary-calculator/tabs";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <SalaryTabs />
      </div>
    </div>
  );
};

export default Home;
