import { useState, useEffect, useCallback } from "react";
import { Timer, RotateCcw, Trophy } from "lucide-react";
import { addBonusXP } from "../utils/xpSystem";
import { showToast } from "../utils/toast";

interface Card {
  id: number;
  pairId: number;
  content: string;
  type: "letter" | "code";
  flipped: boolean;
  matched: boolean;
}

const PAIRS: { letter: string; code: string; label: string }[] = [
  { letter: "A", code: ".-",    label: "Morse" },
  { letter: "B", code: "-...", label: "Morse" },
  { letter: "C", code: "1",    label: "Number" },
  { letter: "D", code: "4",    label: "Number" },
  { letter: "E", code: "01000101", label: "Binary" },
  { letter: "F", code: "KHOOR".slice(0,1) === "K" ? "ILEX"[0] : "I", label: "Caesar" },
  { letter: "H", code: "....", label: "Morse" },
  { letter: "S", code: "...",  label: "Morse" },
];

const FULL_PAIRS: { letter: string; code: string }[] = [
  { letter: "A", code: ".-" },
  { letter: "B", code: "-..." },
  { letter: "C", code: "3" },
  { letter: "D", code: "4" },
  { letter: "E", code: "01000101" },
  { letter: "H", code: "...." },
  { letter: "S", code: "..." },
  { letter: "T", code: "-" },
];

function buildCards(): Card[] {
  const cards: Card[] = [];
  FULL_PAIRS.forEach((p, i) => {
    cards.push({ id: i * 2,     pairId: i, content: p.letter, type: "letter", flipped: false, matched: false });
    cards.push({ id: i * 2 + 1, pairId: i, content: p.code,   type: "code",   flipped: false, matched: false });
  });
  return cards.sort(() => Math.random() - 0.5);
}

const PAIR_HINTS: Record<string, string> = {
  "A": "A = .- in Morse Code",
  "B": "B = -... in Morse Code",
  "C": "C is the 3rd letter, so Number Cipher = 3",
  "D": "D is the 4th letter, so Number Cipher = 4",
  "E": "E in ASCII = 69 = 01000101 in binary",
  "H": "H = .... in Morse Code",
  "S": "S = ... in Morse Code",
  "T": "T = - in Morse Code",
};

export default function MemoryMatch() {
  const [cards, setCards] = useState<Card[]>(buildCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);

  useEffect(() => {
    if (!running || won) return;
    const iv = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(iv);
  }, [running, won]);

  const flip = (id: number) => {
    if (selected.length === 2) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (!running) setRunning(true);

    const newSelected = [...selected, id];
    setCards((cs) => cs.map((c) => c.id === id ? { ...c, flipped: true } : c));
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = newSelected.map((sid) => cards.find((c) => c.id === sid)!);
      if (a.pairId === b.pairId) {
        setTimeout(() => {
          setCards((cs) => cs.map((c) => newSelected.includes(c.id) ? { ...c, matched: true } : c));
          setSelected([]);
          const hint = PAIR_HINTS[a.type === "letter" ? a.content : b.content];
          showToast(`✅ Matched! ${hint}`, "success");
          setCards((cs) => {
            if (cs.every((c) => c.matched || newSelected.includes(c.id))) {
              setWon(true);
              setRunning(false);
            }
            return cs;
          });
        }, 500);
      } else {
        setTimeout(() => {
          setCards((cs) => cs.map((c) => newSelected.includes(c.id) ? { ...c, flipped: false } : c));
          setSelected([]);
        }, 900);
      }
    }
  };

  useEffect(() => {
    if (won && !xpAwarded) {
      const bonus = Math.max(0, 500 - moves * 10 - time * 2);
      const xp = 50 + bonus;
      addBonusXP(xp);
      setXpAwarded(true);
      showToast(`🏆 Won in ${moves} moves! +${xp} XP`, "success");
    }
  }, [won]);

  const restart = useCallback(() => {
    setCards(buildCards());
    setSelected([]);
    setMoves(0);
    setTime(0);
    setRunning(false);
    setWon(false);
    setXpAwarded(false);
  }, []);

  const matched = cards.filter((c) => c.matched).length / 2;

  if (won) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="text-7xl mb-4">🎉</div>
        <h3 className="text-3xl font-black mb-2 gradient-text">You matched them all!</h3>
        <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto my-6">
          <div className="bg-purple-100 dark:bg-purple-900/40 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-primary">{moves}</div>
            <div className="text-xs text-muted-foreground">Moves</div>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/40 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-blue-500">{time}s</div>
            <div className="text-xs text-muted-foreground">Time</div>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900/40 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-yellow-500">+XP</div>
            <div className="text-xs text-muted-foreground">Earned</div>
          </div>
        </div>
        <button onClick={restart}
          className="flex items-center gap-2 gradient-bg text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all mx-auto">
          <RotateCcw className="w-4 h-4" /> Play Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-5 mb-5 text-white">
        <h3 className="text-xl font-black mb-1">🃏 Memory Match</h3>
        <p className="text-white/80 text-sm">Match each letter with its cipher equivalent. Learn Morse Code, Number Cipher, and Binary through play!</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 font-bold"><Timer className="w-4 h-4" /> {time}s</span>
          <span className="text-muted-foreground">Moves: <strong>{moves}</strong></span>
          <span className="text-muted-foreground">Matched: <strong className="text-green-500">{matched}/8</strong></span>
        </div>
        <button onClick={restart} className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <div className="w-full bg-muted rounded-full h-2 mb-5">
        <div className="h-2 gradient-bg rounded-full transition-all duration-500" style={{ width: `${(matched / 8) * 100}%` }} />
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4">
        {cards.map((card) => (
          <button key={card.id} onClick={() => flip(card.id)}
            className={`aspect-square rounded-2xl text-sm sm:text-base font-black transition-all duration-300 border-2 flex items-center justify-center p-1 ${
              card.matched
                ? "bg-green-100 dark:bg-green-950/40 border-green-400 text-green-700 dark:text-green-300 cursor-default"
                : card.flipped
                ? card.type === "letter"
                  ? "bg-gradient-to-br from-purple-500 to-indigo-600 border-transparent text-white shadow-lg"
                  : "bg-gradient-to-br from-orange-500 to-amber-600 border-transparent text-white shadow-lg"
                : "bg-muted border-border hover:bg-muted/70 hover:scale-105 active:scale-95 cursor-pointer"
            }`}>
            {card.flipped || card.matched ? (
              <span className={`${card.type === "code" ? "font-mono text-xs sm:text-sm break-all text-center" : "text-xl sm:text-2xl"}`}>
                {card.content}
              </span>
            ) : (
              <span className="text-2xl">🔒</span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-muted rounded-2xl p-4 text-xs text-muted-foreground">
        <strong className="text-foreground">How to play:</strong> Click any card to flip it, then find its matching pair.
        Purple = letters, Orange = cipher codes. Match all 8 pairs to win XP!
        Pairs: A↔.-, B↔-..., H↔...., S↔..., T↔- (Morse), E↔01000101 (Binary), C↔3, D↔4 (Number Cipher).
      </div>
    </div>
  );
}
