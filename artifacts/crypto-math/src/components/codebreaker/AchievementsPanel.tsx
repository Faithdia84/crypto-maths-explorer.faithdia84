import { useState, useEffect } from "react";
import { Trophy, Plus, Save, Trash2 } from "lucide-react";
import { ACHIEVEMENTS, getCBStats, getLeaderboard, addLeaderboardEntry } from "../../utils/cbData";
import { showToast } from "../../utils/toast";

export default function AchievementsPanel() {
  const [stats, setStats] = useState(getCBStats());
  const [lb, setLb] = useState(getLeaderboard());
  const [name, setName] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setStats(getCBStats());
    setLb(getLeaderboard());
  }, []);

  const saveScore = () => {
    if (!name.trim()) { showToast("Enter your name first!", "error"); return; }
    addLeaderboardEntry({
      name: name.trim(),
      score: stats.totalScore,
      missions: stats.missionsCompleted,
      date: new Date().toLocaleDateString("en-GB"),
    });
    setLb(getLeaderboard());
    setAdded(true);
    showToast(`🏆 Score saved for ${name.trim()}!`, "success");
  };

  const clearLb = () => {
    localStorage.removeItem("mmm_cb_leaderboard");
    setLb([]);
    showToast("Leaderboard cleared.", "info");
  };

  const unlocked = new Set(stats.unlockedAchievements);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Score",    value: stats.totalScore, icon: "🏆", color: "text-yellow-500" },
          { label: "Correct",         value: stats.correctAnswers, icon: "✅", color: "text-green-500" },
          { label: "Missions Done",   value: stats.missionsCompleted, icon: "🕵️", color: "text-purple-500" },
          { label: "Fastest (s)",     value: stats.fastestTime !== null ? stats.fastestTime : "—", icon: "⚡", color: "text-blue-500" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center shadow-sm">
            <div className="text-3xl mb-1">{s.icon}</div>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-black text-lg mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" /> Trophy Cabinet
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {ACHIEVEMENTS.map((a) => {
            const earned = unlocked.has(a.id);
            return (
              <div key={a.id}
                className={`rounded-2xl border p-4 text-center transition-all ${earned ? "border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-950/30" : "border-border bg-card opacity-50 grayscale"}`}>
                <div className={`text-4xl mb-2 ${!earned ? "filter grayscale" : ""}`}>{a.emoji}</div>
                <div className={`text-sm font-black mb-1 ${earned ? "text-foreground" : "text-muted-foreground"}`}>{a.title}</div>
                <div className="text-xs text-muted-foreground leading-tight">{a.desc}</div>
                {earned && <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 font-bold">✅ Earned!</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-black text-lg mb-3 flex items-center gap-2">
          🏅 Leaderboard
        </h3>

        {!added && (
          <div className="bg-card border border-border rounded-2xl p-4 mb-4 flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="flex-1 bg-muted border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button onClick={saveScore}
              className="flex items-center gap-2 gradient-bg text-white font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-all text-sm">
              <Save className="w-4 h-4" /> Save Score
            </button>
          </div>
        )}

        {lb.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">📋</div>
            <div className="text-sm">No scores saved yet — complete challenges and save your score!</div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left font-bold text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-right font-bold text-muted-foreground">Score</th>
                  <th className="px-4 py-3 text-right font-bold text-muted-foreground hidden sm:table-cell">Missions</th>
                  <th className="px-4 py-3 text-right font-bold text-muted-foreground hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {lb.map((e, i) => (
                  <tr key={i} className={`border-b border-border last:border-0 ${i === 0 ? "bg-yellow-50 dark:bg-yellow-950/20" : ""}`}>
                    <td className="px-4 py-3 font-black">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                    </td>
                    <td className="px-4 py-3 font-semibold">{e.name}</td>
                    <td className="px-4 py-3 text-right font-black text-primary">{e.score}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell">{e.missions}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell">{e.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {lb.length > 0 && (
          <button onClick={clearLb}
            className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 className="w-3 h-3" /> Clear leaderboard
          </button>
        )}
      </div>
    </div>
  );
}
