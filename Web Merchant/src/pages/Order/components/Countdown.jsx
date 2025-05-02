import React, { useState, useEffect } from "react";

const SimpleCountdown = ({ value }) => {
  // 调试函数，帮助我们了解传入的值
  const debugValue = (val) => {
    console.log("SimpleCountdown接收到的值:", val, typeof val);
    return val;
  };

  // 解析日期的函数，处理多种可能的格式
  const parseDate = (dateValue) => {
    if (!dateValue) return null;

    // 如果已经是Date对象，直接返回
    if (dateValue instanceof Date) return dateValue;

    // 尝试直接解析
    let date = new Date(dateValue);

    // 检查是否为有效日期
    if (!isNaN(date.getTime())) {
      return date;
    }

    // 处理 "5/2 21:17" 格式
    if (typeof dateValue === "string") {
      const match = dateValue.match(/(\d+)\/(\d+)\s+(\d+):(\d+)/);
      if (match) {
        const [_, month, day, hours, minutes] = match;
        const year = new Date().getFullYear();
        return new Date(
          year,
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hours),
          parseInt(minutes)
        );
      }
    }

    return null;
  };

  const calculateTimeLeft = () => {
    // 调试输出
    debugValue(value);

    // 解析日期
    const targetDate = parseDate(value);

    // 如果无法解析日期
    if (!targetDate) {
      return "无效时间";
    }

    const currentTime = new Date();

    // 设置目标时间为下单时间+1天
    const deadlineTime = new Date(targetDate);
    deadlineTime.setDate(deadlineTime.getDate() + 1);

    const difference = deadlineTime - currentTime;

    // 如果已经超过截止时间
    if (difference <= 0) {
      return "已超时";
    }

    // 计算剩余时间
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    // 格式化显示
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    // 立即更新一次
    setTimeLeft(calculateTimeLeft());

    // 每秒更新一次
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // 如果已经超时，清除定时器
      if (newTimeLeft === "已超时") {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [value]); // 添加value作为依赖项

  // 根据倒计时状态设置不同的颜色
  const getCountdownStyle = () => {
    if (timeLeft === "已超时") {
      return { color: "#ff4d4f", fontWeight: "bold" }; // 红色
    }

    if (timeLeft === "无效时间") {
      return { color: "#faad14", fontWeight: "bold" }; // 橙色
    }

    // 尝试解析时间
    if (timeLeft.includes(":")) {
      const [hours, minutes] = timeLeft.split(":");
      const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);

      if (totalMinutes < 30) {
        return { color: "#ff4d4f" }; // 红色，30分钟内
      } else if (totalMinutes < 120) {
        return { color: "#faad14" }; // 橙色，2小时内
      }
    }

    return { color: "#52c41a" }; // 绿色，充足时间
  };

  return <span style={getCountdownStyle()}>{timeLeft}</span>;
};

export default SimpleCountdown;
