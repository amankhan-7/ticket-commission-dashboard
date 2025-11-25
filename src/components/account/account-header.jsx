"use client";

import React, { useRef, useState } from "react";
import { User } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { getUserDisplayName, formatPhoneNumber } from "@/utils/auth";

export default function AccountHeader() {
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const { user } = useAuth();

  const displayName = getUserDisplayName(user);
  const formattedPhone = formatPhoneNumber(user?.phone);

  return (
    <div className="px-0 sm:px-6 md:px-8 lg:ml-18">
      <Card
        className="rounded-xl shadow-lg border-t-4 mb-6"
        style={{ borderTopColor: "#004AAD" }}
      >
        <CardContent className="flex items-center gap-6 py-0 px-6">
          {/* Profile Image */}
          <div
            className="w-12 h-12 rounded-full bg-[#004AAD]/10 border-2 border-[#004AAD] flex items-center justify-center overflow-hidden"
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-[#004AAD] w-10 h-10" />
            )}

            {/* Hidden File Input - Uncomment if enabling upload */}
            {/* 
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            /> 
            */}
          </div>

          {/* User Info */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#013881] via-[#004aad] to-blue-300 bg-clip-text text-transparent">
              {displayName}
            </h2>
            <p className="text-gray-600 text-sm font-semibold">
              {formattedPhone}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
