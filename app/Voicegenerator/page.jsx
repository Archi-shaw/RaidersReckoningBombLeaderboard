"use client";

import Head from 'next/head';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Home() {
  const [audioUrl, setAudioUrl] = useState('');

  const generateVoice = async () => {
    const data = JSON.stringify({
      voiceId: 'en-US-terrell',
      style: 'Promo',
      text: 'Team $ has gone to level 4. Congratulations Team!!',
      rate: 0,
      pitch: -25,
      sampleRate: 48000,
      format: 'MP3',
      channelType: 'MONO',
      pronunciationDictionary: {},
      encodeAsBase64: false,
      variation: 1,
      audioDuration: 0,
      modelVersion: 'GEN2',
      multiNativeLocale: 'en-US',
    });

    const config = {
      method: 'post',
      url: 'https://api.murf.ai/v1/speech/generate',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'api-key': process.env.API_KEY, // Ensure this is set in your .env file
      },
      data: data,
    };

    try {
      const response = await axios(config);
      setAudioUrl(response.data.audioUrl);
    } catch (error) {
      console.error('Error generating voice:', error);
    }
  };

  useEffect(() => {
    generateVoice();
  }, []);

  return (
    <div>
      <Head>
        <title>Voice API Splash Screen</title>
      </Head>

      <main className="flex flex-col items-center justify-center h-screen bg-gray-100 p-5">
        <h1 className="text-4xl font-bold text-gray-800 mb-5">
          Welcome to the Splash Screen!
        </h1>
        <img
          src="./dead.gif" 
          alt="Splash GIF"
          className="w-72 h-auto mb-5"
        />
        {audioUrl ? (
          <audio controls src={audioUrl}></audio>
        ) : (
          <p className="text-gray-600">Loading audio...</p>
        )}
      </main>
    </div>
  );
}