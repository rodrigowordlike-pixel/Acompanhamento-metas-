import React, { useState } from 'react';
import { Sparkles, RefreshCw, Flame } from 'lucide-react';

interface MotivationBarProps {
  phrase: string;
  onUpdatePhrase: (newPhrase: string) => void;
  teamAverage: number;
}

export const MotivationBar: React.FC<MotivationBarProps> = ({
  phrase,
  onUpdatePhrase,
  teamAverage,
}) => {
  const [loading, setLoading] = useState(false);

  const fetchAIMotivation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/motivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'banner_phrase',
          teamStats: { averagePercentage: teamAverage },
        }),
      });
      const data = await res.json();
      if (data.motivationalMessage) {
        onUpdatePhrase(data.motivationalMessage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-green-950 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-xl shadow-emerald-950/50">
      {/* Background neon shimmer glow effect */}
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 text-emerald-400 animate-pulse">
            <Flame className="w-5 h-5 fill-emerald-400" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1 justify-center sm:justify-start">
              <span>MOTIVAÇÃO DA SEMANA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </span>
            <p className="text-sm sm:text-base lg:text-lg font-outfit font-extrabold text-white tracking-wide mt-0.5">
              "{phrase}"
            </p>
          </div>
        </div>

        <button
          onClick={fetchAIMotivation}
          disabled={loading}
          className="px-3.5 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <Sparkles className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Gerando AI...' : 'Nova Frase AI'}</span>
          <RefreshCw className="w-3 h-3 opacity-60 ml-0.5" />
        </button>
      </div>
    </div>
  );
};
