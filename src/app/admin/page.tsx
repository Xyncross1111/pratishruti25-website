"use client";

import { useEffect, useMemo, useState } from "react";
import { baseSections } from "@/lib/sections";
import { Navbar } from "@/components/navbar";

type SectionScore = { section: string; score: number };

export default function AdminPage() {
  const [scores, setScores] = useState<SectionScore[]>(baseSections);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");

  const sortedSections = useMemo(() => {
    return [...scores].sort((a, b) => a.section.localeCompare(b.section, undefined, { numeric: true }));
  }, [scores]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/status");
        const data = await res.json();
        if (data?.ok) {
          setAuthed(true);
          await loadScores();
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkAuth();
  }, []);

  const loadScores = async () => {
    try {
      const res = await fetch("/api/getScores");
      if (!res.ok) throw new Error("Failed to load scores");
      const data = await res.json();
      if (Array.isArray(data)) {
        const merged = baseSections.map((base) => {
          const match = data.find((d: any) => d.section === base.section);
          return { ...base, score: Number(match?.score ?? base.score ?? 0) } as SectionScore;
        });
        setScores(merged);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to load scores");
    }
  };

  const updateScore = (section: string, value: string) => {
    setScores((prev) =>
      prev.map((item) => (item.section === section ? { ...item, score: Number(value) || 0 } : item))
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/updateScores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scores),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to update scores");
      }
      setMessage("Scores saved");
    } catch (err: any) {
      setError(err?.message ?? "Failed to save scores");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Invalid password");
      }
      setAuthed(true);
      setPassword("");
      await loadScores();
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar short />
      <main className="pt-24 max-w-4xl mx-auto px-4 pb-16">
        <h1 className="text-2xl font-semibold mb-6">Admin: Update Scores</h1>
        {message && <p className="text-emerald-400 mb-4">{message}</p>}
        {error && <p className="text-red-400 mb-4">{error}</p>}

        {!authed ? (
          <div className="max-w-md">
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/20 rounded px-3 py-2 mb-3"
            />
            <button
              onClick={handleLogin}
              className="px-4 py-2 rounded bg-emerald-500 text-black font-semibold hover:bg-emerald-400"
            >
              Login
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sortedSections.map((item) => (
                <div key={item.section} className="flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                  <span className="font-semibold">{item.section}</span>
                  <input
                    type="number"
                    value={item.score}
                    onChange={(e) => updateScore(item.section, e.target.value)}
                    className="w-24 bg-black border border-white/20 rounded px-2 py-1 text-right"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 rounded bg-emerald-500 text-black font-semibold hover:bg-emerald-400 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={loadScores}
                className="px-4 py-2 rounded bg-white/10 text-white border border-white/15 hover:bg-white/15"
              >
                Reload scores
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
