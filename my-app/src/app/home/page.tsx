import Logout from "@/components/Logout";
import { Button } from "@/components/ui/button";
import React from "react";

const Home = () => {
  return (
    <div className="flex justify-center items-center code-font text-2xl w-full">
      Welcome to the home page..
      <Logout />
    </div>
  );
};

export default Home;
