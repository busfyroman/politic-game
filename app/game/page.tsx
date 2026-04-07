"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { MINISTERS, LEVELS, SKILLS, type MinisterDef } from "@/game/data/gameConfig";
import { gameSounds, preloadVoices } from "@/game/utils/sounds";

const GameCanvas = dynamic(() => import("@/components/GameCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <p className="text-yellow-400 text-lg font-bold animate-pulse">Načítavam hru...</p>
    </div>
  ),
});

type Phase = "select" | "levels" | "playing" | "result";

interface ResultData { score: number; stars: number; time: number; levelId: number }

const GamePage: React.FC = () => {
  const [phase, setPhase] = useState<Phase>("select");
  const [selected, setSelected] = useState<MinisterDef | null>(null);
  const [levelId, setLevelId] = useState(1);
  const [result, setResult] = useState<ResultData | null>(null);
  const [showGuide, setShowGuide] = useState(true);

  const handleSelect = useCallback((m: MinisterDef) => {
    setSelected(m);
    gameSounds.init();
    preloadVoices(m.id);
    setPhase("levels");
  }, []);

  const handleLevelSelect = useCallback((id: number) => {
    setLevelId(id);
    setPhase("playing");
  }, []);

  const handleBack = useCallback(() => {
    setPhase("levels");
  }, []);

  const handleBackToSelect = useCallback(() => {
    setSelected(null);
    setPhase("select");
  }, []);

  const handleComplete = useCallback((score: number, stars: number, time: number) => {
    setResult({ score, stars, time, levelId });
    setPhase("result");
  }, [levelId]);

  if (phase === "playing" && selected) {
    return (
      <div className="h-screen w-full">
        <GameCanvas
          minister={selected}
          levelId={levelId}
          onBack={handleBack}
          onComplete={handleComplete}
        />
      </div>
    );
  }

  if (phase === "result" && result) {
    const lvl = LEVELS.find((l) => l.id === result.levelId);
    const success = result.stars > 0;
    const nextLevel = LEVELS.find((l) => l.id === result.levelId + 1);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="mb-2 text-4xl">{success ? "🎉" : "💀"}</div>
          <h2
            className="mb-1 text-3xl font-black"
            style={{
              background: success ? "linear-gradient(135deg, #ffd700, #ffaa00)" : "linear-gradient(135deg, #ef4444, #dc2626)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}
          >
            {success ? "HOTOVO!" : "KONIEC!"}
          </h2>
          <p className="mb-4 text-sm text-white/40">
            {lvl?.name ?? ""} – {lvl?.subtitle ?? ""}
          </p>

          {success && (
            <div className="mb-4 text-4xl">
              {"⭐".repeat(result.stars)}{"☆".repeat(3 - result.stars)}
            </div>
          )}

          <div className="mb-1 text-2xl font-bold text-yellow-400">
            {result.score.toLocaleString("sk-SK")} €
          </div>
          <p className="mb-6 text-xs text-white/30">
            Čas: {Math.floor(result.time)}s
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setResult(null); setPhase("playing"); }}
              className="rounded-xl bg-yellow-600/20 px-6 py-3 text-sm font-bold text-yellow-400 transition-colors hover:bg-yellow-600/30"
            >
              Skúsiť znova
            </button>
            {success && nextLevel && (
              <button
                onClick={() => { setResult(null); handleLevelSelect(nextLevel.id); }}
                className="rounded-xl bg-green-600/20 px-6 py-3 text-sm font-bold text-green-400 transition-colors hover:bg-green-600/30"
              >
                Ďalší level: {nextLevel.name}
              </button>
            )}
            <button
              onClick={() => { setResult(null); setPhase("levels"); }}
              className="rounded-xl bg-white/5 px-6 py-3 text-sm text-white/50 transition-colors hover:bg-white/10"
            >
              Výber levelu
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "levels" && selected) {
    return (
      <div className="flex min-h-screen flex-col items-center bg-[#0a0a0a] px-4 py-8">
        <div className="mb-6 text-center">
          <button
            onClick={handleBackToSelect}
            className="mb-4 text-xs text-white/30 transition-colors hover:text-white/60"
          >
            ← Zmeniť ministra
          </button>
          <h1
            className="mb-1 text-3xl font-black tracking-tight md:text-4xl"
            style={{
              background: "linear-gradient(135deg, #ffd700, #ffaa00)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}
          >
            VYBER LEVEL
          </h1>
          <div className="mt-2 flex items-center justify-center gap-3">
            <Image
              src={selected.photo}
              alt={selected.name}
              width={40}
              height={40}
              className="rounded-full ring-2 ring-yellow-500/50 object-cover"
            />
            <p className="text-sm text-white/50">Hráš ako: <span className="text-yellow-400 font-bold">{selected.name}</span></p>
          </div>
        </div>

        <div className="grid w-full max-w-2xl gap-4 md:grid-cols-3">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => handleLevelSelect(lvl.id)}
              className="group relative flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center transition-all hover:border-yellow-600/40 hover:bg-yellow-900/10 hover:shadow-[0_0_30px_rgba(255,215,0,0.08)] active:scale-95"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-2xl font-black text-yellow-400">
                {lvl.id}
              </div>
              <div>
                <div className="text-sm font-bold text-white/80 group-hover:text-yellow-300">
                  {lvl.name}
                </div>
                <div className="mt-1 text-[10px] text-white/25">
                  {lvl.subtitle}
                </div>
              </div>
              <div className="text-xs text-white/30">
                Cieľ: {lvl.target.toLocaleString("sk-SK")} € | {Math.floor(lvl.timeLimit / 60)}:{(lvl.timeLimit % 60).toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-white/20">
                {lvl.enemies.length} nepriateľov
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#0a0a0a] px-4 py-8">
      <div className="mb-2 text-center">
        <h1
          className="mb-1 text-4xl font-black tracking-tight md:text-5xl"
          style={{
            background: "linear-gradient(135deg, #ffd700, #ffaa00)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}
        >
          KRADNI A VLÁDNI
        </h1>
        <p className="text-lg font-bold text-white/20">Satirická akčná hra</p>
        <p className="mt-1 text-sm italic text-white/30">Vyber si ministra a začni kradnúť</p>
      </div>

      <div className="mt-6 w-full max-w-3xl">
        <button
          onClick={() => setShowGuide((v) => !v)}
          className="mx-auto mb-4 flex items-center gap-2 rounded-xl border border-yellow-500/20 bg-yellow-900/10 px-5 py-2.5 text-sm font-bold text-yellow-400 transition-all hover:border-yellow-500/40 hover:bg-yellow-900/20"
        >
          <span className="text-base">📖</span>
          Ako hrať
          <span className={`ml-1 text-[10px] transition-transform duration-200 ${showGuide ? "rotate-180" : ""}`}>▼</span>
        </button>

        {showGuide && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-yellow-400">
                  Ovládanie — Klávesnica
                </h3>
                <div className="space-y-2">
                  {[
                    { keys: "W A S D / šípky", action: "Pohyb postavou" },
                    { keys: "SHIFT", action: "Dash (rýchly únik)" },
                    { keys: "SPACE", action: "Použiť aktívny skill" },
                    { keys: "1 – 4", action: "Prepnúť skill" },
                    { keys: "ESC", action: "Pauza" },
                  ].map((row) => (
                    <div key={row.keys} className="flex items-center gap-3">
                      <span className="inline-block min-w-[120px] rounded-lg bg-white/5 px-2.5 py-1 text-center text-xs font-mono font-bold text-white/70">
                        {row.keys}
                      </span>
                      <span className="text-xs text-white/50">{row.action}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-yellow-400">
                  Ovládanie — Mobil
                </h3>
                <div className="space-y-2">
                  {[
                    { keys: "Ľavá strana", action: "Virtuálny joystick" },
                    { keys: "Pravá – stred", action: "Použiť skill" },
                    { keys: "Pravá – spodok", action: "Dash" },
                  ].map((row) => (
                    <div key={row.keys} className="flex items-center gap-3">
                      <span className="inline-block min-w-[120px] rounded-lg bg-white/5 px-2.5 py-1 text-center text-xs font-bold text-white/70">
                        {row.keys}
                      </span>
                      <span className="text-xs text-white/50">{row.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <hr className="my-4 border-white/5" />

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-yellow-400">
                  Cieľ hry
                </h3>
                <ul className="space-y-1.5 text-xs text-white/50">
                  <li className="flex gap-2"><span className="text-yellow-500">💰</span>Zbieraj peniaze a dosiahni cieľovú sumu pred koncom času</li>
                  <li className="flex gap-2"><span className="text-yellow-500">🔗</span>Zberaj rýchlo za sebou a buduj combo pre vyšší násobič</li>
                  <li className="flex gap-2"><span className="text-yellow-500">🚔</span>Vyhýbaj sa NAKA, polícii a novinárom</li>
                  <li className="flex gap-2"><span className="text-yellow-500">⚠️</span>Čím viac kradneš, tým vyššia je tvoja „wanted" úroveň</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-yellow-400">
                  Skilly (stoja peniaze)
                </h3>
                <div className="space-y-1.5">
                  {SKILLS.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-2 text-xs">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-white/5 text-[10px] font-bold text-white/60">{i + 1}</span>
                      <span>{s.icon}</span>
                      <span className="font-semibold" style={{ color: s.color }}>{s.name}</span>
                      <span className="text-white/30">({s.cost.toLocaleString("sk-SK")} €)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <hr className="my-4 border-white/5" />

            <div>
              <h3 className="mb-3 text-sm font-black uppercase tracking-wider text-yellow-400">
                Nepriatelia
              </h3>
              <div className="flex flex-wrap gap-4">
                {[
                  { label: "NAKA", color: "#1e3a5f", desc: "Vyšetruje korupciu, prenasleduje ťa" },
                  { label: "Polícia", color: "#1e4a1e", desc: "Rýchla, ale krátky dosah" },
                  { label: "Novinári", color: "#4a1e5f", desc: "Zvyšujú tvoju wanted úroveň" },
                ].map((e) => (
                  <div key={e.label} className="flex items-center gap-2 text-xs">
                    <span className="h-3 w-3 rounded-full" style={{ background: e.color }} />
                    <span className="font-bold text-white/60">{e.label}</span>
                    <span className="text-white/30">— {e.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {MINISTERS.map((m) => (
          <button
            key={m.id}
            onClick={() => handleSelect(m)}
            className="group flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-yellow-600/40 hover:bg-yellow-900/10 hover:shadow-[0_0_20px_rgba(255,215,0,0.05)] active:scale-95"
          >
            <Image
              src={m.photo}
              alt={m.name}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-white/10 transition-all group-hover:ring-yellow-500/50"
            />
            <div className="text-center">
              <div className="text-xs font-semibold text-white/80 group-hover:text-yellow-300">
                {m.name}
              </div>
              <div className="mt-0.5 text-[10px] text-white/25 group-hover:text-white/40">
                {m.abilityName}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GamePage;
