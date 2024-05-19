"use client";

import React, { useState, useEffect } from "react";
import Button from "@components/Button";
import config from "@assets/config.json";
import axios from "axios";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem("timeLeft");
    return savedTime !== null ? parseInt(savedTime, 10) : config.timer.defaultLength;
  });
  const [initialTime, setInitialTime] = useState(() => {
    const savedInitialTime = localStorage.getItem("initialTime");
    return savedInitialTime !== null ? parseInt(savedInitialTime, 10) : config.timer.defaultLength;
  });
  const [isActive, setIsActive] = useState(() => {
    const savedIsActive = localStorage.getItem("isActive");
    return savedIsActive === "true" ? true : false;
  });
  const [captcha, setCaptcha] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");
  const [isVerified, setIsVerified] = useState(true);
  const [timeInput, setTimeInput] = useState("00:01:00"); // Default to 10 seconds
  const [timeErrorMessage, setTimeErrorMessage] = useState(""); // State for timer error message
  const [captchaErrorMessage, setCaptchaErrorMessage] = useState(""); // State for captcha error message
  const [phoneNumber, setPhoneNumber] = useState(""); // State for recipient phone number
  const [phoneErrorMessage, setPhoneErrorMessage] = useState(""); // State for phone number error message

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          localStorage.setItem("timeLeft", newTime.toString());
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      localStorage.setItem("isActive", "false");
      generateCaptcha();
      setIsVerified(false);
      sendSms(); // Send SMS when time runs out
    }
    return () => clearTimeout(timer);
  }, [isActive, timeLeft]);

  useEffect(() => {
    localStorage.setItem("isActive", isActive.toString());
  }, [isActive]);

  const startTimer = () => {
    const totalSeconds = parseTimeInput(timeInput);
    if (totalSeconds !== null && validatePhoneNumber(phoneNumber)) {
      setIsActive(true);
      setTimeLeft(totalSeconds);
      setInitialTime(totalSeconds);
      localStorage.setItem("timeLeft", totalSeconds.toString());
      localStorage.setItem("initialTime", totalSeconds.toString());
      setIsVerified(true);
      setTimeErrorMessage(""); // Clear error message when timer starts successfully
      setPhoneErrorMessage(""); // Clear phone error message
    } else if (!validatePhoneNumber(phoneNumber)) {
      setPhoneErrorMessage("Invalid phone number. Please enter a valid phone number.");
    }
  };

  const resetTimer = () => {
    setTimeLeft(initialTime);
    localStorage.setItem("timeLeft", initialTime.toString());
    setInputCaptcha("");
    setCaptcha("");
    setIsVerified(true);
    setIsActive(false);
    localStorage.setItem("isActive", "false");
  };

  const cancelTimer = () => {
    setIsActive(false);
    localStorage.setItem("isActive", "false");
    setTimeLeft(0);
    localStorage.setItem("timeLeft", "0");
    setInputCaptcha("");
    setCaptcha("");
  };

  const extendTimer = (additionalTime: number) => {
    setTimeLeft((prev) => {
      const newTime = prev + additionalTime;
      localStorage.setItem("timeLeft", newTime.toString());
      return newTime;
    });
  };

  const generateCaptcha = () => {
    const randomCaptcha = Math.floor(
      config.randomNumber.min +
        Math.random() * (config.randomNumber.max - config.randomNumber.min)
    ).toString();
    setCaptcha(randomCaptcha);
  };

  const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Only allow numbers
    setInputCaptcha(value);
    setCaptchaErrorMessage(""); // Clear captcha error message when user retypes
  };

  const verifyCaptcha = () => {
    if (inputCaptcha === captcha) {
      setTimeLeft(60); // Reset timer to one minute (60 seconds)
      localStorage.setItem("timeLeft", "60");
      setCaptchaErrorMessage(""); // Clear error message on successful verification
      setIsVerified(true);
    } else {
      setCaptchaErrorMessage("Incorrect captcha. Please try again.");
    }
  };

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9:]/g, ""); // Only allow numbers and colons
    setTimeInput(value);
    setTimeErrorMessage(""); // Clear error message when user retypes
    const totalSeconds = parseTimeInput(value);
    if (totalSeconds !== null) {
      setTimeLeft(totalSeconds); // Reflect valid time input on timer
      localStorage.setItem("timeLeft", totalSeconds.toString());
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Only allow numbers
    setPhoneNumber(value);
    setPhoneErrorMessage(""); // Clear phone error message when user retypes
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\d{10,15}$/; // Validate phone number (10-15 digits)
    return phoneRegex.test(phone);
  };

  const parseTimeInput = (input: string) => {
    const regex = /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/;
    const match = input.match(regex);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const seconds = parseInt(match[3], 10);
      const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
      if (totalSeconds === 0) {
        setTimeErrorMessage("00:00:00 is not a valid time.");
        return null;
      }
      if (totalSeconds > 86399) {
        setTimeErrorMessage("Time is limited up to 23:59:59.");
        return null;
      }
      return totalSeconds;
    }
    setTimeErrorMessage(
      "Invalid time format. Please enter a valid time in HH:MM:SS format."
    );
    return null;
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedTime = [
      String(hours).padStart(2, "0"),
      String(minutes).padStart(2, "0"),
      String(seconds).padStart(2, "0"),
    ].join(":");

    return formattedTime;
  };

  const sendSms = () => {
    axios.post('/api/send-sms', {
      to: phoneNumber, // Use the recipient's phone number
      message: 'The user did not verify the captcha in time.',
    })
    .then(response => {
      console.log('SMS sent:', response.data);
    })
    .catch(error => {
      console.error('Failed to send SMS:', error);
    });
  };

  const backgroundColor = timeLeft === 0 && !isVerified ? "bg-bad" : "bg-good";

  const isTimeInputValid = () => {
    return timeInput.match(
      /^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/
    );
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center ${backgroundColor}`}
    >
      <div className="flex flex-col items-center justify-center text-center">
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
            <div className="text-yellow-500 text-4xl mb-2">{captcha}</div>
            <input
              type="text"
              value={inputCaptcha}
              onChange={handleCaptchaChange}
              className="text-black text-2xl p-2 rounded mb-2"
              maxLength={4} // Limit to 4 digits
            />
            {captchaErrorMessage && (
              <div className="text-red-500 text-sm mb-2">
                {captchaErrorMessage}
              </div>
            )}
            <Button
              className="bg-blue-500 text-white transition duration-300 ease-in-out hover:bg-blue-600 focus:bg-blue-700 mb-2"
              onClick={verifyCaptcha}
            >
              Verify
            </Button>
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
            {timeErrorMessage && (
              <div className="text-red-500 text-sm mb-2">
                {timeErrorMessage}
              </div>
            )}
            <div className="text-black text-xl mb-2">Enter recipient phone number:</div>
            <input
              type="text"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="text-black text-xl p-2 rounded mb-4"
              placeholder="Phone number"
              maxLength={15} // Limit phone number length
            />
            {phoneErrorMessage && (
              <div className="text-red-500 text-sm mb-2">
                {phoneErrorMessage}
              </div>
            )}
            {isTimeInputValid() && !timeErrorMessage && !phoneErrorMessage && (
              <Button
                className="bg-blue-500 text-white transition duration-300 ease-in-out hover:bg-blue-600 focus:bg-blue-700 mb-2"
                onClick={startTimer}
              >
                Start
              </Button>
            )}
          </>
        )}
        {isActive && (
          <div className="flex flex-col items-center mt-4">
            <Button
              onClick={cancelTimer}
              className="bg-red-500 transition duration-300 ease-in-out hover:bg-red-600 focus:bg-red-700 mb-2"
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
      </div>
    </main>
  );
}
