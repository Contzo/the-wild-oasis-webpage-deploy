import { Josefin_Sans } from "next/font/google"; // download the font from Google on the web server

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
}); // configure how the font should be implemented

import "@/app/_styles/globals.css";
import Header from "./_components/Header";
import ReservationProvider from "./_components/ReservationContext";

export const metadata = {
  title: {
    template: "The Wild Oasis - %s",
    default: "The Wild Oasis - Welcome",
  },
  description:
    "Luxurious cabin boutique located at the heart of the Italian Dolomites, surrounded by the beautiful mountains and the dark forests",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`relative grid grid-rows-[auto_1fr] bg-primary-950 text-primary-100 ${josefin.className} h-full`}
      >
        <Header />
        <div className="px-8 py-12 h-full overflow-y-auto">
          <main className="max-w-7xl mx-auto ">
            <ReservationProvider>{children}</ReservationProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
