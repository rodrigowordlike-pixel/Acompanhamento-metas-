import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

app.post('/api/motivate', async (req, res) => {
  try {
    const { teamStats, type, dayName, customPrompt } = req.body;
    const ai = getGenAIClient();

    if (!ai) {
      return res.json({
        success: true,
        source: 'rule-based',
        motivationalMessage: generateRuleBasedMotivation(teamStats, type, dayName),
      });
    }

    let prompt = '';
    if (type === 'daily_banner') {
      prompt = `Você é um Líder de Vendas Comercial no Brasil extremamente enérgico e motivador.
Crie 1 frase motivacional bem curta (máximo 15 palavras) específica para o dia da semana: ${dayName || 'Segunda-feira'}.
Exemplo para Terça: "⚡ Terça-feira! Dia de resgatar cada cotação aberta e fechar o pedido!"
REGRAS: Fale de maneira informal, vibrante e focada em vendedores no Brasil. Use 1 emoji. NUNCA fale em valores de dinheiro (R$).`;
    } else if (type === 'whatsapp_summary') {
      prompt = `Você é um Gerente Comercial de Alto Desempenho no Brasil.
Escreva uma mensagem vibrante para o grupo de WhatsApp da equipe de vendas para a Semana ${teamStats?.weekNumber || 1}.
REGRAS:
- NUNCA mencione valores em dinheiro (R$) de vendas realizada. Fale APENAS em porcentagem (%).
- Mencione o prêmio em dinheiro da semana (ex: R$ ${teamStats?.prizeAmount || 100}).
- Destaque o líder atual do pódio.
- Use emojis enérgicos (🚀, 🔥, 🏆, ⚡, 💰).

Dados:
${JSON.stringify(teamStats, null, 2)}`;
    } else {
      prompt = customPrompt || 'Gere uma frase motivacional curta para vendedores.';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Você é um líder comercial de elite no Brasil. Suas mensagens transmitem garra, entusiasmo, energia verde vibrante e foco em vendas.',
      },
    });

    const text = response.text || generateRuleBasedMotivation(teamStats, type, dayName);

    return res.json({
      success: true,
      source: 'gemini-ai',
      motivationalMessage: text.trim(),
    });
  } catch (error: any) {
    console.error('Error generating motivation:', error);
    return res.json({
      success: true,
      source: 'fallback',
      motivationalMessage: generateRuleBasedMotivation(req.body?.teamStats, req.body?.type, req.body?.dayName),
    });
  }
});

function generateRuleBasedMotivation(teamStats: any, type: string, dayName?: string) {
  if (type === 'daily_banner') {
    const day = dayName || 'Segunda-feira';
    if (day.includes('Segunda')) return '🚀 Segunda-feira! Começando a semana com fogo nos olhos! Vamos pra cima fechar os primeiros pedidos!';
    if (day.includes('Terça')) return '⚡ Terça-feira! Hoje é dia de correr atrás das cotações de ontem e fechar a venda!';
    if (day.includes('Quarta')) return '🔥 Quarta-feira! Meio da semana e o ritmo é de aceleração máxima! O bônus tá logo ali!';
    if (day.includes('Quinta')) return '💥 Quinta-feira! Dia do sprint decisivo! Quem quer garantir o prêmio aperta o passo hoje!';
    if (day.includes('Sexta')) return '🏆 Sexta-feira! Dia de fechamento de ouro! Vamos colocar esse bônus no bolso!';
    return '⭐ Dia de energia renovada! Cada atendimento faz a diferença no pódio!';
  }

  if (type === 'whatsapp_summary') {
    return `🔥 *META VENDAS - SEMANA ${teamStats?.weekNumber || 1}* 🔥
🚀 *Média da Equipe:* ${teamStats?.averagePercentage || 75}%
💰 *Prêmio da Semana:* R$ ${teamStats?.prizeAmount || 100}

🏆 *Líder:* ${teamStats?.leaderName || 'O Líder'} (${teamStats?.leaderPercentage || 100}%)
👉 Vamos com tudo colocar esse bônus no bolso! 💪`;
  }

  return 'Foco no objetivo! Vamos pra cima fechar os pedidos!';
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 MetaVendas Server running on http://localhost:${PORT}`);
  });
}

startServer();
