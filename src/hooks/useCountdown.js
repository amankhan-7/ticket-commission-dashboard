"use client";
import { useEffect, useState } from "react";

export default function useCountdown(initialCount) {
  const [countdown, setCountdown] = useState(initialCount);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const resetCountdown = () => {
    setCountdown(initialCount);
  };

  return { countdown, resetCountdown };
}
