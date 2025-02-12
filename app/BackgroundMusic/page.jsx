"use client"
import { useEffect, useState } from "react";

const BackgroundMusic = () => {
  const [audioContext, setAudioContext] = useState(null);
  const [audioElement, setAudioElement] = useState(null);

  useEffect(() => {
    let context, audio, track;

    const playAudio = async () => {
      try {
        context = new (window.AudioContext || window.webkitAudioContext)();
        audio = new Audio("/bg_music.mp3");
        track = context.createMediaElementSource(audio);
        track.connect(context.destination);

        audio.loop = true;
        audio.volume = 0.5; 

        setAudioContext(context);
        setAudioElement(audio);

        await context.resume(); 
        await audio.play(); 
        console.log("✅ Background music is playing 🎶");
      } catch (error) {
        console.error("🚨 Autoplay blocked:", error);
      }
    };

    setTimeout(playAudio, 500);

    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
      if (context) {
        context.close();
      }
    };
  }, []);

  return null;
};

export default BackgroundMusic;
