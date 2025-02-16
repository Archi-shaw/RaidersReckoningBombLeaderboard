"use client"
import Image from "next/image";
import GameTimer from "./GameTimer/page";
import Leaderboard from "@/app/LeaderBoard/page"
import BackgroundMusic from "./BackgroundMusic/page";
import React, { useState } from "react";
export default function Home() {
  const[showSplash,setShowSplash] = useState(false)
  return (
    <>
        <div className="bg-container w-screen h-screen">
          <div className="overlay"></div>
          <div className='text-white text-5xl mx-11 mb-5 font-serif font-bold text-center p-4'>LEADERBOARD</div>
          <Leaderboard/>
          <BackgroundMusic/>
        </div>
    </>
  );
}
