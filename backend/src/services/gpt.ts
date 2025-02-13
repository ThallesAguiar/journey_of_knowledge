import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const GPT_API_KEY = process.env.GPT_API_KEY;

const fixJson = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    try {
      // Tenta corrigir problemas comuns no JSON retornado
      const fixedJsonString = jsonString
        .replace(/(\r\n|\n|\r)/gm, '') // Remove quebras de linha
        .replace(/,\s*}/g, '}') // Remove vírgulas extras antes de chaves fechando objetos
        .replace(/,\s*]/g, ']') // Remove vírgulas extras antes de fechar arrays
        .replace(/'/g, '"'); // Substitui aspas simples por aspas duplas

      return JSON.parse(fixedJsonString);
    } catch (fixError) {
      console.error('Erro ao corrigir o JSON:', fixError);
      throw new Error('Erro ao processar as perguntas retornadas');
    }
  }
};


interface Question {
  question: string;
  answers: { [key: string]: string }[];
  correct_answer: string;
}

export const generateQuestions = async (theme: string = "conhecimentos gerais", discipline: string = "", description: string = "", level: string = "", notRepeat: string = ""): Promise<Question> => {
  const prompt = `
  Gere uma pergunta única e inédita sobre **${theme}** ${discipline ? "na disciplina de **" + discipline + "**" : ""}  ${level ? "em um nível **" + level + "**" : ""}.

    - A pergunta deve ser objetiva, clara e instigante, no formato de múltipla escolha.
    - Forneça quatro alternativas possíveis, rotuladas como **A, B, C e D**, garantindo que apenas uma delas seja correta.
    ${description ? `    - ${description}` : ""}
    - A pergunta e as alternativas devem seguir um tom semelhante ao do jogo *Conhecimento é Poder*, incentivando o raciocínio e o aprendizado.
    - ⚠️ **IMPORTANTE:** As seguintes perguntas JÁ FORAM GERADAS e NÃO PODEM SER REPETIDAS. Crie uma nova pergunta completamente diferente das listadas abaixo:
      ${notRepeat ? `Perguntas já geradas:\n"""${notRepeat}"""\n` : ""}
    - Você deve garantir que a nova pergunta NÃO tenha conteúdo semelhante às listadas acima.
    - Pode gerar imagens se possível, perguntando o que a imagem representa.
    - Retorne a pergunta no seguinte formato JSON:
    {
      "question": "<PERGUNTA_GERADA>",
      "answers": [
        {"A": "<ALTERNATIVA_A>"},
        {"B": "<ALTERNATIVA_B>"},
        {"C": "<ALTERNATIVA_C>"},
        {"D": "<ALTERNATIVA_D>"}
      ],
      "correct_answer": "<LETRA_DA_ALTERNATIVA_CORRETA>"
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
            content: "Você é o apresentador do jogo 'Conhecimento é Poder'. Sua função é gerar perguntas desafiadoras e envolventes para os jogadores. Apresente as perguntas de forma clara e objetiva, garantindo que estejam no formato correto para o jogo."
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

    // 🚨 Verificação extra para garantir unicidade localmente
    if (notRepeat.includes(question.question)) {
      console.warn("Pergunta gerada já existe! Tentando novamente...");
      return await generateQuestions(theme, discipline, level, notRepeat);
    }

    console.log('JSON parseado com sucesso:', question);

    return question;
  } catch (error: any) {
    console.error('Erro ao chamar a API do GPT:', error.response?.data || error.message);
    throw new Error('Failed to generate questions');
  }
};