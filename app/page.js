"use client"
import Image from "next/image";
import SplashScreen from "@/app/SplashScreen/page";
import GameTimer from "./GameTimer/page";
import Leaderboard from "@/app/LeaderBoard/page"
import BackgroundMusic from "./BackgroundMusic/page";
import { useState } from "react";
export default function Home() {
  const[showSplash,setShowSplash] = useState(true)
  return (
    <>
    {showSplash? (
      <SplashScreen onComplete = {() =>{setShowSplash(false)}} />
    ) : (
   <div className="bg-container">
      <div className="overlay"></div>
      <GameTimer initialMinutes={5} initialSeconds={0} />
      <Leaderboard />
      <BackgroundMusic />
    </div>
    )}
    </>
  );
}
