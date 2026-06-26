import { useState, useEffect } from "react";
import { BarChart3, RefreshCw, Edit3, Check } from "lucide-react";
import { getStats, totalEncryptions, mostUsedCipher } from "../utils/stats";
import { getCBStats } from "../utils/cbData";
import {
  computeTotalXP, getLevelInfo, getAgentProfile, saveAgentProfile, AVATARS,
} from "../utils/xpSystem";
import { showToast } from "../utils/toast";

export default function SpyDashboard() {
  const [xp, setXp] = useState(computeTotalXP);
  const [profile, setProfile] = useState(getAgentProfile);
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [stats, setStats] = useState(getStats);
  const [cb, setCb] = useState(getCBStats);

  const refresh = () => {
    const newXP = computeTotalXP();
    setXp(newXP);
    setStats(getStats());
    setCb(getCBStats());
  };

  useEffect(() => { refresh(); }, []);

  const level = getLevelInfo(xp);
  const encTotal = totalEncryptions(stats);
  const topCipher = mostUsedCipher(stats);

  const saveName = () => {
    const updated = { ...profile, name: nameInput.trim() || "Secret Agent" };
    setProfile(updated);
    saveAgentProfile(updated);
    setEditName(false);
    showToast("Agent profile updated!", "success");
  };

  const selectAvatar = (a: string) => {
    const updated = { ...profile, avatar: a };
    setProfile(updated);
    saveAgentProfile(updated);
    showToast("Avatar updated!", "success");
  };

  const agentId = `MMM-${String(encTotal + cb.correctAnswers + cb.missionsCompleted).padStart(4, "0")}`;

  const cipherOrder = Object.entries(stats.encryptions).sort((a, b) => b[1] - a[1]);

  return (
    <section id="spy-dashboard" className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            🕵️ Spy HQ
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Spy <span className="gradient-text">Dashboard</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your mission status, XP progress, rank, and complete activity overview — all in one place.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className={`lg:col-span-1 bg-gradient-to-br ${level.color} rounded-3xl p-6 text-white shadow-2xl`}>
            <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-4">🔒 CLASSIFIED — AGENT FILE</div>

            <div className="flex items-center gap-4 mb-5">
              <button className="relative group">
                <div className="text-6xl">{profile.avatar}</div>
                <div className="absolute -bottom-1 -right-1 bg-white/20 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all text-xs">✏️</div>
              </button>
              <div>
                {editName ? (
                  <div className="flex items-center gap-1">
                    <input
                      autoFocus
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveName()}
                      className="bg-white/20 text-white placeholder-white/60 rounded-lg px-2 py-1 text-sm font-bold w-32 outline-none border border-white/40"
                    />
                    <button onClick={saveName} className="bg-white/20 rounded-lg p-1 hover:bg-white/30">
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <div className="font-black text-lg leading-tight">{profile.name}</div>
                    <button onClick={() => { setNameInput(profile.name); setEditName(true); }} className="opacity-60 hover:opacity-100">
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div className="text-white/70 text-xs mt-0.5">ID: {agentId}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-5">
              {AVATARS.map((a) => (
                <button key={a} onClick={() => selectAvatar(a)}
                  className={`text-xl rounded-xl p-1.5 transition-all hover:scale-110 ${profile.avatar === a ? "bg-white/30 ring-2 ring-white" : "bg-white/10 hover:bg-white/20"}`}>
                  {a}
                </button>
              ))}
            </div>

            <div className="bg-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-sm">{level.emoji} {level.title}</span>
                <span className="text-xs opacity-70">Level {level.level}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2.5 mb-1.5">
                <div className="h-2.5 bg-white rounded-full transition-all duration-700" style={{ width: `${level.progress}%` }} />
              </div>
              <div className="text-xs opacity-70 flex justify-between">
                <span>{xp} XP total</span>
                {level.level < 7 && <span>→ {LEVELS.find(l => l.level === level.level + 1)?.xpRequired} XP for next level</span>}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {[
              { label: "Total XP",          value: xp,                     icon: "⭐", color: "text-yellow-500" },
              { label: "Rank",              value: `${level.emoji} ${level.title}`, icon: "🎖️", color: "text-primary" },
              { label: "Total Encryptions", value: encTotal,               icon: "🔒", color: "text-purple-500" },
              { label: "Code Breaker Score",value: cb.totalScore,          icon: "🏆", color: "text-amber-500" },
              { label: "Missions Done",     value: cb.missionsCompleted,   icon: "🕵️", color: "text-green-500" },
              { label: "Correct Decodes",   value: cb.correctAnswers,      icon: "✅", color: "text-teal-500" },
              { label: "Quiz Best",         value: stats.quizScores.length ? `${Math.max(...stats.quizScores)}/10` : "—", icon: "🧠", color: "text-blue-500" },
              { label: "Favourite Cipher",  value: topCipher || "—",       icon: "❤️", color: "text-rose-500" },
            ].map((s) => (
              <div key={s.label} className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center gap-3 card-hover">
                <div className="text-3xl">{s.icon}</div>
                <div>
                  <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Cipher Usage
            </h3>
            <p className="text-xs text-muted-foreground mb-4">All encryptions across Cipher Lab & Comparison</p>
            {cipherOrder.length === 0 ? (
              <div className="text-muted-foreground text-sm text-center py-6">No encryptions yet — try the Cipher Lab!</div>
            ) : (
              <div className="space-y-2.5">
                {cipherOrder.map(([cipher, count]) => (
                  <div key={cipher}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{cipher}</span>
                      <span className="text-muted-foreground font-mono text-xs">{count}×</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-2 gradient-bg rounded-full transition-all duration-700"
                        style={{ width: `${Math.round((count / cipherOrder[0][1]) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-1">📈 Level Progress</h3>
            <p className="text-xs text-muted-foreground mb-4">XP gained from all activities</p>
            <div className="space-y-3">
              {LEVELS.map((l) => {
                const reached = xp >= l.xpRequired;
                const isCurrent = l.level === level.level;
                return (
                  <div key={l.level} className={`flex items-center gap-3 rounded-xl px-3 py-2 transition-all ${isCurrent ? "bg-primary/10 border border-primary/30" : reached ? "bg-muted/50" : "opacity-40"}`}>
                    <div className={`text-xl ${!reached ? "grayscale" : ""}`}>{l.emoji}</div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className={`text-sm font-bold ${isCurrent ? "text-primary" : ""}`}>
                          Lv.{l.level} {l.title}
                        </span>
                        <span className="text-xs text-muted-foreground">{l.xpRequired}+ XP</span>
                      </div>
                    </div>
                    {reached && !isCurrent && <span className="text-green-500 text-xs font-bold">✓</span>}
                    {isCurrent && <span className="text-primary text-xs font-bold">← NOW</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 dark:bg-black/50 border border-green-800 rounded-2xl p-5 mb-6">
          <div className="text-green-400 font-mono text-xs font-bold mb-3 uppercase tracking-widest">
            &gt; MISSION LOG — ACTIVITY REPORT
          </div>
          <div className="space-y-1.5 font-mono text-xs max-h-48 overflow-y-auto">
            {encTotal > 0 && <div className="text-green-300"><span className="text-green-600">[INFO]</span> Encrypted {encTotal} messages across all ciphers</div>}
            {stats.decryptions > 0 && <div className="text-green-300"><span className="text-green-600">[INFO]</span> Decrypted {stats.decryptions} messages</div>}
            {stats.quizScores.length > 0 && <div className="text-green-300"><span className="text-green-600">[INFO]</span> Completed {stats.quizScores.length} quiz attempt(s) — best: {Math.max(...stats.quizScores)}/10</div>}
            {cb.correctAnswers > 0 && <div className="text-green-300"><span className="text-green-600">[INFO]</span> Solved {cb.correctAnswers} Code Breaker challenge(s)</div>}
            {cb.missionsCompleted > 0 && <div className="text-green-300"><span className="text-blue-400">[SUCCESS]</span> Completed {cb.missionsCompleted} spy mission(s)</div>}
            {cb.masterCompleted && <div className="text-yellow-400"><span className="text-yellow-600">[CLASSIFIED]</span> Master Code Breaker title EARNED</div>}
            {stats.comparisonsRun > 0 && <div className="text-green-300"><span className="text-green-600">[INFO]</span> Ran {stats.comparisonsRun} cipher comparison(s)</div>}
            {topCipher && <div className="text-green-300"><span className="text-green-600">[ANALYSIS]</span> Preferred cipher: {topCipher}</div>}
            {encTotal === 0 && cb.correctAnswers === 0 && (
              <div className="text-green-700">No activity yet. Start exploring the site to build your record.</div>
            )}
            <div className="text-green-700 animate-pulse">&gt; _</div>
          </div>
        </div>

        <div className="flex justify-center">
          <button onClick={refresh}
            className="flex items-center gap-2 bg-muted text-foreground font-bold px-6 py-3 rounded-xl hover:bg-muted/70 transition-all">
            <RefreshCw className="w-4 h-4" /> Refresh Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}

const LEVELS = [
  { level: 1, title: "Beginner",             xpRequired: 0,    emoji: "🌱" },
  { level: 2, title: "Decoder",              xpRequired: 200,  emoji: "🔓" },
  { level: 3, title: "Agent",                xpRequired: 500,  emoji: "🕵️" },
  { level: 4, title: "Detective",            xpRequired: 1000, emoji: "🔍" },
  { level: 5, title: "Cipher Expert",        xpRequired: 2000, emoji: "⚡" },
  { level: 6, title: "Cryptography Master",  xpRequired: 4000, emoji: "🔐" },
  { level: 7, title: "Grand Master",         xpRequired: 8000, emoji: "👑" },
];
