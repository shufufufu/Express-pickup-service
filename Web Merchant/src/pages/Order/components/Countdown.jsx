import React, { useState, useEffect } from "react";

const SimpleCountdown = ({ value }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(value) - new Date();

    if (difference <= 0) {
      return "已超时";
    }

    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);

    return `${hours}小时${minutes}分钟`;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // 每分钟更新一次

    return () => clearTimeout(timer);
  });

  return <span>{timeLeft}</span>;
};

export default SimpleCountdown;
