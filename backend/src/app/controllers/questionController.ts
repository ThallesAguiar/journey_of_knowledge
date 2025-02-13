import Controller from "./controller";
import { Request, Response, NextFunction } from 'express';
import { generateQuestions } from '../../services/gpt';


class QuestionController extends Controller {
    constructor() {
        super(); // Chama o construtor da classe pai
    }

    private questionsAlreadyGenerated: any[] = [];
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

            const question = await generateQuestions(theme, discipline, description, "", notRepeat);

            this.questionsAlreadyGenerated.push(question.question);
            this.questions.push(question.question);

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




    show = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const item = this.questionsAlreadyGenerated.find((item) => item.id === id);

            if (!item) {
                res.status(404).json({ error: true, msg: "Item not found" });
                return;
            }

            res.json({ error: false, msg: "Item found", result: item });
        } catch (err: any) {
            res.status(500).json({
                error: false,
                msg: "Error",
                errors: this.errors.push(err),
                warnings: this.warnings,
                result: {},
            });
        }
    }

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const { name, description } = req.body;

            const itemIndex = this.questionsAlreadyGenerated.findIndex((item) => item.id === id);

            if (itemIndex === -1) {
                res.status(404).json({ error: true, msg: "Item not found" });
                return;
            }

            if (!name || !description) {
                res.status(400).json({ error: true, msg: "Name and description are required" });
                return;
            }

            this.questionsAlreadyGenerated[itemIndex] = { ...this.questionsAlreadyGenerated[itemIndex], name, description };

            res.json({ error: false, msg: "Updated", result: this.questionsAlreadyGenerated[itemIndex] });
        } catch (err: any) {
            res.status(500).json({
                error: false,
                msg: "Error",
                errors: this.errors.push(err),
                warnings: this.warnings,
                result: {},
            });
        }
    }

    destroy = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const itemIndex = this.questionsAlreadyGenerated.findIndex((item) => item.id === id);

            if (itemIndex === -1) {
                res.status(404).json({ error: true, msg: "Item not found" });
                return;
            }

            const deletedItem = this.questionsAlreadyGenerated.splice(itemIndex, 1);

            res.json({ error: false, msg: "Deleted", result: deletedItem });
        } catch (err: any) {
            res.status(500).json({
                error: false,
                msg: "Error",
                errors: this.errors.push(err),
                warnings: this.warnings,
                result: {},
            });
        }
    }
}

// Exporta uma instância do controller
export default new QuestionController();