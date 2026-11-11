import React from 'react';
import { MonthCampaign, WeekNumber } from '../types';
import { calculatePercentage, formatBRL, WEEK_PRIZE_DEFAULTS } from '../data/initialData';
import { X, FileText, DollarSign, Gift, Trophy, CheckCircle2, Copy, Check } from 'lucide-react';

interface WeekReportModalProps {
  campaign: MonthCampaign;
  week: WeekNumber;
  isOpen: boolean;
  onClose: () => void;
}

export const WeekReportModal: React.FC<WeekReportModalProps> = ({
  campaign,
  week,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const weekInfo = WEEK_PRIZE_DEFAULTS[week];

  // 1. Total sum of all sales made in this week (no individual names)
  const totalSalesSum = campaign.sellers.reduce(
    (sum, s) => sum + s.weeks[week].current,
    0
  );

  // 2. Salespeople who hit 100%+ and won the prize
  const winners = campaign.sellers.filter((s) => {
    const pct = calculatePercentage(s.weeks[week].current, s.weeks[week].target);
    return pct >= 100;
  });

  // 3. Total paid in campaign rewards for this week
  const totalCampaignPrizesPaid = winners.length * weekInfo.prize;

  const handleCopyReport = () => {
    let reportText = `📊 *RELATÓRIO EXECUTIVO - SEMANA ${week}*\n\n`;
    reportText += `💰 *Total de Vendas da Equipe:* ${formatBRL(totalSalesSum)}\n`;
    reportText += `🎁 *Total Pago em Bônus/Prêmios:* R$ ${totalCampaignPrizesPaid}\n\n`;
    reportText += `🏆 *Vendedores Premiados (${winners.length}):*\n`;

    if (winners.length > 0) {
      winners.forEach((w) => {
        const pct = calculatePercentage(w.weeks[week].current, w.weeks[week].target);
        reportText += `  • ${w.name}: ${pct}% (Bônus R$ ${weekInfo.prize})\n`;
      });
    } else {
      reportText += `  • Nenhum vendedor atingiu a meta nesta semana ainda.\n`;
    }

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-outfit font-extrabold text-white">
                Relatório da Semana {week}
              </h3>
              <p className="text-xs text-slate-400">
                Resumo de Faturamento & Prêmios Pagos em Campanha
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

        {/* 2 Key Executive Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Total Sales Sum Card (No individual names) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total de Vendas da Equipe
            </span>
            <p className="text-2xl font-outfit font-black text-emerald-400 font-mono-num">
              {formatBRL(totalSalesSum)}
            </p>
            <span className="text-[10px] text-slate-500 block">
              Soma de todas as vendas na Semana {week}
            </span>
          </div>

          {/* Total Paid in Campaign Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-1">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              Total Pago em Campanha
            </span>
            <p className="text-2xl font-outfit font-black text-amber-300 font-mono-num">
              R$ {totalCampaignPrizesPaid}
            </p>
            <span className="text-[10px] text-slate-500 block">
              {winners.length} {winners.length === 1 ? 'prêmio' : 'prêmios'} de R$ {weekInfo.prize}
            </span>
          </div>
        </div>

        {/* List of Winners (Nomes de quem bateu a meta) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5 font-outfit">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Vendedores que Bateram a Meta ({winners.length})</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Prêmio R$ {weekInfo.prize} cada
            </span>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {winners.length > 0 ? (
              winners.map((winner) => {
                const pct = calculatePercentage(winner.weeks[week].current, winner.weeks[week].target);
                return (
                  <div
                    key={winner.id}
                    className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-extrabold text-white text-sm">{winner.name}</span>
                    </div>

                    <div className="flex items-center gap-3 font-mono-num">
                      <span className="font-extrabold text-emerald-400 bg-emerald-900/60 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
                        {pct}%
                      </span>
                      <span className="font-extrabold text-amber-300">
                        💰 R$ {weekInfo.prize}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                Nenhum vendedor atingiu 100% da meta nesta semana ainda.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleCopyReport}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Relatório Copiado!' : 'Copiar Relatório'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs sm:text-sm hover:bg-emerald-400 transition-all cursor-pointer"
          >
            Fechar Relatório
          </button>
        </div>
      </div>
    </div>
  );
};
