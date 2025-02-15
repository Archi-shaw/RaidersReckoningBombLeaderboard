"use client"
import React, { useEffect, useState } from 'react';

const GameTimer = ({ initialMinute = 5, initialSecond = 0 }) => {
  const [time, setTime] = useState({ minute: initialMinute, second: initialSecond });
  const [date, setDate] = useState("");

  useEffect(() => {
    const today = new Date();
    setDate(today.toLocaleDateString());

    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime.minute === 0 && prevTime.second === 0) {
          clearInterval(timer);
          return prevTime;
        }
        if (prevTime.second === 0) {
          return { minute: prevTime.minute - 1, second: 59 };
        }
        return { ...prevTime, second: prevTime.second - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className=" flex flex-row items-end justify-between overflow-hidden">
      <div className="flex gap-1 items-center">
        <span className="font-dseg7 text-2xl text-orange-600 text-shadow-lg shadow-orange-500/50">
        {String(time.minute).padStart(2, "0")}
        </span>
        <span className="font-dseg7 text-2xl text-orange-600 text-shadow-lg shadow-orange-500/50">
          :
        </span>
        <span className="font-dseg7 text-2xl text-orange-600 text-shadow-lg shadow-orange-500/50">
          {String(time.second).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

export default GameTimer;