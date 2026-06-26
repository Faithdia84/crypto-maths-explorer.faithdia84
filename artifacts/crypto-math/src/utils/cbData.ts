import { caesarShift, toNumber, toMorse, toSymbol, toBinary } from "./ciphers";

export interface Challenge {
  id: string;
  difficulty: "easy" | "medium" | "hard";
  cipher: string;
  encrypted: string;
  answer: string;
  hint: string;
  explanation: string;
  howItWorks: string;
  mathNote: string;
  example: string;
}

export interface MissionStep {
  cipher: string;
  encrypted: string;
  answer: string;
  hint: string;
}

export interface Mission {
  id: string;
  title: string;
  emoji: string;
  story: string;
  steps: MissionStep[];
  reward: string;
  badge: string;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  color: string;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  missions: number;
  date: string;
}

export interface CBStats {
  totalScore: number;
  correctAnswers: number;
  incorrectAnswers: number;
  fastestTime: number | null;
  highestScore: number;
  missionsCompleted: number;
  hintsUsed: number;
  completedChallenges: string[];
  unlockedAchievements: string[];
  masterCompleted: boolean;
  guessCipherCorrect: number;
}

const DEFAULT_STATS: CBStats = {
  totalScore: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  fastestTime: null,
  highestScore: 0,
  missionsCompleted: 0,
  hintsUsed: 0,
  completedChallenges: [],
  unlockedAchievements: [],
  masterCompleted: false,
  guessCipherCorrect: 0,
};

const STATS_KEY = "mmm_cb_stats";
const LB_KEY = "mmm_cb_leaderboard";

export function getCBStats(): CBStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? { ...DEFAULT_STATS, ...JSON.parse(raw) } : { ...DEFAULT_STATS };
  } catch { return { ...DEFAULT_STATS }; }
}

export function saveCBStats(s: CBStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(s));
}

export function updateCBStats(patch: Partial<CBStats>): CBStats {
  const s = { ...getCBStats(), ...patch };
  saveCBStats(s);
  return s;
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function addLeaderboardEntry(entry: LeaderboardEntry): void {
  const lb = getLeaderboard();
  lb.push(entry);
  lb.sort((a, b) => b.score - a.score);
  localStorage.setItem(LB_KEY, JSON.stringify(lb.slice(0, 20)));
}

export const COMMON_WORDS = new Set([
  "THE","AND","FOR","ARE","BUT","NOT","YOU","ALL","CAN","HER",
  "WAS","ONE","OUR","OUT","DAY","GET","HAS","HIM","HIS","HOW",
  "ITS","MAY","NEW","NOW","OLD","SEE","TWO","WAY","WHO","BOY",
  "HELLO","WORLD","SECRET","CODE","CIPHER","MATHS","HELP","AGENT",
  "SPY","MEET","DAWN","ENEMY","BASE","FREE","SEND","FOLLOW","MAP",
  "MISSION","MESSAGE","DECODE","ENCRYPT","KEY","LOCK","TIME","YES",
  "GOOD","SAFE","COME","HERE","THIS","THAT","WHAT","WITH","THEY",
  "HAVE","FROM","WILL","BEEN","EACH","KNOW","INTO","ONLY","ALSO",
]);

export const EASY_CHALLENGES: Challenge[] = [
  {
    id: "easy-1",
    difficulty: "easy",
    cipher: "Caesar Cipher (Shift 3)",
    encrypted: "KHOOR",
    answer: "HELLO",
    hint: "This is a Caesar cipher. Try shifting each letter backwards by 3 positions in the alphabet.",
    explanation: "The encrypted message 'KHOOR' uses a Caesar Cipher with a shift of 3. Each letter was moved forward 3 places.",
    howItWorks: "A Caesar Cipher replaces each letter with the letter that is a fixed number of positions down the alphabet. With a shift of 3: A→D, B→E, C→F, and so on.",
    mathNote: "Mathematically: Encrypt(x) = (x + 3) mod 26. To decrypt: (x − 3 + 26) mod 26. Here mod 26 keeps us within the 26 letters of the alphabet.",
    example: "H(8) + 3 = K(11), E(5) + 3 = H(8), L(12) + 3 = O(15), L(12) + 3 = O(15), O(15) + 3 = R(18) → KHOOR",
  },
  {
    id: "easy-2",
    difficulty: "easy",
    cipher: "Caesar Cipher (Shift 3)",
    encrypted: "PDWKV LV IXQ",
    answer: "MATHS IS FUN",
    hint: "Caesar cipher again! Shift each letter 3 positions backwards. Spaces stay the same.",
    explanation: "'PDWKV LV IXQ' decodes to 'MATHS IS FUN' using Caesar Cipher (shift 3).",
    howItWorks: "Every letter is shifted forward by 3. To decode, shift every letter backward by 3. Non-letter characters like spaces are not changed.",
    mathNote: "Decrypt(x) = (x − 3 + 26) mod 26. For M: P(16) − 3 = M(13). For A: D(4) − 3 = A(1).",
    example: "P→M, D→A, W→T, K→H, V→S gives MATHS. L→I, V→S gives IS. I→F, X→U, Q→N gives FUN.",
  },
  {
    id: "easy-3",
    difficulty: "easy",
    cipher: "Number Cipher",
    encrypted: "8 5 12 12 15",
    answer: "HELLO",
    hint: "Each number represents a letter! A=1, B=2, C=3... Z=26. What word do these numbers spell?",
    explanation: "The Number Cipher replaces each letter with its position in the alphabet. 8=H, 5=E, 12=L, 12=L, 15=O → HELLO.",
    howItWorks: "Assign A=1, B=2, C=3, all the way to Z=26. To encrypt, replace each letter with its number. To decode, look up each number.",
    mathNote: "Encrypt(A)=1, Encrypt(B)=2 … Encrypt(Z)=26. Decode: letter = character at position n in the alphabet.",
    example: "H is the 8th letter, E is 5th, L is 12th, L is 12th, O is 15th → 8 5 12 12 15 → HELLO.",
  },
  {
    id: "easy-4",
    difficulty: "easy",
    cipher: "Number Cipher",
    encrypted: "3 15 4 5",
    answer: "CODE",
    hint: "Number cipher! Remember A=1, B=2 … Z=26. Convert each number to a letter.",
    explanation: "'3 15 4 5' becomes 'CODE' using the Number Cipher. C=3, O=15, D=4, E=5.",
    howItWorks: "Each letter in the alphabet has a number: C is the 3rd letter, O is the 15th, D is the 4th, and E is the 5th.",
    mathNote: "Position in alphabet: A=1, B=2, C=3, D=4, E=5, F=6 … Z=26.",
    example: "3→C, 15→O, 4→D, 5→E → CODE",
  },
];

export const MEDIUM_CHALLENGES: Challenge[] = [
  {
    id: "med-1",
    difficulty: "medium",
    cipher: "Caesar Cipher (Shift 13 — ROT13)",
    encrypted: "URYYB",
    answer: "HELLO",
    hint: "This uses ROT13 — shift each letter by exactly 13. ROT13 is special because encoding and decoding use the same operation!",
    explanation: "'URYYB' decodes to 'HELLO' using ROT13 (Caesar shift 13). Each letter is shifted back by 13 positions.",
    howItWorks: "ROT13 is a special Caesar Cipher where each letter is shifted by exactly 13. Since the alphabet has 26 letters, applying ROT13 twice gives back the original message!",
    mathNote: "Encrypt(x) = (x + 13) mod 26. Since 13 + 13 = 26 ≡ 0 (mod 26), ROT13 is its own inverse: Decrypt = Encrypt.",
    example: "U(21)−13=H(8), R(18)−13=E(5), Y(25)−13=L(12), Y(25)−13=L(12), B(2)−13+26=O(15) → HELLO",
  },
  {
    id: "med-2",
    difficulty: "medium",
    cipher: "Caesar Cipher (Shift 7)",
    encrypted: "OLSSV",
    answer: "HELLO",
    hint: "Caesar cipher with a key of 7. Shift each letter backward by 7 positions to decode.",
    explanation: "'OLSSV' is 'HELLO' encrypted with a Caesar shift of 7. Each letter was moved forward 7 places.",
    howItWorks: "The shift key this time is 7, not 3. A becomes H, B becomes I, and so on. To decode, go backward by 7.",
    mathNote: "Decrypt(x) = (x − 7 + 26) mod 26. O(15)−7=H(8), L(12)−7=E(5), S(19)−7=L(12), V(22)−7=O(15).",
    example: "O→H, L→E, S→L, S→L, V→O → HELLO",
  },
  {
    id: "med-3",
    difficulty: "medium",
    cipher: "Reverse Cipher",
    encrypted: "EDOC TERCES",
    answer: "SECRET CODE",
    hint: "Try reading the message backwards! Each word is reversed, and the words are also in reverse order.",
    explanation: "'EDOC TERCES' is 'SECRET CODE' written entirely in reverse. The whole string was flipped.",
    howItWorks: "The Reverse Cipher simply writes the entire message backwards. To decode it, you just read it backwards again.",
    mathNote: "If message = m₁m₂m₃…mₙ, then encrypted = mₙ…m₃m₂m₁. Decryption is identical to encryption — it is self-inverse.",
    example: "SECRET CODE → reverse all characters → EDOC TERCES. Decode: reverse EDOC TERCES → SECRET CODE.",
  },
  {
    id: "med-4",
    difficulty: "medium",
    cipher: "Morse Code",
    encrypted: "... . -.-. .-. . -",
    answer: "SECRET",
    hint: "Each group of dots and dashes represents one letter. S=... E=. C=-.-. R=.-. E=. T=-",
    explanation: "'... . -.-. .-. . -' spells SECRET in Morse Code. Each letter is separated by a space.",
    howItWorks: "Morse Code uses dots (short) and dashes (long) to represent letters. It was invented by Samuel Morse in 1837 and was used to send messages over telegraph wires.",
    mathNote: "Each letter maps to a unique pattern. With 2 symbols (dot/dash), you can encode up to 2¹+2²+2³+2⁴ = 30 unique patterns of length 1-4.",
    example: "S=(...) E=(.) C=(-.-.) R=(.-.) E=(.) T=(-) → ... . -.-. .-. . -",
  },
];

export const HARD_CHALLENGES: Challenge[] = [
  {
    id: "hard-1",
    difficulty: "hard",
    cipher: "Binary Code",
    encrypted: "01001000 01000101 01001100 01010000",
    answer: "HELP",
    hint: "Binary! Each 8-digit group is one letter. Convert binary to decimal, then find that letter (A=65, B=66…). 01001000 = 72 = H.",
    explanation: "'01001000 01000101 01001100 01010000' is HELP in binary (ASCII). Each 8-bit group represents one character.",
    howItWorks: "Computers store text as binary (1s and 0s). Each letter has an ASCII number (H=72, E=69, L=76, P=80), and that number is stored as 8 binary digits.",
    mathNote: "01001000 in binary = 0×128+1×64+0×32+0×16+1×8+0×4+0×2+0×1 = 64+8 = 72 = H (ASCII code).",
    example: "H=72=01001000, E=69=01000101, L=76=01001100, P=80=01010000 → HELP",
  },
  {
    id: "hard-2",
    difficulty: "hard",
    cipher: "Symbol Cipher",
    encrypted: "$ < % &",
    answer: "CODE",
    hint: "Symbol cipher! Each symbol maps to a letter: @=A #=B $=C %=D &=E ←=F !=G ?=H ^=I ~=J +=K −=L ==M |=N <=O >=P",
    explanation: "'$ < % &' decodes to CODE using the Symbol Cipher. C=$, O=<, D=%, E=&.",
    howItWorks: "The Symbol Cipher replaces each letter with a unique symbol. You need the key (the symbol–letter mapping) to decode it. Without the key, it looks like random symbols!",
    mathNote: "This is a substitution cipher with a fixed symbol alphabet. There are 26! ≈ 4×10²⁶ possible symbol alphabets, making it very hard to guess without the key.",
    example: "$=C, <=O, %=D, &=E → CODE",
  },
  {
    id: "hard-3",
    difficulty: "hard",
    cipher: "Multi-Step (Caesar Shift 3 → Reverse)",
    encrypted: "WQHJD",
    answer: "AGENT",
    hint: "Two ciphers in one! First REVERSE the message, then apply Caesar decode (shift 3 backward) to each letter.",
    explanation: "'WQHJD' was created by: 1) Encrypting AGENT with Caesar shift 3 → DJHQW, then 2) Reversing DJHQW → WQHJD. Decode by reversing the steps.",
    howItWorks: "Multi-step ciphers chain multiple ciphers together, making them much harder to crack. To decode, you must reverse each step in reverse order.",
    mathNote: "Combined: f(g(x)) where g = Caesar shift +3 and f = Reverse. Decode: f⁻¹(g⁻¹(x)) = Reverse then Caesar shift −3.",
    example: "WQHJD → reverse → DJHQW → Caesar −3 → AGENT",
  },
  {
    id: "hard-4",
    difficulty: "hard",
    cipher: "Binary Code",
    encrypted: "01010011 01010000 01011001",
    answer: "SPY",
    hint: "Binary! Convert each 8-bit group to its decimal value. S=83=01010011, P=80=01010000, Y=89=01011001.",
    explanation: "'01010011 01010000 01011001' is SPY in binary. S=83, P=80, Y=89.",
    howItWorks: "In the ASCII system, every character has a unique number. S is 83, P is 80, Y is 89. These are stored in computers as binary (8 bits each).",
    mathNote: "01010011 = 0+64+0+16+0+0+2+1 = 83 = S. 01010000 = 64+16 = 80 = P. 01011001 = 64+16+8+1 = 89 = Y.",
    example: "01010011→83→S, 01010000→80→P, 01011001→89→Y → SPY",
  },
];

export const SPY_MISSIONS: Mission[] = [
  {
    id: "mission-1",
    title: "Operation Sunrise",
    emoji: "🌅",
    story: "Enemy communications have been intercepted! Our code breakers need your help decoding two messages captured from their headquarters. The fate of the mission depends on you, Agent.",
    steps: [
      {
        cipher: "Caesar Cipher (Shift 3)",
        encrypted: "PHHW DW GDZQ",
        answer: "MEET AT DAWN",
        hint: "Caesar shift 3 — shift each letter 3 positions backwards.",
      },
      {
        cipher: "Caesar Cipher (Shift 3)",
        encrypted: "HQHPB EDVH",
        answer: "ENEMY BASE",
        hint: "Same cipher — Caesar shift 3. Shift each letter 3 places backwards.",
      },
    ],
    reward: "You decoded both enemy messages! The commander now knows where and when the enemy will strike.",
    badge: "🌅 Sunrise Agent",
    color: "from-orange-500 to-amber-600",
  },
  {
    id: "mission-2",
    title: "The Treasure Hunt",
    emoji: "💎",
    story: "An old spy left behind a treasure map encoded in a number cipher. Only those who understand the language of numbers can find the treasure. You are our best hope!",
    steps: [
      {
        cipher: "Number Cipher",
        encrypted: "6 15 12 12 15 23 0 20 8 5 0 13 1 16",
        answer: "FOLLOW THE MAP",
        hint: "Number cipher: A=1, B=2 … Z=26, 0=space. Convert each number to a letter.",
      },
      {
        cipher: "Number Cipher",
        encrypted: "24 0 13 1 18 11 19 0 20 8 5 0 19 16 15 20",
        answer: "X MARKS THE SPOT",
        hint: "Same cipher! Each number is a letter position. 24=X, 13=M, 1=A…",
      },
    ],
    reward: "Incredible! You followed the number trail to find the hidden treasure. Your mathematical skills saved the day!",
    badge: "💎 Treasure Hunter",
    color: "from-yellow-500 to-amber-600",
  },
  {
    id: "mission-3",
    title: "The Safe House",
    emoji: "🏠",
    story: "An agent trapped behind enemy lines is sending distress signals in Morse Code. The signal is weak and fading. Decode the messages quickly before the connection is lost!",
    steps: [
      {
        cipher: "Morse Code",
        encrypted: "... . -. -.. / .... . .-.. .--.",
        answer: "SEND HELP",
        hint: "Morse code! Each group is one letter, / means space. S=... E=. N=-. D=-.. H=.... E=. L=.-.. P=.--.",
      },
      {
        cipher: "Morse Code",
        encrypted: "... .- ..-. . / .... --- ..- ... .",
        answer: "SAFE HOUSE",
        hint: "More Morse! S=... A=.- F=..-. E=. / H=.... O=--- U=..- S=... E=.",
      },
    ],
    reward: "The agent has been located! Thanks to your Morse code skills, rescue teams are on their way to the safe house.",
    badge: "🏠 Safe House Hero",
    color: "from-green-500 to-teal-600",
  },
  {
    id: "mission-4",
    title: "Agent Rescue",
    emoji: "🚁",
    story: "Top-secret binary transmissions are coming in from a captured agent. The computer system can't decode them fast enough. We need a human brain — YOUR brain — to crack the binary and rescue our agent!",
    steps: [
      {
        cipher: "Binary Code",
        encrypted: "01000110 01010010 01000101 01000101",
        answer: "FREE",
        hint: "Binary! Convert each 8 bits to decimal: F=70=01000110, R=82=01010010, E=69=01000101.",
      },
      {
        cipher: "Binary Code",
        encrypted: "01000001 01000111 01000101 01001110 01010100",
        answer: "AGENT",
        hint: "A=65=01000001, G=71=01000111, E=69=01000101, N=78=01001110, T=84=01010100.",
      },
    ],
    reward: "AGENT RESCUED! The binary transmissions led our teams directly to the captured agent. You are a true code-breaking hero!",
    badge: "🚁 Agent Rescuer",
    color: "from-blue-500 to-indigo-600",
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "beginner",
    title: "Beginner Decoder",
    desc: "Correctly decode your first cipher challenge",
    emoji: "🥉",
    color: "from-orange-400 to-amber-500",
  },
  {
    id: "expert",
    title: "Cipher Expert",
    desc: "Correctly decode 10 cipher challenges",
    emoji: "🏅",
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: "morse",
    title: "Morse Master",
    desc: "Successfully decode a Morse Code challenge",
    emoji: "📡",
    color: "from-green-500 to-teal-600",
  },
  {
    id: "binary",
    title: "Binary Genius",
    desc: "Successfully decode a Binary Code challenge",
    emoji: "💻",
    color: "from-slate-500 to-gray-600",
  },
  {
    id: "codebreaker",
    title: "Code Breaker",
    desc: "Complete all four Hard difficulty challenges",
    emoji: "🔓",
    color: "from-red-500 to-rose-600",
  },
  {
    id: "masterspy",
    title: "Master Spy",
    desc: "Complete all four Spy Missions",
    emoji: "🕵️",
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: "champion",
    title: "Cryptography Champion",
    desc: "Complete the Master Code Breaker final challenge",
    emoji: "🏆",
    color: "from-yellow-400 to-yellow-600",
  },
];

export function checkAchievements(stats: CBStats): string[] {
  const newlyUnlocked: string[] = [];
  const already = new Set(stats.unlockedAchievements);
  const hardIds = HARD_CHALLENGES.map((c) => c.id);

  const checks: { id: string; cond: boolean }[] = [
    { id: "beginner",    cond: stats.correctAnswers >= 1 },
    { id: "expert",      cond: stats.correctAnswers >= 10 },
    { id: "morse",       cond: stats.completedChallenges.includes("med-4") || stats.completedChallenges.includes("mission-3-step-0") },
    { id: "binary",      cond: stats.completedChallenges.includes("hard-1") || stats.completedChallenges.includes("hard-4") || stats.completedChallenges.includes("mission-4-step-0") },
    { id: "codebreaker", cond: hardIds.every((id) => stats.completedChallenges.includes(id)) },
    { id: "masterspy",   cond: stats.missionsCompleted >= 4 },
    { id: "champion",    cond: stats.masterCompleted },
  ];

  for (const { id, cond } of checks) {
    if (cond && !already.has(id)) newlyUnlocked.push(id);
  }
  return newlyUnlocked;
}

export const TIMER: Record<string, number> = { easy: 60, medium: 45, hard: 30 };
export const POINTS: Record<string, number> = { easy: 100, medium: 200, hard: 400 };
export const TIME_MULT: Record<string, number> = { easy: 2, medium: 3, hard: 5 };
