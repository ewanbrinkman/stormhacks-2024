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
  const [timeInput, setTimeInput] = useState('00:00:10'); // Default to 10 seconds
  const [timeErrorMessage, setTimeErrorMessage] = useState(''); // State for timer error message
  const [captchaErrorMessage, setCaptchaErrorMessage] = useState(''); // State for captcha error message

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
    const totalSeconds = parseTimeInput(timeInput);
    if (totalSeconds !== null) {
      if (totalSeconds > 23 * 3600 + 59 * 60 + 59) {
        setTimeErrorMessage('Time is limited up to 23:59:59.');
      } else {
        setIsActive(true);
        setTimeLeft(totalSeconds);
        setInitialTime(totalSeconds);
        setIsVerified(true);
        setTimeErrorMessage(''); // Clear error message when timer starts successfully
      }
    } else {
      setTimeErrorMessage('Invalid time format. Please enter a valid time in HH:MM:SS format.');
    }
  };

  const resetTimer = () => {
    setTimeLeft(initialTime);
    setInputCaptcha('');
    setCaptcha('');
    setIsVerified(true);
    setIsActive(false);
  };

  const cancelTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
    setInputCaptcha('');
    setCaptcha('');
  };

  const extendTimer = (additionalTime: number) => {
    setTimeLeft(timeLeft + additionalTime);
  };

  const generateCaptcha = () => {
    const randomCaptcha = Math.floor(config.randomNumber.min + Math.random() * (config.randomNumber.max - config.randomNumber.min)).toString();
    setCaptcha(randomCaptcha);
  };

  const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputCaptcha(e.target.value);
    setCaptchaErrorMessage(''); // Clear captcha error message when user retypes
  };

  const verifyCaptcha = () => {
    if (inputCaptcha === captcha) {
      resetTimer();
      setCaptchaErrorMessage(''); // Clear error message on successful verification
    } else {
      setCaptchaErrorMessage('Incorrect captcha. Please try again.');
    }
  };

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9:]/g, ''); // Only allow numbers and colons
    setTimeInput(value);
    setTimeErrorMessage(''); // Clear error message when user retypes
  };

  const parseTimeInput = (input: string) => {
    const regex = /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;
    const match = input.match(regex);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const seconds = parseInt(match[3], 10);
      return hours * 3600 + minutes * 60 + seconds;
    }
    return null;
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedTime = [
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
      String(seconds).padStart(2, '0')
    ].join(':');

    return formattedTime;
  };

  const backgroundColor = timeLeft === 0 && !isVerified ? 'bg-bad' : 'bg-good';

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${backgroundColor}`}>
      <div className="flex flex-grow relative justify-center items-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img src="/favicon.png" alt="icon" className="h-8 mr-2" />
            <h1 className="text-white text-2xl">SOS-OverWatch</h1>
          </div>
          {timeLeft > 0 ? (
            <div className="mb-4">
              <div className="text-yellow-500 text-6xl">
                {formatTime(timeLeft)}
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
              {captchaErrorMessage && <div className="text-red-500 text-sm mb-2">{captchaErrorMessage}</div>}
              <Button onClick={verifyCaptcha}>Verify</Button>
            </div>
          ) : null}
          {!isActive && isVerified && (
            <>
              <div className="text-black text-xl mb-2">Set timer (HH:MM:SS):</div>
              <input
                type="text"
                value={timeInput}
                onChange={handleTimeInputChange}
                className="text-black text-xl p-2 rounded mb-4"
                placeholder="HH:MM:SS"
                maxLength={8} // To ensure it doesn't exceed HH:MM:SS
              />
              {timeErrorMessage && <div className="text-red-500 text-sm mb-2">{timeErrorMessage}</div>}
              <Button
                className='bg-blue-500 transition duration-300 ease-in-out hover:bg-blue-600 focus:bg-blue-700'
                onClick={startTimer}
              >
                Start
              </Button>
            </>
          )}
          {isActive && (
            <div className="flex flex-col items-center mt-4">
              <Button
                onClick={cancelTimer}
                className="bg-red-500 transition duration-300 ease-in-out hover:bg-red-600 focus:bg-red-700"
              >
                Cancel
              </Button>
              <Button
                onClick={() => extendTimer(10)}
                className="bg-green-500 transition duration-300 ease-in-out hover:bg-green-600 focus:bg-green-700"
              >
                Extend 10s
              </Button>
            </div>
          )}
          <Button href="/resource" className="mt-4">Resources</Button>
        </div>
      </div>
    </main>
  );
}
