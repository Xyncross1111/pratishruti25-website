'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Cinzel } from 'next/font/google';
import { baseSections } from '@/lib/sections';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '600', '700'] });

// Distinct oceanic palette for top 3 ranks
const topRankColors = ['bg-emerald-300', 'bg-cyan-500', 'bg-indigo-400'];

const makeTwinkles = () =>
    Array.from({ length: 40 }).map((_, i) => {
        const size = Math.random() * 4 + 1; // 1px to 5px
        return {
            id: i,
            top: Math.random() * 100,
            left: Math.random() * 100,
            size,
            delay: Math.random() * 2,
            duration: Math.random() * 2 + 3,
            opacity: 0.35 + Math.random() * 0.45,
            blur: size * 3,
        };
    });

export default function Leaderboard() {
    const [scores, setScores] = useState([]);
    const [twinkles] = useState(makeTwinkles);

    useEffect(() => {
        const getScores = async () => {
            try {
                const response = await fetch('api/getScores');
                if (!response.ok) throw new Error('Failed to fetch scores');
                const data = await response.json();
                setScores(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
            }
        };
        getScores();
    }, []);

    const mergedData = baseSections.map((section) => {
        const match = scores.find((s) => s.section === section.section);
        const score = match?.score ?? section.score ?? 0;
        return { ...section, score };
    });

    const sortedData = [...mergedData].sort((a, b) => b.score - a.score);

    const rankedData = sortedData.map((item, index) => ({
        ...item,
        color: index < 3 ? topRankColors[index] : 'bg-gray-900/70',
        textColor: index < 3 ? 'text-black' : 'text-white',
        border: 'border-white/20',
    }));

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
            <Image
                src={'/assets/image/leaderboard_hh26.png'}
                alt="Leaderboard"
                fill
                priority
                sizes="100vw"
                className="object-cover"
                onDragStart={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
            />
            <div className="absolute inset-0 bg-black/10" />

            <div className="absolute z-10 top-[17%] bottom-[28%] left-[20%] right-[20%] px-4 flex items-start justify-center">
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {twinkles.map((dot) => (
                        <span
                            key={dot.id}
                            className="absolute rounded-full bg-white/70"
                            style={{
                                top: `${dot.top}%`,
                                left: `${dot.left}%`,
                                width: dot.size,
                                height: dot.size,
                                opacity: dot.opacity,
                                animation: `twinkle ${dot.duration}s ease-in-out ${dot.delay}s infinite alternate`,
                                boxShadow: `0 0 ${dot.blur}px rgba(255,255,255,0.7)`,
                            }}
                        />
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full overflow-auto py-2">
                    {rankedData.map((item) => (
                        <div
                            key={item.section}
                            className="flex justify-between items-center w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 shadow"
                        >
                            <div
                                className={`px-4 py-2 rounded border-2 border-dotted ${item.border} ${item.color} ${item.textColor} font-bold text-base sm:text-lg ${cinzel.className}`}
                            >
                                <p>{item.section}</p>
                            </div>
                            <div className={`flex items-center justify-center text-white text-base sm:text-lg tracking-wide ${cinzel.className}`}>
                                <p>{item.score}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
                        <style jsx>{`
                            @keyframes twinkle {
                                0% { opacity: 0.1; transform: scale(0.9); }
                                50% { opacity: 1; transform: scale(1.05); }
                                100% { opacity: 0.2; transform: scale(0.95); }
                            }
                        `}</style>
        </div>
    );
}
