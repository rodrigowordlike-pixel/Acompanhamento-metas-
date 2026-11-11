import React, { useState } from 'react';
import { MonthCampaign, Seller, WeekNumber } from '../types';
import { calculatePercentage, formatBRL, WEEK_PRIZE_DEFAULTS } from '../data/initialData';
import { UserPlus, RotateCcw, Trash2, ShieldCheck, FileText } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { WeekReportModal } from './WeekReportModal';

interface AdminScreenProps {
  campaign: MonthCampaign;
  onUpdateSellerWeek: (sellerId: string, week: WeekNumber, target: number, current: number, phrase?: string) => void;
  onAddSeller: (newSeller: Seller) => void;
  onDeleteSeller: (sellerId: string) => void;
  onResetWeekSales: (week: WeekNumber) => void;
  onOpenEditModal: (seller: Seller) => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({
  campaign,
  onUpdateSellerWeek,
  onAddSeller,
  onDeleteSeller,
  onResetWeekSales,
  onOpenEditModal,
}) => {
  const [selectedWeek, setSelectedWeek] = useState<WeekNumber>(campaign.activeWeek);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Local state for instant inline row edits
  const [sellerRows, setSellerRows] = useState<Record<string, { target: number; current: number; phrase: string }>>(() => {
    const initialMap: Record<string, { target: number; current: number; phrase: string }> = {};
    campaign.sellers.forEach((s) => {
      const wData = s.weeks[campaign.activeWeek];
      initialMap[s.id] = {
        target: wData.target,
        current: wData.current,
        phrase: wData.customPhrase || '',
      };
    });
    return initialMap;
  });

  const handleSelectWeekAdmin = (w: WeekNumber) => {
    setSelectedWeek(w);
    const newMap: Record<string, { target: number; current: number; phrase: string }> = {};
    campaign.sellers.forEach((s) => {
      const wData = s.weeks[w];
      newMap[s.id] = {
        target: wData.target,
        current: wData.current,
        phrase: wData.customPhrase || '',
      };
    });
    setSellerRows(newMap);
  };

  const handleRowTargetChange = (sellerId: string, val: number) => {
    setSellerRows((prev) => ({
      ...prev,
      [sellerId]: {
        ...(prev[sellerId] || { target: 0, current: 0, phrase: '' }),
        target: val,
      },
    }));
  };

  const handleRowCurrentChange = (sellerId: string, val: number) => {
    setSellerRows((prev) => ({
      ...prev,
      [sellerId]: {
        ...(prev[sellerId] || { target: 0, current: 0, phrase: '' }),
        current: val,
      },
    }));
  };

  const handleRowPhraseChange = (sellerId: string, val: string) => {
    setSellerRows((prev) => ({
      ...prev,
      [sellerId]: {
        ...(prev[sellerId] || { target: 0, current: 0, phrase: '' }),
        phrase: val,
      },
    }));
  };

  const handleSaveSellerRow = (sellerId: string) => {
    const row = sellerRows[sellerId] || {
      target: campaign.sellers.find((s) => s.id === sellerId)?.weeks[selectedWeek].target || 50000,
      current: campaign.sellers.find((s) => s.id === sellerId)?.weeks[selectedWeek].current || 0,
      phrase: '',
    };

    onUpdateSellerWeek(sellerId, selectedWeek, Number(row.target), Number(row.current), row.phrase);
    soundManager.playIncrement();
  };

  const handleResetSalesClick = () => {
    if (window.confirm(`Tem certeza que deseja ZERAR as vendas realizadas de TODOS os vendedores na Semana ${selectedWeek}? As metas serão mantidas.`)) {
      onResetWeekSales(selectedWeek);

      setSellerRows((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((id) => {
          next[id] = { ...next[id], current: 0 };
        });
        return next;
      });

      soundManager.playIncrement();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ADM Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-outfit font-extrabold text-white flex items-center gap-2">
              <span>Central de Controle ADM (Gestor)</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Acesso Autorizado (9822)
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Edite a Meta em R$ e o Vendido em R$ de cada vendedor para cada uma das 4 semanas.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Prominent Report Button for Selected Week */}
          <button
            onClick={() => setIsReportOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-300 hover:to-yellow-400 transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-950" />
            <span>📊 Relatório Semana {selectedWeek}</span>
          </button>

          <button
            onClick={() => onOpenEditModal({
              id: '',
              name: '',
              avatarColor: 'from-emerald-500 to-teal-700',
              weeks: {
                1: { target: 50000, current: 0, prizeAmount: 100 },
                2: { target: 55000, current: 0, prizeAmount: 200 },
                3: { target: 60000, current: 0, prizeAmount: 300 },
                4: { target: 65000, current: 0, prizeAmount: 400 },
              },
            })}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-slate-950 font-black text-xs sm:text-sm hover:from-emerald-400 hover:to-green-500 transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Adicionar Vendedor</span>
          </button>

          <button
            onClick={handleResetSalesClick}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Zerar Vendas Semana {selectedWeek}</span>
          </button>
        </div>
      </div>

      {/* Week Selector in Admin Mode */}
      <div className="flex items-center justify-between gap-2 p-2 bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 px-3 uppercase tracking-wider shrink-0 font-outfit">
            SELECIONE A SEMANA PARA PROJETAR:
          </span>
          {([1, 2, 3, 4] as WeekNumber[]).map((w) => {
            const info = WEEK_PRIZE_DEFAULTS[w];
            const isSel = selectedWeek === w;
            return (
              <button
                key={w}
                onClick={() => handleSelectWeekAdmin(w)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                  isSel
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                Semana {w} (Prêmio: R$ {info.prize})
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin Table for Editing Goals & Realized Sales */}
      <div className="overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-xs uppercase text-slate-400 font-bold tracking-wider">
                <th className="py-4 px-6">Vendedor</th>
                <th className="py-4 px-4">Meta Semana {selectedWeek} (R$)</th>
                <th className="py-4 px-4">Vendido Semana {selectedWeek} (R$)</th>
                <th className="py-4 px-4 text-center">% Realizado</th>
                <th className="py-4 px-4">Frase Motivacional da Meta</th>
                <th className="py-4 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {campaign.sellers.map((seller) => {
                const wData = seller.weeks[selectedWeek];
                const rowState = sellerRows[seller.id] || {
                  target: wData.target,
                  current: wData.current,
                  phrase: wData.customPhrase || '',
                };

                const pct = calculatePercentage(rowState.current, rowState.target);

                return (
                  <tr key={seller.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Name */}
                    <td className="py-4 px-6 font-bold text-white flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${seller.avatarColor || 'from-emerald-500 to-teal-700'} flex items-center justify-center text-slate-950 font-black text-sm shrink-0`}>
                        {seller.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="block font-outfit text-base font-extrabold">{seller.name}</span>
                    </td>

                    {/* Meta Input (R$) */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-500 font-mono">R$</span>
                        <input
                          type="number"
                          min={0}
                          value={rowState.target}
                          onChange={(e) => handleRowTargetChange(seller.id, Number(e.target.value))}
                          className="w-32 px-3 py-1.5 rounded-xl bg-slate-950 border border-emerald-500/50 text-white font-mono text-xs font-bold focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </td>

                    {/* Vendido Input (R$) */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-emerald-500 font-mono">R$</span>
                        <input
                          type="number"
                          min={0}
                          value={rowState.current}
                          onChange={(e) => handleRowCurrentChange(seller.id, Number(e.target.value))}
                          className="w-32 px-3 py-1.5 rounded-xl bg-slate-950 border border-emerald-500/50 text-emerald-400 font-mono text-xs font-bold focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </td>

                    {/* Percentage % Calculated */}
                    <td className="py-4 px-4 text-center font-mono-num">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                        pct >= 100
                          ? 'bg-emerald-500 text-slate-950'
                          : pct >= 85
                          ? 'bg-lime-400 text-slate-950'
                          : 'bg-slate-800 text-emerald-400'
                      }`}>
                        {pct}%
                      </span>
                    </td>

                    {/* Phrase Input */}
                    <td className="py-4 px-4 text-xs">
                      <input
                        type="text"
                        placeholder="Frase personalizada..."
                        value={rowState.phrase}
                        onChange={(e) => handleRowPhraseChange(seller.id, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleSaveSellerRow(seller.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition-all shadow-sm cursor-pointer"
                        title="Salvar alterações deste vendedor"
                      >
                        Salvar
                      </button>

                      <button
                        onClick={() => onDeleteSeller(seller.id)}
                        className="p-1.5 rounded-xl bg-slate-800 text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 cursor-pointer"
                        title="Excluir Vendedor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Week Executive Report Modal */}
      <WeekReportModal
        campaign={campaign}
        week={selectedWeek}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
};
