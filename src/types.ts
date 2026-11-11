export type WeekNumber = 1 | 2 | 3 | 4;

export interface WeeklyData {
  target: number;       // Meta da semana em R$ (Ex: 89500)
  current: number;      // Vendido na semana em R$ (Ex: 76075)
  prizeAmount: number;  // Prêmio da semana em R$ (Ex: 100, 200, 300, 400)
  customPhrase?: string;
}

export interface Seller {
  id: string;
  name: string;
  avatarColor?: string;
  weeks: {
    1: WeeklyData;
    2: WeeklyData;
    3: WeeklyData;
    4: WeeklyData;
  };
}

export interface MonthCampaign {
  id: string;
  title: string;          // Ex: "Campanha de Metas & Super Bônus Mensal"
  activeWeek: WeekNumber;
  bannerPhrase: string;
  sellers: Seller[];
}

export type ViewMode = 'preview' | 'admin';
export type SortMode = 'rank' | 'lowest' | 'name' | 'prize';
