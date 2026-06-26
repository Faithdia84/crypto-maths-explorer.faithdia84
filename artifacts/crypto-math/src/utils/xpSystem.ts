import { getStats, totalEncryptions } from "./stats";
import { getCBStats } from "./cbData";

export interface LevelInfo {
  level: number;
  title: string;
  xpRequired: number;
  nextXP: number;
  color: string;
  emoji: string;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: "Beginner",             xpRequired: 0,    nextXP: 200,  color: "from-gray-400 to-gray-600",     emoji: "🌱" },
  { level: 2, title: "Decoder",              xpRequired: 200,  nextXP: 500,  color: "from-green-500 to-teal-600",    emoji: "🔓" },
  { level: 3, title: "Agent",                xpRequired: 500,  nextXP: 1000, color: "from-blue-500 to-blue-700",     emoji: "🕵️" },
  { level: 4, title: "Detective",            xpRequired: 1000, nextXP: 2000, color: "from-purple-500 to-violet-600", emoji: "🔍" },
  { level: 5, title: "Cipher Expert",        xpRequired: 2000, nextXP: 4000, color: "from-orange-500 to-red-600",    emoji: "⚡" },
  { level: 6, title: "Cryptography Master",  xpRequired: 4000, nextXP: 8000, color: "from-pink-500 to-rose-600",     emoji: "🔐" },
  { level: 7, title: "Grand Master",         xpRequired: 8000, nextXP: 99999,color: "from-yellow-400 to-amber-500",  emoji: "👑" },
];

const BONUS_KEY = "mmm_bonus_xp";
const AGENT_KEY = "mmm_agent_profile";

export interface AgentProfile {
  name: string;
  avatar: string;
}

export function getAgentProfile(): AgentProfile {
  try {
    const raw = localStorage.getItem(AGENT_KEY);
    return raw ? JSON.parse(raw) : { name: "Secret Agent", avatar: "🕵️" };
  } catch { return { name: "Secret Agent", avatar: "🕵️" }; }
}

export function saveAgentProfile(p: AgentProfile): void {
  localStorage.setItem(AGENT_KEY, JSON.stringify(p));
}

export function getBonusXP(): number {
  try { return parseInt(localStorage.getItem(BONUS_KEY) || "0"); }
  catch { return 0; }
}

export function addBonusXP(amount: number): void {
  const current = getBonusXP();
  localStorage.setItem(BONUS_KEY, String(current + amount));
}

export function computeTotalXP(): number {
  const stats = getStats();
  const cb = getCBStats();

  const encryptXP  = totalEncryptions(stats) * 5;
  const decryptXP  = stats.decryptions * 3;
  const quizXP     = stats.quizScores.reduce((s, v) => s + v * 10, 0);
  const compareXP  = stats.comparisonsRun * 2;
  const cbCorrect  = cb.correctAnswers * 20;
  const missionXP  = cb.missionsCompleted * 100;
  const masterXP   = cb.masterCompleted ? 500 : 0;
  const cbScore    = Math.floor(cb.totalScore / 10);
  const bonusXP    = getBonusXP();

  return encryptXP + decryptXP + quizXP + compareXP + cbCorrect + missionXP + masterXP + cbScore + bonusXP;
}

export function getLevelInfo(xp: number): LevelInfo & { progress: number } {
  let info = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.xpRequired) info = l; else break; }
  const xpInLevel = xp - info.xpRequired;
  const xpNeeded  = info.nextXP - info.xpRequired;
  const progress   = info.level === 7 ? 100 : Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));
  return { ...info, progress };
}

export const AVATARS = ["🕵️","🦸","🦊","🐺","🦅","🐍","🦁","⚡","🎯","🔮"];
