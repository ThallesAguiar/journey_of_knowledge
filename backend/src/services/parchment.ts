import axios from 'axios';
import dotenv from 'dotenv';
import json5 from 'json5'; // Biblioteca para lidar com JSON malformado

dotenv.config();

const GPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const GPT_API_KEY = process.env.GPT_API_KEY;

// Função para corrigir JSON malformado
const fixJson = (jsonString: string) => {
  try {
    return json5.parse(jsonString); // Usa json5 para parsing mais tolerante
  } catch (error) {
    console.error('Erro ao corrigir o JSON:', error);
    throw new Error('Erro ao processar as perguntas retornadas');
  }
};

interface Parchment {
  parchment: string;
  title: string;
  content: string;
}

export const generateParchments = async (
  theme: string = "",
): Promise<Parchment> => {
  const prompt = `
  Gere uma curiosidade única e inédita sobre o tema  **${theme ? theme : "conhecimentos gerais "}** no formato de pergaminhos do conhecimento inspirados no jogo Conhecimento é Poder do PS4. Cada curiosidade deve ser curta, informativa e escrita de forma envolvente.

  Formato da resposta (JSON):
  {
    "parchment":
      {
        "title": "Título do pergaminho",
        "content": "Texto da curiosidade"
      }
  }`;

  try {
    console.log('Enviando requisição para a API do GPT...');
    const response = await axios.post(
      GPT_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: "system",
            content: "Você é o apresentador de curiosidades do jogo 'Conhecimento é Poder'. Sua função é gerar pergaminhos do conhecimento envolventes para os jogadores. Apresente as curiosidades de forma clara e objetiva, garantindo que estejam no formato correto para o jogo.",
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        n: 1,
        temperature: 0.4,  // Reduzindo a temperatura para evitar repetições
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GPT_API_KEY}`,
        },
      }
    );

    console.log('Resposta da API do GPT:', response.data);

    const content = response.data.choices[0].message.content.trim();
    console.log('Conteúdo retornado pelo GPT:', content);

    if (!content.startsWith('{')) {
      throw new Error('O conteúdo retornado não é um JSON válido.');
    }

    const question = fixJson(content);

    console.log('JSON parseado com sucesso:', question);

    return question;
  } catch (error: any) {
    console.error('Erro ao chamar a API do GPT:', error.response?.data || error.message);
    throw new Error('Failed to generate parchments');
  }
};