import { useState, useEffect } from "react";
import { CheckCircle, Lock, Lightbulb, ChevronRight, Star } from "lucide-react";
import { SPY_MISSIONS, getCBStats, saveCBStats, checkAchievements } from "../../utils/cbData";
import { showToast } from "../../utils/toast";

function Confetti({ active }: { active: boolean }) {
  if (!active) return null;
  const colors = ["#f59e0b", "#10b981", "#6366f1", "#ec4899", "#f43f5e", "#3b82f6", "#a855f7"];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: "-16px",
            width: `${7 + Math.random() * 7}px`,
            height: `${7 + Math.random() * 7}px`,
            background: colors[i % colors.length],
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animation: `cb-fall ${2 + Math.random() * 2}s ${Math.random() * 1.5}s linear forwards`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function SpyMissions() {
  const [activeMission, setActiveMission] = useState<number | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [showReward, setShowReward] = useState(false);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    const s = getCBStats();
    const done = new Set<string>();
    SPY_MISSIONS.forEach((m, i) => {
      if (m.steps.every((_, si) => s.completedChallenges.includes(`${m.id}-step-${si}`))) {
        done.add(m.id);
      }
    });
    setCompleted(done);
  }, []);

  const mission = activeMission !== null ? SPY_MISSIONS[activeMission] : null;
  const step = mission ? mission.steps[stepIdx] : null;

  const isUnlocked = (idx: number) => idx === 0 || completed.has(SPY_MISSIONS[idx - 1].id);

  const submit = () => {
    if (!answer.trim() || result !== null || !mission || !step) return;
    const correct = answer.trim().toUpperCase() === step.answer.toUpperCase();
    setResult(correct ? "correct" : "wrong");
    if (correct) {
      showToast("✅ Step decoded!", "success");
      const s = getCBStats();
      const key = `${mission.id}-step-${stepIdx}`;
      if (!s.completedChallenges.includes(key)) s.completedChallenges.push(key);
      s.correctAnswers += 1;
      s.totalScore += 150;

      if (stepIdx === mission.steps.length - 1) {
        if (!completed.has(mission.id)) {
          s.missionsCompleted += 1;
          setCompleted((c) => new Set([...c, mission.id]));
          const newAch = checkAchievements(s);
          for (const id of newAch) {
            s.unlockedAchievements.push(id);
          }
          setShowReward(true);
          setConfetti(true);
          setTimeout(() => setConfetti(false), 4000);
        }
      }
      saveCBStats(s);
    } else {
      showToast("❌ Wrong — check the hint!", "error");
    }
  };

  const nextStep = () => {
    if (stepIdx < (mission?.steps.length ?? 0) - 1) {
      setStepIdx((i) => i + 1);
      setAnswer("");
      setResult(null);
      setShowHint(false);
    }
  };

  const exitMission = () => {
    setActiveMission(null);
    setStepIdx(0);
    setAnswer("");
    setResult(null);
    setShowHint(false);
    setShowReward(false);
    const s = getCBStats();
    const done = new Set<string>();
    SPY_MISSIONS.forEach((m) => {
      if (m.steps.every((_, si) => s.completedChallenges.includes(`${m.id}-step-${si}`))) {
        done.add(m.id);
      }
    });
    setCompleted(done);
  };

  if (activeMission !== null && mission && !showReward) {
    return (
      <div className="animate-fade-in">
        <button onClick={exitMission} className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1">
          ← Back to Mission Center
        </button>

        <div className={`bg-gradient-to-r ${mission.color} rounded-2xl p-5 mb-5 text-white`}>
          <div className="text-xs font-bold uppercase tracking-wide opacity-80 mb-1">
            {mission.emoji} Mission {activeMission + 1} — Step {stepIdx + 1} of {mission.steps.length}
          </div>
          <h3 className="text-xl font-black mb-2">{mission.title}</h3>
          {stepIdx === 0 && <p className="text-sm text-white/80">{mission.story}</p>}
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 mb-4 shadow-sm">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1">{step!.cipher}</div>
          <div className="text-2xl font-black font-mono text-center bg-muted rounded-xl px-4 py-4 break-all my-3">
            {step!.encrypted}
          </div>

          {result === "correct" ? (
            <div className="bg-green-100 dark:bg-green-950/40 border border-green-300 dark:border-green-700 rounded-xl p-3 text-center mb-3">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <div className="font-black text-green-600 dark:text-green-400">Step Decoded! ✅</div>
              <div className="text-sm text-muted-foreground">Answer: <span className="font-mono font-bold text-foreground">{step!.answer}</span></div>
            </div>
          ) : result === "wrong" ? (
            <div className="bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-700 rounded-xl p-3 text-center mb-3">
              <div className="font-black text-red-500">❌ Try again!</div>
            </div>
          ) : null}

          {result !== "correct" && (
            <div className="flex gap-2">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Decode the message..."
                className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary uppercase"
              />
              <button onClick={submit}
                className="gradient-bg text-white font-bold px-5 py-3 rounded-xl hover:opacity-90 transition-all">
                Submit
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setShowHint(true); showToast("Hint revealed!", "info"); }} disabled={showHint}
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-semibold transition-all ${showHint ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400" : "bg-muted hover:bg-muted/70 text-muted-foreground"}`}>
            <Lightbulb className="w-4 h-4" /> {showHint ? "Hint shown" : "Show Hint"}
          </button>
          {result === "correct" && stepIdx < mission.steps.length - 1 && (
            <button onClick={nextStep}
              className="flex items-center gap-2 gradient-bg text-white font-bold px-5 py-2 rounded-xl hover:opacity-90 transition-all text-sm">
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {showHint && (
          <div className="mt-3 bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 animate-fade-in">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{step!.hint}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (showReward && mission) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <Confetti active={confetti} />
        <div className="text-7xl mb-4">{mission.badge.split(" ")[0]}</div>
        <h3 className="text-2xl font-black mb-2 text-primary">Mission Complete!</h3>
        <div className="text-lg font-bold mb-3">{mission.title}</div>
        <div className="bg-card border border-border rounded-2xl p-5 max-w-sm mx-auto mb-5 shadow-sm">
          <div className="text-sm text-muted-foreground leading-relaxed">{mission.reward}</div>
        </div>
        <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 font-bold px-4 py-2 rounded-full mb-5">
          <Star className="w-4 h-4" /> Badge Earned: {mission.badge}
        </div>
        <br />
        <button onClick={exitMission}
          className="gradient-bg text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all">
          Back to Mission Center
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl p-5 mb-6 text-white">
        <h3 className="text-xl font-black mb-1">🕵️ Spy Mission Center</h3>
        <p className="text-white/80 text-sm">Complete missions to unlock the next one. Each mission earns you a badge!</p>
        <div className="mt-2 text-xs text-white/60">{completed.size} / {SPY_MISSIONS.length} missions completed</div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {SPY_MISSIONS.map((m, i) => {
          const unlocked = isUnlocked(i);
          const done = completed.has(m.id);
          return (
            <div key={m.id}
              className={`rounded-2xl border shadow-sm overflow-hidden transition-all ${done ? "border-green-400 dark:border-green-600" : unlocked ? "border-border card-hover cursor-pointer" : "border-border opacity-50"}`}
              onClick={() => { if (unlocked && !done) { setActiveMission(i); setStepIdx(0); setAnswer(""); setResult(null); setShowHint(false); setShowReward(false); } }}>
              <div className={`bg-gradient-to-r ${m.color} p-4 text-white flex items-center justify-between`}>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide opacity-80">Mission {i + 1}</div>
                  <div className="font-black text-lg">{m.emoji} {m.title}</div>
                </div>
                {done ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : unlocked ? (
                  <ChevronRight className="w-6 h-6 text-white/80" />
                ) : (
                  <Lock className="w-6 h-6 text-white/60" />
                )}
              </div>
              <div className="p-4 bg-card">
                <p className="text-sm text-muted-foreground mb-2 leading-relaxed line-clamp-2">{m.story}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{m.steps.length} steps • {m.steps.map((s) => s.cipher.split(" ")[0]).join(", ")}</span>
                  {done && <span className="text-yellow-600 dark:text-yellow-400 font-bold">{m.badge}</span>}
                  {!done && !unlocked && <span className="text-muted-foreground italic">Complete previous mission first</span>}
                  {!done && unlocked && <span className="text-primary font-semibold">Ready to start →</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
