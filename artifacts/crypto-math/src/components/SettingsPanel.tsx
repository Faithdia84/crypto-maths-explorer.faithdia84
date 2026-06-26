import { useState } from "react";
import { Settings, X, RotateCcw, User, Palette } from "lucide-react";
import { getAgentProfile, saveAgentProfile, AVATARS } from "../utils/xpSystem";
import { showToast } from "../utils/toast";

interface SettingsPanelProps {
  dark: boolean;
  setDark: (v: boolean) => void;
}

export default function SettingsPanel({ dark, setDark }: SettingsPanelProps) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState(getAgentProfile);
  const [name, setName] = useState(profile.name);

  const saveName = () => {
    const updated = { ...profile, name: name.trim() || "Secret Agent" };
    setProfile(updated);
    saveAgentProfile(updated);
    showToast("Agent name saved!", "success");
  };

  const selectAvatar = (a: string) => {
    const updated = { ...profile, avatar: a };
    setProfile(updated);
    saveAgentProfile(updated);
    showToast("Avatar updated!", "success");
  };

  const resetAll = () => {
    if (!window.confirm("This will clear ALL your progress — XP, stats, missions, achievements. Are you sure?")) return;
    ["mmm_stats","mmm_cb_stats","mmm_cb_leaderboard","mmm_agent_missions","mmm_bonus_xp","darkMode"].forEach(
      (k) => localStorage.removeItem(k)
    );
    showToast("All progress reset.", "info");
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <>
      <button
        onClick={() => setOpen((s) => !s)}
        className="fixed bottom-6 right-16 z-40 bg-card border border-border shadow-lg rounded-full p-3 hover:bg-muted transition-all hover:scale-110 active:scale-95"
        title="Settings"
      >
        <Settings className="w-5 h-5 text-muted-foreground" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-card border border-border rounded-3xl shadow-2xl p-6 w-full max-w-sm animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 font-black text-lg">
                <Settings className="w-5 h-5 text-primary" /> Settings
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">
                  <User className="w-4 h-4" /> Agent Profile
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={saveName}
                  onKeyDown={(e) => e.key === "Enter" && saveName()}
                  placeholder="Agent name"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary mb-2"
                />
                <div className="flex flex-wrap gap-1.5">
                  {AVATARS.map((a) => (
                    <button key={a} onClick={() => selectAvatar(a)}
                      className={`text-xl rounded-xl p-1.5 transition-all hover:scale-110 ${profile.avatar === a ? "bg-primary/20 ring-2 ring-primary" : "bg-muted hover:bg-muted/70"}`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">
                  <Palette className="w-4 h-4" /> Appearance
                </div>
                <button onClick={() => setDark(!dark)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${dark ? "border-primary bg-primary/10" : "border-border bg-muted"}`}>
                  <span className="text-sm font-semibold">{dark ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
                  <div className={`w-10 h-5 rounded-full transition-all relative ${dark ? "bg-primary" : "bg-muted-foreground/30"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${dark ? "left-5" : "left-0.5"}`} />
                  </div>
                </button>
              </div>

              <div className="border-t border-border pt-4">
                <button onClick={resetAll}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold text-destructive bg-destructive/10 hover:bg-destructive/20 px-4 py-3 rounded-xl transition-all border border-destructive/30">
                  <RotateCcw className="w-4 h-4" /> Reset All Progress
                </button>
                <p className="text-xs text-muted-foreground text-center mt-1">This cannot be undone</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
