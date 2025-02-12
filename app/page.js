import Image from "next/image";
import GameTimer from "./GameTimer/page";
import Leaderboard from "@/app/LeaderBoard/page"
import BackgroundMusic from "./BackgroundMusic/page";
export default function Home() {
  return (
   <div className="bg-container">
      <div className="overlay"></div>
      <GameTimer initialMinutes={5} initialSeconds={0} />
      <Leaderboard />
      <BackgroundMusic />
    </div>
  );
}
