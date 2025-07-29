import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DriverLayoutWrapper from "@/components/DriverLayoutWrapper";



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <DriverLayoutWrapper>{children}</DriverLayoutWrapper>
      </body>
    </html>
  );
}

