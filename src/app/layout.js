import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from './context/cartcontext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Beautifulflower",
  description: "Vườn hoa trong tay bạn",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > 
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
