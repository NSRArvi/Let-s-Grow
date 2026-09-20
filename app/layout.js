import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Let's Grow",
  description: "Let's Grow Togather Guys!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Toaster position="top-center" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
