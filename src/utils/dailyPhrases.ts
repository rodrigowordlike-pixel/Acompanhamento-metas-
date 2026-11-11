export interface DailyPhrase {
  dayName: string;
  dayIndex: number; // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sab
  emoji: string;
  tagline: string;
  phrase: string;
}

export const DAILY_PHRASES: Record<number, DailyPhrase> = {
  1: {
    dayName: 'Segunda-feira',
    dayIndex: 1,
    emoji: '🚀',
    tagline: 'HOJE É SEGUNDA-FEIRA!',
    phrase: '🚀 Segunda-feira! Começando mais uma semana de vendas com fogo nos olhos! Vamos pra cima fechar os primeiros pedidos!',
  },
  2: {
    dayName: 'Terça-feira',
    dayIndex: 2,
    emoji: '⚡',
    tagline: 'HOJE É TERÇA-FEIRA!',
    phrase: '⚡ Terça-feira! Hoje é o dia de correr atrás do cliente que fez a cotação ontem e fechar o pedido!',
  },
  3: {
    dayName: 'Quarta-feira',
    dayIndex: 3,
    emoji: '🔥',
    tagline: 'HOJE É QUARTA-FEIRA!',
    phrase: '🔥 Quarta-feira! Meio da semana e o ritmo é de aceleração máxima! O prêmio em dinheiro tá logo ali, não desacelera!',
  },
  4: {
    dayName: 'Quinta-feira',
    dayIndex: 4,
    emoji: '💥',
    tagline: 'HOJE É QUINTA-FEIRA!',
    phrase: '💥 Quinta-feira! Dia do sprint decisivo! Quem quer garantir o prêmio em dinheiro aperta o passo hoje!',
  },
  5: {
    dayName: 'Sexta-feira',
    dayIndex: 5,
    emoji: '🏆',
    tagline: 'HOJE É SEXTA-FEIRA!',
    phrase: '🏆 Sexta-feira! Dia de fechamento de ouro e celebração! Vamos com tudo colocar esse bônus no bolso!',
  },
  6: {
    dayName: 'Sábado',
    dayIndex: 6,
    emoji: '⭐',
    tagline: 'HOJE É SÁBADO!',
    phrase: '⭐ Sábado de foco e determinação! Cada atendimento no final de semana faz a diferença no bônus!',
  },
  0: {
    dayName: 'Domingo',
    dayIndex: 0,
    emoji: '🔋',
    tagline: 'DOMINGO DE RECARGA',
    phrase: '🔋 Domingo! Mente focada e energia recarregada para arrebentar na meta da semana!',
  },
};

export function getTodayPhrase(): DailyPhrase {
  const todayIndex = new Date().getDay(); // 0 = Domingo, 1 = Segunda, etc.
  return DAILY_PHRASES[todayIndex] || DAILY_PHRASES[1];
}
