'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
export default function SplashScreen({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [currentTeam, setCurrentTeam] = useState(zone[0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  useEffect(() => {
    let context, track;

    const fetchAudio = async () => {
      context = new (window.AudioContext || window.webkitAudioContext)();
      try {
        const data = {
          voiceId: 'en-US-terrell',
          style: 'Promo',
          text: `Team ${currentTeam.name} has gone to level ${currentTeam.passed}. Congratulations Team!!`,
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
            'api-key': "ap2_d495f0a7-f38c-4010-b819-d476ec6ad9bd",
          },
        });

        setAudioContext(context);
        setAudioUrl(response.data.audioUrl);
      } catch (error) {
        console.error('Error fetching audio:', error);
      }
    };

    fetchAudio();

    return () => {
      if (track) {
        track.disconnect();
      }
      if (context) {
        context.close();
      }
    };
  }, [currentTeam]);

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(error => console.error("Autoplay blocked:", error));
    }
  }, [audioUrl]);

  const SortableZone = ({ zone, zoneIndex }) => {
    return (
      <AnimatePresence>
        {!fadeOut && (
          <motion.div
            className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1 }}
          >
            <div className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
              <img src="/glitch.jpg" alt="Glitch Background" className="absolute top-0 left-0 w-full h-full object-cover opacity-35" />
              <img src="/dead.gif" alt="Loading" className="w-[800px] h-[390px] mb-14 animate-pulse" />
              <h2 className="absolute bottom-5 text-green-300 text-2xl font-extrabold font-orbitron drop-shadow-[4px_4px_5px_rgb(129, 199, 132,0.45)]">
                Congratulations {zone.name} !!
              </h2>
              <h1 className="absolute bottom-20 text-orange-600 text-5xl font-extrabold font-orbitron drop-shadow-[4px_4px_5px_rgba(255,0,0,0.55)]">
                {zone.name} has passed {zone.passed}.
              </h1>
              {audioUrl && <audio autoPlay src={audioUrl} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div>
      {zone.map((team, index) => (
        <SortableZone key={index} zone={team} zoneIndex={index} />
      ))}
    </div>
  );
}