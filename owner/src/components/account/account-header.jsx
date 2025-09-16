"use client";
import React, { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";
import { getUserDisplayName, formatPhoneNumber } from "@/utils/auth";
import { useAuth } from "@/hooks/useAuth";
import { useDispatch } from "react-redux";
import { setProfilePic } from "@/utils/redux/slices/profileSlice";

const AccountHeader = () => {
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const {user} = useAuth()
  const dispatch = useDispatch();

  const displayName = getUserDisplayName(user);
  const formattedPhone = formatPhoneNumber(user?.phone);

  const handlePictureClick = () => {
    fileInputRef.current?.click();
  };

const handleFileChange = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    const url = URL.createObjectURL(file);
    setImageUrl(url); 
    dispatch(setProfilePic(url));
  }
};



  return (
<section className="bg-white rounded-2xl shadow p-4 mb-4 max-w-5xl mx-auto w-full flex items-center">
  <div className="flex items-center gap-4 w-full">
    {/* Profile Picture */}
    <div
      className="w-16 h-16 rounded-full bg-[#004aad]/10 flex items-center justify-center overflow-hidden cursor-pointer border border-[#004aad]"
      onClick={handlePictureClick}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Profile"
          className="w-full h-full object-cover border border-[#004aad]"
        />
      ) : (
        <User className="text-[#004aad] w-8 h-8" />
      )}
      <Input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>

    {/* Profile Info */}
    <div className="flex flex-col">
      <div className="font-medium text-gray-800 text-base">
        {displayName}
      </div>
      <div className="text-sm text-gray-500">{formattedPhone}</div>
    </div>
  </div>
</section>

  );
};

export default AccountHeader;
