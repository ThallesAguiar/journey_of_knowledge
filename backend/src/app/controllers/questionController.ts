import Controller from "./controller";
import { Request, Response, NextFunction } from 'express';
import { generateQuestions } from '../../services/gpt';
import * as tf from '@tensorflow/tfjs'; // Para embeddings e similaridade semântica

class QuestionController extends Controller {
  constructor() {
    super();
  }

  private questionsAlreadyGenerated: string[] = [];
  private questions: any[] = [];
  private errors: any[] = [];
  private warnings: any[] = [];

  // Usando arrow function para garantir o contexto correto do "this"
  index = async (req: Request, res: Response): Promise<void> => {
    try {
      res.json({
        error: false,
        msg: "List of questions",
        errors: this.errors,
        warnings: this.warnings,
        result: this.questionsAlreadyGenerated
      });
    } catch (err: any) {
      res.status(500).json({
        error: true,
        msg: "Error",
        errors: this.errors.push(err),
        warnings: this.warnings,
        result: {},
      });
    }
  };

  store = async (req: Request, res: Response): Promise<void> => {
    try {
      let notRepeat = "";
      const { theme, discipline, description } = req.body;

      if (this.questionsAlreadyGenerated.length > 0) {
        notRepeat = this.questionsAlreadyGenerated.join("; ");
      }

      let retryCount = 0;
      const MAX_RETRIES = 5;

      let question;
      while (retryCount < MAX_RETRIES) {
        question = await generateQuestions(theme, discipline, description, "", notRepeat);

        if (this.isQuestionUnique(question.question, this.questionsAlreadyGenerated)) {
          break;
        }

        retryCount++;
      }

      // Fallback: Se não gerar uma pergunta única, muda o tema ou nível
      if (retryCount >= MAX_RETRIES) {
        console.warn("Não foi possível gerar uma pergunta única após várias tentativas. Mudando o tema...");
        question = await generateQuestions("história", discipline, description, "", notRepeat); // Fallback para história
      }

      if (question) {
        this.questionsAlreadyGenerated.push(question.question);
        this.questions.push(question);
      } else {
        throw new Error("Failed to generate a unique question");
      }

      res.status(201).json({
        error: false,
        msg: "Created",
        errors: this.errors,
        warnings: this.warnings,
        result: {
          question,
          questionsAlreadyGenerated: this.questionsAlreadyGenerated,
          notRepeat
        },
      });
    } catch (err: any) {
      res.status(500).json({
        error: true,
        msg: "Error",
        errors: this.errors.push(err),
        warnings: this.warnings,
        result: {},
      });
    }
  };

  private isQuestionUnique(newQuestion: string, existingQuestions: string[]): boolean {
    const normalizeQuestion = (q: string) =>
      q.toLowerCase()
        .replace(/[^\w\s]/g, '')  // Remove pontuação
        .replace(/\s+/g, ' ')     // Normaliza espaços
        .trim();

    const normalizedNewQuestion = normalizeQuestion(newQuestion);

    // Verifica similaridade semântica usando embeddings
    const similarityThreshold = 0.65;
    const newQuestionEmbedding = this.getEmbedding(normalizedNewQuestion);

    return !existingQuestions.some(existingQ => {
      const normalizedExistingQ = normalizeQuestion(existingQ);
      const existingQuestionEmbedding = this.getEmbedding(normalizedExistingQ);
      const similarity = this.calculateCosineSimilarity(newQuestionEmbedding, existingQuestionEmbedding);
      return similarity > similarityThreshold;
    });
  }

  private getEmbedding(text: string): tf.Tensor {
    // Simulação de geração de embedding (substitua por um modelo real)
    const words = text.split(/\s+/);
    const embedding = tf.ones([words.length, 300]); // Exemplo de embedding de 300 dimensões
    return tf.mean(embedding, 0); // Média dos embeddings das palavras
  }

  private calculateCosineSimilarity(vec1: tf.Tensor, vec2: tf.Tensor): number {
    const dotProduct = tf.dot(vec1, vec2).dataSync()[0];
    const normVec1 = tf.norm(vec1).dataSync()[0];
    const normVec2 = tf.norm(vec2).dataSync()[0];
    return dotProduct / (normVec1 * normVec2);
  }
}

// Exporta uma instância do controller
export default new QuestionController();