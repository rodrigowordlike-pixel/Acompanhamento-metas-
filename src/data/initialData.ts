import { MonthCampaign, Seller, WeekNumber } from '../types';

export const INITIAL_SELLERS: Seller[] = [
  {
    id: 'seller-1',
    name: 'Fabrício',
    avatarColor: 'from-emerald-500 to-teal-700',
    weeks: {
      1: { target: 89500, current: 76075, prizeAmount: 100, customPhrase: 'Falta pouco pro prêmio de R$100! Foco no sprint! 🏃‍♂️💨' },
      2: { target: 90000, current: 81000, prizeAmount: 200, customPhrase: 'Reta final da Semana 2! Mirando R$200! ⚡' },
      3: { target: 92000, current: 46000, prizeAmount: 300, customPhrase: 'Subindo a rampa para os R$300! 🚀' },
      4: { target: 95000, current: 38000, prizeAmount: 400, customPhrase: 'O Grande Final de R$400 tá chegando! 🔥' },
    },
  },
  {
    id: 'seller-2',
    name: 'Reginaldo',
    avatarColor: 'from-green-500 to-emerald-700',
    weeks: {
      1: { target: 56900, current: 54055, prizeAmount: 100, customPhrase: 'Na cola do 100%! 95% do bônus de R$100 garantido! 💰' },
      2: { target: 58000, current: 58000, prizeAmount: 200, customPhrase: 'Bônus de R$200 conquistado com garra! 🏆' },
      3: { target: 60000, current: 36000, prizeAmount: 300, customPhrase: 'Ritmo firme na Semana 3! ⚡' },
      4: { target: 62000, current: 24800, prizeAmount: 400, customPhrase: 'Foco total no Super Bônus de R$400! 🚀' },
    },
  },
  {
    id: 'seller-3',
    name: 'Raphael',
    avatarColor: 'from-emerald-400 to-lime-600',
    weeks: {
      1: { target: 98000, current: 102900, prizeAmount: 100, customPhrase: 'META BATIDA! PRÊMIO DE R$100 DESBLOQUEADO! 🏆🎉' },
      2: { target: 100000, current: 105000, prizeAmount: 200, customPhrase: '2ª SEMANA CONSECTIVA BATIDA! R$200 NO BOLSO! 🔥' },
      3: { target: 102000, current: 81600, prizeAmount: 300, customPhrase: 'Buscar o prêmio de R$300 com tudo! 💥' },
      4: { target: 105000, current: 42000, prizeAmount: 400, customPhrase: 'Preparado para arrebentar nos R$400! 🚀' },
    },
  },
  {
    id: 'seller-4',
    name: 'Cezar',
    avatarColor: 'from-teal-500 to-emerald-800',
    weeks: {
      1: { target: 49000, current: 30870, prizeAmount: 100, customPhrase: 'Acelerando! 63% concluído pro prêmio! ⚡' },
      2: { target: 50000, current: 35000, prizeAmount: 200, customPhrase: 'Avançando rumo aos R$200! 🚀' },
      3: { target: 52000, current: 26000, prizeAmount: 300, customPhrase: 'Engrenando a máquina de vendas! 🔥' },
      4: { target: 55000, current: 22000, prizeAmount: 400, customPhrase: 'Sprint final do mês! 💰' },
    },
  },
  {
    id: 'seller-5',
    name: 'Gelson',
    avatarColor: 'from-emerald-600 to-green-800',
    weeks: {
      1: { target: 53000, current: 41340, prizeAmount: 100, customPhrase: '78% da meta da Semana 1! Foco no R$100! 🎯' },
      2: { target: 55000, current: 44000, prizeAmount: 200, customPhrase: 'Acelerando para os R$200! ⚡' },
      3: { target: 56000, current: 28000, prizeAmount: 300, customPhrase: 'Meio caminho andado! 🚀' },
      4: { target: 58000, current: 23200, prizeAmount: 400, customPhrase: 'No encalço do super prêmio! 🔥' },
    },
  },
  {
    id: 'seller-6',
    name: 'Nikolas',
    avatarColor: 'from-green-600 to-teal-800',
    weeks: {
      1: { target: 34000, current: 14280, prizeAmount: 100, customPhrase: 'Gás total pra buscar o prêmio da Semana 1! 🚀' },
      2: { target: 35000, current: 21000, prizeAmount: 200, customPhrase: 'Subindo o ritmo na Semana 2! 💥' },
      3: { target: 38000, current: 19000, prizeAmount: 300, customPhrase: 'Foco e determinação! ⚡' },
      4: { target: 40000, current: 16000, prizeAmount: 400, customPhrase: 'Vou fechar o mês no topo! 🏆' },
    },
  },
  {
    id: 'seller-7',
    name: 'Matheus',
    avatarColor: 'from-lime-500 to-emerald-600',
    weeks: {
      1: { target: 56000, current: 51520, prizeAmount: 100, customPhrase: '92%! O prêmio de R$100 tá no papo! 🎯' },
      2: { target: 58000, current: 52200, prizeAmount: 200, customPhrase: 'Quase lá! R$200 a um passo! 🔥' },
      3: { target: 60000, current: 36000, prizeAmount: 300, customPhrase: 'Mantendo o pique constante! ⚡' },
      4: { target: 62000, current: 24800, prizeAmount: 400, customPhrase: 'Super bônus na mira! 🚀' },
    },
  },
];

export const DEFAULT_MONTH_CAMPAIGN: MonthCampaign = {
  id: 'campaign-4-weeks',
  title: 'Circuito 4 Semanas de Metas & Super Bônus',
  activeWeek: 1,
  bannerPhrase: '🔥 CIRCUITO DE BÔNUS: 4 METAS, R$ 1.000 EM PRÊMIOS POR VENDEDOR! 🚀',
  sellers: INITIAL_SELLERS,
};

export const WEEK_PRIZE_DEFAULTS: Record<WeekNumber, { label: string; prize: number; color: string }> = {
  1: { label: 'Semana 1', prize: 100, color: 'from-emerald-500 to-green-600' },
  2: { label: 'Semana 2', prize: 200, color: 'from-teal-500 to-emerald-600' },
  3: { label: 'Semana 3', prize: 300, color: 'from-cyan-500 to-teal-600' },
  4: { label: 'Semana 4 (Super Bônus)', prize: 400, color: 'from-amber-400 via-emerald-400 to-lime-300' },
};

export function calculatePercentage(current: number, target: number): number {
  if (!target || target <= 0) return 0;
  const pct = (current / target) * 100;
  return Number(pct.toFixed(1));
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function getStatusDetails(percentage: number, prizeAmount: number = 100) {
  if (percentage >= 100) {
    return {
      label: `🏆 META BATIDA! BÔNUS R$ ${prizeAmount} NO BOLSO!`,
      color: 'bg-gradient-to-r from-amber-400 via-emerald-400 to-lime-300 text-slate-950 font-black shadow-lg shadow-emerald-500/30 border border-amber-300',
      badgeBorder: 'border-emerald-400/80 bg-emerald-950/40',
      progressGradient: 'from-emerald-400 via-green-400 to-lime-300',
      textColor: 'text-emerald-400',
      defaultPhrase: `META BATIDA! Prêmio de R$${prizeAmount} conquistado com sucesso! 🏆🎉`,
      icon: '💰',
      isUnlocked: true,
    };
  }
  if (percentage >= 85) {
    return {
      label: `🔥 RETA FINAL PRO BÔNUS R$ ${prizeAmount}!`,
      color: 'bg-lime-400 text-slate-950 font-extrabold border border-lime-300 shadow-md shadow-lime-400/20',
      badgeBorder: 'border-lime-500/50 bg-lime-950/30',
      progressGradient: 'from-emerald-500 to-lime-400',
      textColor: 'text-lime-400',
      defaultPhrase: `Falta muito pouco pro prêmio em dinheiro de R$${prizeAmount}! Foco total! 🔥`,
      icon: '🔥',
      isUnlocked: false,
    };
  }
  if (percentage >= 60) {
    return {
      label: '⚡ FOCO NO OBJETIVO!',
      color: 'bg-teal-500 text-white font-bold border border-teal-400',
      badgeBorder: 'border-teal-500/40 bg-teal-950/30',
      progressGradient: 'from-teal-500 to-emerald-400',
      textColor: 'text-teal-300',
      defaultPhrase: `Ritmo firme! Acelerando para garantir o bônus de R$${prizeAmount}! ⚡`,
      icon: '⚡',
      isUnlocked: false,
    };
  }
  return {
    label: '🚀 BORA ACELERAR OS PEDIDOS!',
    color: 'bg-slate-800 text-emerald-300 font-semibold border border-emerald-500/30',
    badgeBorder: 'border-emerald-700/30 bg-slate-900/40',
    progressGradient: 'from-emerald-700 to-teal-500',
    textColor: 'text-emerald-300',
    defaultPhrase: `Início do sprint! Cada cliente atendido nos aproxima dos R$${prizeAmount}! 🚀`,
    icon: '🚀',
    isUnlocked: false,
  };
}
