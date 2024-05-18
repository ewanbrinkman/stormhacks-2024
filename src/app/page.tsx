"use client";

import React, { useState, useEffect } from 'react';
import Button from '@components/Button';
import config from '@assets/config.json';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(config.timer.defaultLength);
  const [initialTime, setInitialTime] = useState(config.timer.defaultLength);
  const [isActive, setIsActive] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [inputCaptcha, setInputCaptcha] = useState('');
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      generateCaptcha();
      setIsVerified(false);
    }
    return () => clearTimeout(timer);
  }, [isActive, timeLeft]);

  const startTimer = () => {
    setIsActive(true);
    setTimeLeft(initialTime);
    setIsVerified(true);
  };

  const resetTimer = () => {
    setTimeLeft(initialTime);
    setInputCaptcha('');
    setCaptcha('');
    setIsVerified(true);
    setIsActive(false);
  };

  const generateCaptcha = () => {
    const randomCaptcha = Math.floor(config.randomNumber.min + Math.random() * (config.randomNumber.max - config.randomNumber.min)).toString();
    setCaptcha(randomCaptcha);
  };

  const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputCaptcha(e.target.value);
  };

  const verifyCaptcha = () => {
    if (inputCaptcha === captcha) {
      resetTimer();
    } else {
      alert('Incorrect captcha. Please try again.');
    }
  };

  const handleInitialTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInitialTime(Number(e.target.value));
  };

  const backgroundColor = timeLeft === 0 && !isVerified ? 'bg-bad' : 'bg-good';

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${backgroundColor}`}>
      <div className="flex flex-grow relative justify-center items-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img src="/path/to/your/logo.png" alt="SafePulse" className="h-8 mr-2" />
            <h1 className="text-white text-2xl">SOS-OverWatch</h1>
          </div>
          {timeLeft > 0 ? (
            <div className="mb-4">
              <div className="text-yellow-500 text-6xl">
                {timeLeft < 10 ? `0:0${timeLeft}` : `0:${timeLeft}`}
              </div>
            </div>
          ) : !isVerified ? (
            <div className="mb-4">
              <div className="text-white text-2xl mb-2">
                Enter the captcha to reset the timer:
              </div>
              <div className="text-yellow-500 text-4xl mb-2">
                {captcha}
              </div>
              <input
                type="text"
                value={inputCaptcha}
                onChange={handleCaptchaChange}
                className="text-black text-2xl p-2 rounded"
              />
              <Button
                onClick={verifyCaptcha}
                // className="bg-white text-blue-500 px-4 py-2 rounded-full text-xl mt-2"
              >
                Verify
              </Button>
            </div>
          ) : null}
          {!isActive && isVerified && (
            <>
              <div className="text-black text-xl mb-2">Set timer in seconds:</div>
              <input
                type="number"
                value={initialTime}
                onChange={handleInitialTimeChange}
                className="text-black text-xl p-2 rounded mb-4"
                placeholder="Set timer in seconds"
              />
              <Button
                onClick={startTimer}
                // className="bg-white text-blue-500 px-4 py-2 rounded-full text-xl"
              >
                Start
              </Button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
