import Controller from "./controller";
import { Request, Response } from 'express';
import { generateParchments } from '../../services/parchments';


class ParchmentController extends Controller {
    constructor() {
        super(); // Chama o construtor da classe pai
    }
    
    private errors: any[] = [];
    private warnings: any[] = [];

    store = async (req: Request, res: Response): Promise<void> => {
        try {
            const { theme } = req.body;

            const parchment = await generateParchments(theme);

            res.status(201).json({ error: false, msg: "Created", result: parchment });
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
export default new ParchmentController();