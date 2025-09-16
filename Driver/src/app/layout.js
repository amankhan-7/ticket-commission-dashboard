import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DriverLayoutWrapper from "@/components/DriverLayoutWrapper";
import ReduxWrapper from "@/components/wrapper/redux-wrapper";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReduxWrapper>
          <DriverLayoutWrapper>{children}</DriverLayoutWrapper>
        </ReduxWrapper>
      </body>
    </html>
  );
}
