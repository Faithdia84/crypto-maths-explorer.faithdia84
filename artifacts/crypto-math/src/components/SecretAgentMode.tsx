import { useState } from "react";
import { Shield, CheckCircle, Lock, Star, Trophy, ChevronRight } from "lucide-react";
import { recordAgentMission } from "../utils/stats";
import { showToast } from "../utils/toast";

interface Mission {
  id: number;
  codename: string;
  difficulty: string;
  story: string;
  cipherType: string;
  cipherHint: string;
  encrypted: string;
  answer: string;
  badge: string;
  badgeName: string;
}

const MISSIONS: Mission[] = [
  {
    id: 1,
    codename: "Operation Alpha",
    difficulty: "Rookie",
    story: "Agent! An enemy spy sent a coded message to his contact. We intercepted it. Decode it to find out what he said. We believe it's a Caesar Cipher with a shift of 3.",
    cipherType: "Caesar Cipher (shift 3)",
    cipherHint: "Shift each letter back by 3. K→H, H→E, O→L, O→L, R→O",
    encrypted: "KHOOR DJHQW",
    answer: "HELLO AGENT",
    badge: "🥉",
    badgeName: "Rookie Agent",
  },
  {
    id: 2,
    codename: "Operation Bravo",
    difficulty: "Field Agent",
    story: "Our satellite intercepted a transmission of numbers. Intelligence believes it is a Number Cipher (A=1, B=2 … Z=26). Decode it to reveal the secret location!",
    cipherType: "Number Cipher (A=1, B=2…)",
    cipherHint: "1=A, 2=B, 3=C … 26=Z. Each number is a letter.",
    encrypted: "13 9 19 19 9 15 14",
    answer: "MISSION",
    badge: "🥈",
    badgeName: "Field Agent",
  },
  {
    id: 3,
    codename: "Operation Charlie",
    difficulty: "Senior Agent",
    story: "A distress signal was picked up. It's in Morse Code. Decode it immediately — lives are at stake! Remember: dot (.) and dash (-) combinations spell letters.",
    cipherType: "Morse Code",
    cipherHint: "... = S, . = E, -.-. = C, .-. = R, . = E, - = T",
    encrypted: "... . -.-. .-. . -",
    answer: "SECRET",
    badge: "🥇",
    badgeName: "Senior Agent",
  },
  {
    id: 4,
    codename: "Operation Delta",
    difficulty: "Master Spy",
    story: "Our best cryptanalysts are stumped. This message is in Binary — the language of computers. Each group of 8 digits represents one letter. Are you the spy who can crack it?",
    cipherType: "Binary Code (ASCII)",
    cipherHint: "01010011=S, 01010000=P, 01011001=Y. Each 8-bit group = one letter.",
    encrypted: "01010011 01010000 01011001",
    answer: "SPY",
    badge: "🏆",
    badgeName: "Master Spy",
  },
];

const BADGE_COLORS = [
  "from-orange-400 to-amber-500",
  "from-slate-400 to-gray-500",
  "from-yellow-400 to-yellow-500",
  "from-purple-500 to-violet-600",
];

export default function SecretAgentMode() {
  const [currentMission, setCurrentMission] = useState<number | null>(null);
  const [userInput, setUserInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [missionStatus, setMissionStatus] = useState<"playing" | "success" | "fail">("playing");
  const [completedMissions, setCompletedMissions] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem("mmm_agent_missions") ?? "[]"); }
    catch { return []; }
  });

  const isCompleted = (id: number) => completedMissions.includes(id);
  const isLocked = (id: number) => id > 1 && !completedMissions.includes(id - 1);

  const startMission = (m: Mission) => {
    if (isLocked(m.id)) { showToast("Complete the previous mission first!", "error"); return; }
    setCurrentMission(m.id);
    setUserInput(""); setShowHint(false); setMissionStatus("playing");
  };

  const submitAnswer = () => {
    const mission = MISSIONS.find((m) => m.id === currentMission)!;
    if (userInput.trim().toUpperCase() === mission.answer.toUpperCase()) {
      setMissionStatus("success");
      if (!completedMissions.includes(mission.id)) {
        const updated = [...completedMissions, mission.id];
        setCompletedMissions(updated);
        localStorage.setItem("mmm_agent_missions", JSON.stringify(updated));
        recordAgentMission();
        showToast(`Mission complete! Badge earned: ${mission.badgeName}`, "success");
      }
    } else {
      setMissionStatus("fail");
      showToast("That's not right, Agent. Try again!", "error");
    }
  };

  const exitMission = () => { setCurrentMission(null); setMissionStatus("playing"); };

  const activeMission = MISSIONS.find((m) => m.id === currentMission);

  if (currentMission && activeMission) {
    return (
      <section id="agent" className="py-20 px-4" style={{
        background: "linear-gradient(135deg, #0a0a0f, #0d1b2a, #1a1a2e)"
      }}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <button onClick={exitMission} className="text-green-400 hover:text-green-300 text-sm font-mono flex items-center gap-1">
              ← EXIT MISSION
            </button>
            <div className="h-px flex-1 bg-green-900" />
            <span className="text-green-400 font-mono text-xs">[CLASSIFIED]</span>
          </div>

          <div className="border border-green-900 rounded-2xl p-6 font-mono">
            <div className="flex items-center gap-2 mb-1 text-green-500 text-xs uppercase tracking-widest">
              <Shield className="w-3 h-3" /> {activeMission.difficulty} Level
            </div>
            <h3 className="text-2xl font-black text-green-400 mb-4">
              {activeMission.codename}
            </h3>

            <div className="bg-green-950/50 border border-green-900 rounded-xl p-4 mb-6 text-green-300 text-sm leading-relaxed">
              🗂️ <strong className="text-green-400">BRIEFING:</strong><br/>
              {activeMission.story}
            </div>

            <div className="mb-4">
              <div className="text-green-600 text-xs mb-1 uppercase tracking-widest">Cipher Type</div>
              <div className="text-green-300 text-sm">{activeMission.cipherType}</div>
            </div>

            <div className="mb-6">
              <div className="text-green-600 text-xs mb-2 uppercase tracking-widest">Intercepted Message</div>
              <div className="bg-black border border-green-800 rounded-xl px-4 py-4 text-green-400 font-mono text-xl tracking-widest text-center">
                {activeMission.encrypted}
              </div>
            </div>

            {missionStatus === "playing" && (
              <>
                <div className="mb-4">
                  <div className="text-green-600 text-xs mb-2 uppercase tracking-widest">Your Decoded Answer</div>
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
                    placeholder="TYPE YOUR ANSWER..."
                    className="w-full bg-black border-2 border-green-800 focus:border-green-500 rounded-xl px-4 py-3 text-green-400 font-mono text-center text-lg focus:outline-none uppercase"
                  />
                </div>
                <div className="flex gap-3 mb-3">
                  <button onClick={submitAnswer} disabled={!userInput.trim()}
                    className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-black font-black py-3 rounded-xl transition-all font-mono tracking-wider">
                    ▶ SUBMIT ANSWER
                  </button>
                </div>
                <button onClick={() => setShowHint(!showHint)}
                  className="w-full text-green-700 hover:text-green-500 text-xs font-mono py-2 transition-colors">
                  {showHint ? "▲ HIDE HINT" : "▼ REQUEST HINT (costs 0 points)"}
                </button>
                {showHint && (
                  <div className="mt-2 bg-yellow-950/40 border border-yellow-900 rounded-xl p-3 text-yellow-400 text-xs font-mono animate-fade-in">
                    💡 INTEL: {activeMission.cipherHint}
                  </div>
                )}
              </>
            )}

            {missionStatus === "success" && (
              <div className="text-center animate-fade-in">
                <div className="text-5xl mb-3">🎉</div>
                <div className="text-green-400 font-black text-2xl font-mono mb-2">MISSION COMPLETE</div>
                <div className="text-green-300 text-sm mb-2">Correct answer: <strong>{activeMission.answer}</strong></div>
                <div className="inline-flex items-center gap-2 bg-green-900/50 border border-green-700 px-4 py-2 rounded-full text-green-300 text-sm mb-6">
                  {activeMission.badge} Badge Earned: <strong>{activeMission.badgeName}</strong>
                </div>
                <br/>
                <button onClick={exitMission}
                  className="bg-green-600 hover:bg-green-500 text-black font-black px-8 py-3 rounded-xl font-mono">
                  ← RETURN TO HQ
                </button>
              </div>
            )}

            {missionStatus === "fail" && (
              <div className="animate-fade-in">
                <div className="bg-red-950/40 border border-red-900 rounded-xl p-3 text-red-400 text-sm font-mono mb-3 text-center">
                  ❌ INCORRECT — Mission continues. Check the hint and try again!
                </div>
                <button onClick={() => setMissionStatus("playing")}
                  className="w-full bg-red-900 hover:bg-red-800 text-red-200 font-bold py-3 rounded-xl font-mono">
                  ↩ TRY AGAIN
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="agent" className="py-20 px-4" style={{
      background: "linear-gradient(135deg, #0a0a0f, #0d1b2a, #1a1a2e)"
    }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-green-900/60 text-green-400 text-sm font-bold px-4 py-1.5 rounded-full mb-4 border border-green-800 font-mono">
            🔒 CLASSIFIED
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4 text-white">
            Secret <span className="text-green-400">Agent</span> Mode
          </h2>
          <p className="text-green-700 text-lg max-w-2xl mx-auto font-mono">
            Welcome, Agent. Your mission, should you choose to accept it, is to crack encrypted messages intercepted from enemy spies.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {MISSIONS.map((m, i) => {
            const completed = isCompleted(m.id);
            const locked = isLocked(m.id);
            return (
              <button key={m.id} onClick={() => startMission(m)}
                disabled={locked}
                className={`relative border rounded-2xl p-6 text-left transition-all font-mono ${
                  completed
                    ? "border-green-700 bg-green-950/40 hover:border-green-500"
                    : locked
                    ? "border-gray-800 bg-gray-950/40 opacity-50 cursor-not-allowed"
                    : "border-green-900 bg-black/40 hover:border-green-600 hover:scale-[1.02]"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className={`text-xs uppercase tracking-widest mb-1 ${
                      completed ? "text-green-500" : locked ? "text-gray-600" : "text-green-700"
                    }`}>
                      {locked ? "🔒 LOCKED" : completed ? "✅ COMPLETED" : "▶ AVAILABLE"}
                    </div>
                    <div className="text-white font-black text-lg">{m.codename}</div>
                  </div>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${BADGE_COLORS[i]} flex items-center justify-center text-xl ${locked ? "opacity-30" : ""}`}>
                    {m.badge}
                  </div>
                </div>
                <div className={`text-xs mb-2 ${completed ? "text-green-600" : locked ? "text-gray-700" : "text-green-800"}`}>
                  Difficulty: {m.difficulty}
                </div>
                <div className={`text-sm ${completed ? "text-green-400" : locked ? "text-gray-600" : "text-green-700"}`}>
                  {m.cipherType}
                </div>
                {!locked && !completed && (
                  <div className="flex items-center gap-1 text-green-600 text-xs mt-3">
                    Click to begin <ChevronRight className="w-3 h-3" />
                  </div>
                )}
                {completed && (
                  <div className="flex items-center gap-1 text-green-500 text-xs mt-3">
                    <CheckCircle className="w-3 h-3" /> Badge Earned: {m.badgeName}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="border border-green-900 rounded-2xl p-6">
          <h3 className="text-white font-black text-xl mb-4 font-mono flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" /> Agent Badges
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MISSIONS.map((m, i) => {
              const earned = isCompleted(m.id);
              return (
                <div key={m.id} className={`rounded-xl p-4 text-center border transition-all ${
                  earned ? "border-green-700 bg-green-950/50" : "border-gray-800 bg-gray-950/30 opacity-40"
                }`}>
                  <div className="text-3xl mb-2">{m.badge}</div>
                  <div className={`text-xs font-bold ${earned ? "text-green-400" : "text-gray-600"} font-mono`}>
                    {m.badgeName}
                  </div>
                  {earned && <Star className="w-3 h-3 text-yellow-500 mx-auto mt-1" />}
                </div>
              );
            })}
          </div>
          <div className="text-center mt-4 text-green-800 text-xs font-mono">
            {completedMissions.length}/4 missions completed
          </div>
        </div>
      </div>
    </section>
  );
}
