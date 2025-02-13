import Controller from "./controller";
import { Request, Response, NextFunction } from 'express';
import { generateQuestions } from '../../services/gpt';


class QuestionController extends Controller {
    constructor() {
        super(); // Chama o construtor da classe pai
    }

    private questions: any[] = [];

    // Usando arrow function para garantir o contexto correto do "this"
    index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            res.json({ error: false, msg: "List of questions", result: this.questions });
        } catch (err: any) {
            next(err);
        }
    };

    store = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            let notRepeat = "";
            const { theme, discipline, description , level } = req.body;

            if (this.questions.length > 0) {
                notRepeat = this.questions.join("; ");
            }

            const question = await generateQuestions(theme, discipline, description, level, notRepeat);

            this.questions.push(question.question);

            res.status(201).json({
                error: false,
                msg: "Created",
                result: question,
                questions: this.questions,
                notRepeat
            });
        } catch (err: any) {
            next(err);
        }
    };




    show = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const item = this.questions.find((item) => item.id === id);

            if (!item) {
                res.status(404).json({ error: true, msg: "Item not found" });
                return;
            }

            res.json({ error: false, msg: "Item found", result: item });
        } catch (err: any) {
            next(err);
        }
    }

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const { name, description } = req.body;

            const itemIndex = this.questions.findIndex((item) => item.id === id);

            if (itemIndex === -1) {
                res.status(404).json({ error: true, msg: "Item not found" });
                return;
            }

            if (!name || !description) {
                res.status(400).json({ error: true, msg: "Name and description are required" });
                return;
            }

            this.questions[itemIndex] = { ...this.questions[itemIndex], name, description };

            res.json({ error: false, msg: "Updated", result: this.questions[itemIndex] });
        } catch (err: any) {
            next(err);
        }
    }

    destroy = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const itemIndex = this.questions.findIndex((item) => item.id === id);

            if (itemIndex === -1) {
                res.status(404).json({ error: true, msg: "Item not found" });
                return;
            }

            const deletedItem = this.questions.splice(itemIndex, 1);

            res.json({ error: false, msg: "Deleted", result: deletedItem });
        } catch (err: any) {
            next(err);
        }
    }
}

// Exporta uma instância do controller
export default new QuestionController();