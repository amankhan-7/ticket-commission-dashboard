"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

export default function CodeInput({ length = 4, onChange, className }) {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRef = useRef([]);
  const otpString = otp.join("");

  useEffect(() => {
    inputRef.current[0].focus();
  }, []);
  const handleOnChange = (value, idx) => {
    if (!/^\d*$/.test(value)) return;

    setOtp((prev) => {
      const newOtp = [...prev];
      newOtp[idx] = value;
      if (value && idx < length - 1) {
        inputRef.current[idx + 1].focus();
      }
      return newOtp;
    });

    onChange(otpString);
  };

  useEffect(() => {
    onChange(otpString);
  }, [otpString]);

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && otp[idx] === "" && idx > 0) {
      inputRef.current[idx - 1].focus();
    }
  };

  return (
    <main
      className={cn("flex space-x-2 justify-center items-center", className)}
    >
      {otp.map((dig, idx) => (
        <Input
          key={idx}
          ref={(ref) => (inputRef.current[idx] = ref)}
          type="text"
          value={dig}
          maxLength={1}
          inputMode="numeric"
          onChange={(e) => handleOnChange(e.target.value, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className="w-12 h-12 md:w-14 md:h-14 text-center text-lg md:text-xl border focus-visible:border-primary focus:shadow-[0_0_0_3px_rgba(0,74,173,0.15)] font-semibold rounded-xl self-center"
        />
      ))}
    </main>
  );
}
