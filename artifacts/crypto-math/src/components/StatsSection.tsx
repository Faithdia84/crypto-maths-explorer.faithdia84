import { useState } from "react";
import { BarChart3, RefreshCw, Trash2 } from "lucide-react";
import { getStats, mostUsedCipher, totalEncryptions } from "../utils/stats";

export default function StatsSection() {
  const [stats, setStats] = useState(getStats);

  const refresh = () => setStats(getStats());

  const clearStats = () => {
    localStorage.removeItem("mmm_stats");
    setStats(getStats());
  };

  const total = totalEncryptions(stats);
  const topCipher = mostUsedCipher(stats);
  const bestQuiz = stats.quizScores.length ? Math.max(...stats.quizScores) : null;
  const bestChallenge = stats.challengeScores.length
    ? stats.challengeScores.reduce((a, b) => (a.score > b.score ? a : b))
    : null;
  const avgQuiz = stats.quizScores.length
    ? Math.round(stats.quizScores.reduce((a, b) => a + b, 0) / stats.quizScores.length * 10) / 10
    : null;

  const cipherOrder = Object.entries(stats.encryptions).sort((a, b) => b[1] - a[1]);

  return (
    <section id="stats" className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            Your Activity
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            Statistics <span className="gradient-text">Dashboard</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Track your encryption activity, quiz performance, and challenge scores — all stored privately in your browser.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Encryptions", value: total, icon: "🔒", color: "text-purple-600 dark:text-purple-400" },
            { label: "Total Decryptions", value: stats.decryptions, icon: "🔓", color: "text-blue-600 dark:text-blue-400" },
            { label: "Comparisons Run",   value: stats.comparisonsRun, icon: "📊", color: "text-cyan-600 dark:text-cyan-400" },
            { label: "Agent Missions",    value: stats.agentMissionsCompleted, icon: "🕵️", color: "text-green-600 dark:text-green-400" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-6 shadow-sm text-center card-hover">
              <div className="text-4xl mb-2">{s.icon}</div>
              <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Cipher Usage
            </h3>
            {cipherOrder.length === 0 ? (
              <div className="text-muted-foreground text-sm text-center py-8">
                No encryptions yet. Open the Cipher Lab to get started!
              </div>
            ) : (
              <div className="space-y-3">
                {cipherOrder.map(([cipher, count]) => (
                  <div key={cipher}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{cipher}</span>
                      <span className="text-muted-foreground">{count}×</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-2 gradient-bg rounded-full transition-all duration-500"
                        style={{ width: `${Math.round((count / (cipherOrder[0][1])) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="text-xs text-muted-foreground pt-2">
                  Most used: <strong className="text-primary">{topCipher}</strong>
                </div>
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-4">🏆 Performance</h3>
            <div className="space-y-4">
              {[
                { label: "Best Quiz Score",      value: bestQuiz !== null ? `${bestQuiz}/10` : "No quiz taken yet", icon: "🧠" },
                { label: "Average Quiz Score",   value: avgQuiz !== null ? `${avgQuiz}/10` : "—", icon: "📈" },
                { label: "Best Challenge Score", value: bestChallenge ? `${bestChallenge.score} pts (${bestChallenge.difficulty})` : "No challenge played yet", icon: "🎮" },
                { label: "Quiz Attempts",        value: stats.quizScores.length, icon: "🔄" },
              ].map((p) => (
                <div key={p.label} className="flex items-center gap-3 bg-muted rounded-xl p-3">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <div className="text-xs text-muted-foreground">{p.label}</div>
                    <div className="font-bold text-sm">{p.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {stats.challengeScores.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="font-bold text-lg mb-4">🎮 Challenge Score History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-muted-foreground font-semibold">#</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Score</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Difficulty</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.challengeScores.slice(0, 10).map((s, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2 px-3 text-muted-foreground">{i + 1}</td>
                      <td className="py-2 px-3 font-bold text-primary">{s.score} pts</td>
                      <td className="py-2 px-3">{s.difficulty}</td>
                      <td className="py-2 px-3 text-muted-foreground">{s.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button onClick={refresh}
            className="flex items-center gap-2 bg-muted text-foreground font-bold px-6 py-3 rounded-xl hover:bg-muted/70 transition-all">
            <RefreshCw className="w-4 h-4" /> Refresh Stats
          </button>
          <button onClick={clearStats}
            className="flex items-center gap-2 bg-muted text-muted-foreground hover:text-destructive font-bold px-6 py-3 rounded-xl hover:bg-muted/70 transition-all">
            <Trash2 className="w-4 h-4" /> Clear All Stats
          </button>
        </div>
      </div>
    </section>
  );
}
