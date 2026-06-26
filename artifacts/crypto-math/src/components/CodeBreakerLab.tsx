import { useState } from "react";
import { Shield, Search, Gamepad2, Target, Trophy, Crown, Zap } from "lucide-react";
import CodeBreakerChallenge from "./codebreaker/CodeBreakerChallenge";
import CaesarCracker from "./codebreaker/CaesarCracker";
import GuessCipher from "./codebreaker/GuessCipher";
import SpyMissions from "./codebreaker/SpyMissions";
import AchievementsPanel from "./codebreaker/AchievementsPanel";
import MasterChallenge from "./codebreaker/MasterChallenge";
import SpeedChallenge from "./codebreaker/SpeedChallenge";

type Tab = "challenge" | "speed" | "cracker" | "guess" | "missions" | "achievements" | "master";

interface TabConfig { id: Tab; label: string; icon: React.ReactNode; color: string; desc: string; }

const TABS: TabConfig[] = [
  { id: "challenge",    label: "Decode",       icon: <Shield className="w-4 h-4" />,    color: "from-green-500 to-teal-600",    desc: "Break 3 difficulty levels" },
  { id: "speed",        label: "Speed",         icon: <Zap className="w-4 h-4" />,       color: "from-yellow-500 to-orange-500", desc: "30-second blitz" },
  { id: "cracker",      label: "Crack Caesar",  icon: <Search className="w-4 h-4" />,    color: "from-indigo-500 to-purple-600", desc: "Try all 25 keys" },
  { id: "guess",        label: "Guess Cipher",  icon: <Gamepad2 className="w-4 h-4" />,  color: "from-violet-500 to-purple-600", desc: "Identify the cipher" },
  { id: "missions",     label: "Spy Missions",  icon: <Target className="w-4 h-4" />,    color: "from-slate-600 to-slate-800",   desc: "Complete 4 missions" },
  { id: "achievements", label: "Achievements",  icon: <Trophy className="w-4 h-4" />,    color: "from-yellow-500 to-amber-600",  desc: "Badges & leaderboard" },
  { id: "master",       label: "Master",        icon: <Crown className="w-4 h-4" />,     color: "from-yellow-400 to-yellow-600", desc: "Final challenge" },
];

export default function CodeBreakerLab() {
  const [tab, setTab] = useState<Tab>("challenge");
  const active = TABS.find((t) => t.id === tab)!;

  return (
    <section id="codebreaker" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            🔓 Interactive Lab
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Code Breaker <span className="gradient-text">Lab</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Practice decoding, crack ciphers, go on spy missions, and become a Master Code Breaker!
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-8">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`rounded-2xl p-3 text-center transition-all flex flex-col items-center gap-1.5 ${
                tab === t.id
                  ? `bg-gradient-to-br ${t.color} text-white shadow-md scale-105`
                  : "bg-card border border-border text-muted-foreground hover:bg-muted card-hover"
              }`}>
              <div>{t.icon}</div>
              <div className="text-xs font-bold leading-tight">{t.label}</div>
            </button>
          ))}
        </div>

        <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${active.color} text-white text-sm font-bold px-4 py-1.5 rounded-full mb-6`}>
          {active.icon} {active.label} — {active.desc}
        </div>

        <div className="bg-card border border-border rounded-3xl p-5 sm:p-8 shadow-sm min-h-[400px] animate-fade-in">
          {tab === "challenge"     && <CodeBreakerChallenge />}
          {tab === "speed"         && <SpeedChallenge />}
          {tab === "cracker"       && <CaesarCracker />}
          {tab === "guess"         && <GuessCipher />}
          {tab === "missions"      && <SpyMissions />}
          {tab === "achievements"  && <AchievementsPanel />}
          {tab === "master"        && <MasterChallenge />}
        </div>
      </div>
    </section>
  );
}
