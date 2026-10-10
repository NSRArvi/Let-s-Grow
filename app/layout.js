import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";
import { LanguageProvider } from "./components/context/LanguageContext";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: {
    default: "Let's Grow - Join the Future of Investing",
    template: "%s | Let's Grow",
  },
  description: "Join the revolution of smart investing. Fund real businesses, earn real returns, and watch your capital grow with complete transparency and security.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <AuthProvider>
            <Toaster position="top-center" />
            {children}
            <Analytics />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
