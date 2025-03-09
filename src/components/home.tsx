import React from "react";
import { EnhancedDashboard } from "./dashboard/enhanced-dashboard";
import { AnimatedPageTransition } from "@/components/ui/animations";

const Home = () => {
  return (
    <AnimatedPageTransition>
      <EnhancedDashboard />
    </AnimatedPageTransition>
  );
};

export default Home;
