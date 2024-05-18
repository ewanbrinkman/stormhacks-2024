"use client";

import React, { useState, useEffect } from 'react';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(10);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearTimeout(timer);
  }, [isActive, timeLeft]);

  const startTimer = () => {
    setIsActive(true);
  };

  const backgroundColor = timeLeft === 0 ? 'bg-red-500' : 'bg-blue-500';

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${backgroundColor}`}>
      <div className="flex flex-grow relative justify-center items-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img src="/path/to/your/logo.png" alt="SOS-OverWatch" className="h-8 mr-2" />
            <h1 className="text-white text-2xl">SOS-OverWatch</h1>
          </div>
          <div className="mb-4">
            <div className="text-yellow-500 text-6xl">
              {timeLeft < 10 ? `0:0${timeLeft}` : `0:${timeLeft}`}
            </div>
          </div>
          <button
            onClick={startTimer}
            className="bg-white text-blue-500 px-4 py-2 rounded-full text-xl"
          >
            Start
          </button>
        </div>
      </div>
    </main>
  );
}
