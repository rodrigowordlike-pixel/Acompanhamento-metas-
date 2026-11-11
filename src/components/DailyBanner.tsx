import React from 'react';
import { getTodayPhrase } from '../utils/dailyPhrases';

export const DailyBanner: React.FC = () => {
  const today = getTodayPhrase();

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-green-950 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-emerald-950/60">
      {/* Background glowing aura */}
      <div className="absolute -top-16 -left-16 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/30 shrink-0">
          {today.emoji}
        </div>
        <div>
          <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider font-outfit block mb-1">
            {today.tagline}
          </span>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-outfit font-black text-white tracking-tight leading-snug">
            "{today.phrase}"
          </h2>
        </div>
      </div>
    </div>
  );
};
