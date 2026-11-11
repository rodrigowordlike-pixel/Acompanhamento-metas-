import React, { useState } from 'react';
import { MonthCampaign, WeekNumber } from '../types';
import { calculatePercentage, WEEK_PRIZE_DEFAULTS } from '../data/initialData';
import { X, Copy, Check, Sparkles, MessageSquare } from 'lucide-react';

interface WhatsAppShareModalProps {
  campaign: MonthCampaign;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  campaign,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [customText, setCustomText] = useState('');

  if (!isOpen) return null;

  const activeWeek = campaign.activeWeek;
  const weekInfo = WEEK_PRIZE_DEFAULTS[activeWeek];

  const sortedSellers = [...campaign.sellers].sort((a, b) => {
    return calculatePercentage(b.weeks[activeWeek].current, b.weeks[activeWeek].target) -
      calculatePercentage(a.weeks[activeWeek].current, a.weeks[activeWeek].target);
  });

  const totalTarget = campaign.sellers.reduce((acc, s) => acc + s.weeks[activeWeek].target, 0);
  const totalCurrent = campaign.sellers.reduce((acc, s) => acc + s.weeks[activeWeek].current, 0);
  const teamPct = calculatePercentage(totalCurrent, totalTarget);

  const generateDefaultSummary = () => {
    let msg = `🔥 *META VENDAS - SEMANA ${activeWeek} (PRÊMIO R$ ${weekInfo.prize})* 🔥\n`;
    msg += `🚀 *Média da Equipe:* ${teamPct}%\n\n`;
    msg += `🏆 *RANKING DA SEMANA (%):*\n`;

    sortedSellers.forEach((s, idx) => {
      const pct = calculatePercentage(s.weeks[activeWeek].current, s.weeks[activeWeek].target);
      const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '⚡';
      const flag = pct >= 100 ? ` 💰 PRÊMIO R$${weekInfo.prize} DESBLOQUEADO!` : pct >= 85 ? ' 🔥 Quase no bônus!' : '';
      msg += `${medal} *${s.name}:* ${pct}%${flag}\n`;
    });

    msg += `\n💪 *"${campaign.bannerPhrase}"*\n`;
    msg += `👉 Bora buscar esse bônus! Cada % nos aproxima do prêmio! 🚀`;
    return msg;
  };

  const displayText = customText || generateDefaultSummary();

  const handleCopy = () => {
    navigator.clipboard.writeText(displayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleGenerateAI = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/motivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'whatsapp_summary',
          teamStats: {
            weekNumber: activeWeek,
            prizeAmount: weekInfo.prize,
            averagePercentage: teamPct,
            leaderName: sortedSellers[0]?.name,
            leaderPercentage: calculatePercentage(sortedSellers[0]?.weeks[activeWeek].current, sortedSellers[0]?.weeks[activeWeek].target),
            sellers: sortedSellers.map((s) => ({
              name: s.name,
              percentage: calculatePercentage(s.weeks[activeWeek].current, s.weeks[activeWeek].target),
            })),
          },
        }),
      });
      const data = await res.json();
      if (data.motivationalMessage) {
        setCustomText(data.motivationalMessage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-outfit font-extrabold text-white">
                Resumo WhatsApp · Semana {activeWeek}
              </h3>
              <p className="text-xs text-slate-400">
                Apenas porcentagens (%) e prêmios da Semana {activeWeek} (R$ {weekInfo.prize})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <textarea
            readOnly
            value={displayText}
            rows={10}
            className="w-full p-4 rounded-2xl bg-slate-950 border border-emerald-900/50 text-emerald-300 font-mono text-xs focus:outline-none leading-relaxed select-all"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleGenerateAI}
            disabled={loadingAI}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 text-emerald-400 ${loadingAI ? 'animate-spin' : ''}`} />
            <span>{loadingAI ? 'Gerando Texto AI...' : 'Reescrever com AI'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 text-slate-950 font-black text-xs sm:text-sm hover:from-emerald-300 hover:to-green-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
            <span>{copied ? 'Copiado para o WhatsApp!' : 'Copiar Texto'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
