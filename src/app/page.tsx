"use client";

import Leaderboard from "@/components/leaderboard";
import { Navbar } from "@/components/navbar";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <Navbar short />
      <main className="relative z-10 pt-20">
        <Leaderboard />
      </main>
    </div>
  );
}