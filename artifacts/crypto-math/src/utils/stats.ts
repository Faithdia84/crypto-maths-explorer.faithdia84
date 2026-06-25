export interface AppStats {
  encryptions: Record<string, number>;
  decryptions: number;
  quizScores: number[];
  challengeScores: { score: number; difficulty: string; date: string }[];
  comparisonsRun: number;
  agentMissionsCompleted: number;
}

const KEY = "mmm_stats";

const defaults: AppStats = {
  encryptions: {},
  decryptions: 0,
  quizScores: [],
  challengeScores: [],
  comparisonsRun: 0,
  agentMissionsCompleted: 0,
};

export function getStats(): AppStats {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : { ...defaults };
  } catch {
    return { ...defaults };
  }
}

function save(stats: AppStats) {
  localStorage.setItem(KEY, JSON.stringify(stats));
}

export function recordEncryption(cipher: string) {
  const s = getStats();
  s.encryptions[cipher] = (s.encryptions[cipher] ?? 0) + 1;
  save(s);
}

export function recordDecryption() {
  const s = getStats();
  s.decryptions++;
  save(s);
}

export function recordQuizScore(score: number) {
  const s = getStats();
  s.quizScores = [score, ...s.quizScores].slice(0, 20);
  save(s);
}

export function recordChallengeScore(score: number, difficulty: string) {
  const s = getStats();
  s.challengeScores = [
    { score, difficulty, date: new Date().toLocaleDateString() },
    ...s.challengeScores,
  ].slice(0, 20);
  save(s);
}

export function recordComparison() {
  const s = getStats();
  s.comparisonsRun++;
  save(s);
}

export function recordAgentMission() {
  const s = getStats();
  s.agentMissionsCompleted++;
  save(s);
}

export function mostUsedCipher(s: AppStats): string {
  const entries = Object.entries(s.encryptions);
  if (!entries.length) return "None yet";
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

export function totalEncryptions(s: AppStats): number {
  return Object.values(s.encryptions).reduce((a, b) => a + b, 0);
}
