'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';


export default function SplashScreen({ onComplete}) {
  const [fadeOut, setFadeOut] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  
  useEffect(() =>{
    const timer = setTimeout(() =>{
      setFadeOut(true)
      onComplete();
    }, 5000)

  return () => clearTimeout(timer); 
},[onComplete]);

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const data = {
          voiceId: 'en-US-terrell',
          style: 'Promo',
          text: 'Team $ has gone to level 4. Congratulations Team!!',
          rate: 0,
          pitch: -25,
          sampleRate: 48000,
          format: 'MP3',
          channelType: 'MONO',
          encodeAsBase64: false,
          variation: 1,
          modelVersion: 'GEN2',
          multiNativeLocale: 'en-US'
        };

        const response = await axios.post('https://api.murf.ai/v1/speech/generate', data, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'api-key': process.env.API_KEY,
          },
        });

        setAudioUrl(response.data.audioUrl);
      } catch (error) {
        console.error('Error fetching audio:', error);
      }
    };

    fetchAudio();
  }, []);

  return (
    <AnimatePresence>
      {!fadeOut && (
    <motion.div
    className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }} 
          transition={{ duration: 1 }}>
    <div className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
      <img src="/glitch.jpg" alt="Glitch Background" className="absolute top-0 left-0 w-full h-full object-cover opacity-35 " />
      <img src="/dead.gif" alt="Loading" className="w-[800px] h-[425px] mb-14 animate-pulse" />
      <h1 className="absolute bottom-5 text-orange-600 text-6xl font-extrabold font-orbitron drop-shadow-[4px_4px_5px_rgba(255,0,0,0.75)] ">
        BOMB DIFFUSION
      </h1>
      {audioUrl && <audio autoPlay src={audioUrl} />} 
    </div>
    </motion.div>
    )}
    </AnimatePresence>
  );
}