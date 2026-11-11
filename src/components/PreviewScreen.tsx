import React, { useState } from 'react';
import { MonthCampaign, Seller, WeekNumber } from '../types';
import { calculatePercentage, formatBRL, WEEK_PRIZE_DEFAULTS } from '../data/initialData';
import { SellerCard } from './SellerCard';
import { DailyBanner } from './DailyBanner';
import { WeekSelectorHub } from './WeekSelectorHub';
import { Trophy, Target, Search, Gift, PartyPopper, Flame } from 'lucide-react';

interface PreviewScreenProps {
  campaign: MonthCampaign;
  showValues: boolean;
  onSelectWeek: (week: WeekNumber) => void;
  onQuickAddSales: (sellerId: string, week: WeekNumber, amount: number) => void;
  onOpenEditModal: (seller: Seller) => void;
  onUpdateBannerPhrase: (phrase: string) => void;
}

export const PreviewScreen: React.FC<PreviewScreenProps> = ({
  campaign,
  showValues,
  onSelectWeek,
  onQuickAddSales,
  onOpenEditModal,
  onUpdateBannerPhrase,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const activeWeek = campaign.activeWeek;
  const weekInfo = WEEK_PRIZE_DEFAULTS[activeWeek];

  const totalTarget = campaign.sellers.reduce((acc, s) => acc + s.weeks[activeWeek].target, 0);
  const totalCurrent = campaign.sellers.reduce((acc, s) => acc + s.weeks[activeWeek].current, 0);
  const teamPercentage = calculatePercentage(totalCurrent, totalTarget);

  const winnersActiveWeek = campaign.sellers.filter(
    (s) => calculatePercentage(s.weeks[activeWeek].current, s.weeks[activeWeek].target) >= 100
  );

  const closeToGoalActiveWeek = campaign.sellers.filter((s) => {
    const pct = calculatePercentage(s.weeks[activeWeek].current, s.weeks[activeWeek].target);
    return pct >= 80 && pct < 100;
  });

  const unlockedCounts: Record<WeekNumber, number> = {
    1: campaign.sellers.filter((s) => calculatePercentage(s.weeks[1].current, s.weeks[1].target) >= 100).length,
    2: campaign.sellers.filter((s) => calculatePercentage(s.weeks[2].current, s.weeks[2].target) >= 100).length,
    3: campaign.sellers.filter((s) => calculatePercentage(s.weeks[3].current, s.weeks[3].target) >= 100).length,
    4: campaign.sellers.filter((s) => calculatePercentage(s.weeks[4].current, s.weeks[4].target) >= 100).length,
  };

  const filteredSellers = campaign.sellers.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const triggerScreenShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 1200);
  };

  return (
    <div className={`space-y-8 pb-12 transition-transform ${isShaking ? 'animate-screen-shake' : ''}`}>
      {/* Dynamic Today Banner */}
      <DailyBanner />

      {/* Goal Hit Announcement Banner */}
      {winnersActiveWeek.length > 0 ? (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-lime-500/20 border border-emerald-400/60 p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shrink-0 animate-bounce">
              <PartyPopper className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider block font-outfit">
                CONQUISTAS DA SEMANA {activeWeek}
              </span>
              <p className="text-base sm:text-lg font-outfit font-extrabold text-white">
                {winnersActiveWeek.map((w) => w.name).join(', ')}{' '}
                {winnersActiveWeek.length === 1
                  ? `já garantiu a meta e o prêmio de R$${weekInfo.prize}!`
                  : `já garantiram a meta e o prêmio de R$${weekInfo.prize}!`}
              </p>
            </div>
          </div>

          {closeToGoalActiveWeek.length > 0 && (
            <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-emerald-500/40 text-xs font-bold text-emerald-300 whitespace-nowrap">
              🔥 {closeToGoalActiveWeek.map((s) => s.name).join(', ')} no retiro final!
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <span className="font-bold text-emerald-400 flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-400" />
            <span>Semana {activeWeek}: Todos na busca do prêmio em dinheiro de R$ {weekInfo.prize}!</span>
          </span>
        </div>
      )}

      {/* Interactive 4-Week Selector Hub */}
      <WeekSelectorHub
        activeWeek={activeWeek}
        onSelectWeek={onSelectWeek}
        unlockedCounts={unlockedCounts}
        totalSellers={campaign.sellers.length}
      />

      {/* Team Overall Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Team Percentage Gauge */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/80 border border-emerald-500/30 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Semana {activeWeek} · Progresso Coletivo da Equipe</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-outfit font-black text-white font-mono-num tracking-tight">
              {teamPercentage}%
            </span>
            <span className="text-sm font-bold text-emerald-400">da Meta Coletiva</span>
          </div>

          {showValues && (
            <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-300 font-mono-num">
              <span>{formatBRL(totalCurrent)}</span>
              <span className="text-slate-500">de {formatBRL(totalTarget)}</span>
            </div>
          )}

          <div className="mt-3 w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-lime-300 transition-all duration-700"
              style={{ width: `${Math.min(teamPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Card 2: Cash Prizes Unlocked */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-400" />
              <span>Prêmios em Dinheiro Conquistados</span>
            </span>
            <span className="text-xs font-extrabold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              R$ {weekInfo.prize} / vendedor
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30">
              <span className="text-2xl font-black text-emerald-400 block font-outfit">
                {winnersActiveWeek.length} / {campaign.sellers.length}
              </span>
              <span className="text-[11px] text-slate-300 font-medium">Metas Batidas</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30">
              <span className="text-2xl font-black text-amber-300 block font-outfit font-mono-num">
                R$ {winnersActiveWeek.length * weekInfo.prize}
              </span>
              <span className="text-[11px] text-slate-300 font-medium">Liberados na S{activeWeek}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4 p-2 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <span className="text-xs font-extrabold text-slate-300 px-3 uppercase tracking-wider font-outfit">
          👥 Acompanhamento das Metas dos Vendedores
        </span>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar vendedor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grid of Seller Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSellers.map((seller) => (
          <SellerCard
            key={seller.id}
            seller={seller}
            activeWeek={activeWeek}
            showValues={showValues}
            onOpenEditModal={onOpenEditModal}
            onTriggerScreenShake={triggerScreenShake}
          />
        ))}
      </div>

      {filteredSellers.length === 0 && (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm font-medium">
            Nenhum vendedor encontrado com a busca "{searchQuery}".
          </p>
        </div>
      )}
    </div>
  );
};
