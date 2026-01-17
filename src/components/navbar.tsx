"use client";
import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700"] });

interface NavbarProps {
  short?: boolean;
}

export const Navbar: FC<NavbarProps> = ({ short }) => {
  return (
    <nav className="flex flex-wrap gap-3 md:gap-0 items-center py-3 px-4 md:py-3 md:px-8 bg-black/70 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
      <div className={`flex items-center gap-3 w-full text-white font-semibold tracking-tight ${cinzel.className}`}>
        <Link href="/leaderboard">
          <Image
            src="/assets/image/src.png"
            width={short ? 40 : 56}
            height={short ? 40 : 56}
            alt="SRC logo"
            onDragStart={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            className="cursor-pointer"
          />
        </Link>
        <span className="text-base md:text-xl flex-1 text-center md:text-left leading-tight">Students' Representative Council</span>
      </div>
    </nav>
  );
};
