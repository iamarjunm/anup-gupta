// app/layout.jsx
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import LuxuryFooter from "@/components/Footer"
import "../styles/globals.css";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import { CurrencyProvider } from '@/context/CurrencyContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Anup Gupta Studio",
  description: "Formals",
};
const appBaseCurrency = 'INR';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} 
          antialiased bg-[#f7f3ee] text-[#1e3d2f] 
          min-h-screen flex flex-col
        `}
      >
        <UserProvider>
           <CurrencyProvider baseCurrency={appBaseCurrency}>
            <CartProvider>
        {/* Global Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="pt-20 min-h-[calc(100vh-80px)]">
  {children}
</main>


        <LuxuryFooter />
        </CartProvider>
        </CurrencyProvider>
        </UserProvider>
      </body>
      
    </html>
  );
}
