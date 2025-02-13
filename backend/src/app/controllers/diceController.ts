import { Request, Response, NextFunction } from 'express';
import Controller from "./controller";

class DiceController extends Controller {
    constructor() {
        super(); // Chama o construtor da classe pai
    }

    private data: any[] = [];

    /** Girar o dado */
    index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const sides = req.query.sides ? parseInt(req.query.sides as string) : 6;
        if(sides && sides < 1) {
            res.status(400).json({ error: true, msg: "Invalid sides" });
            return;
        }
        try {
            const value = this.getRandomNumber(1, sides ?? 6);

            res.json({ error: false, msg: `Valendo ${value} ${value === 1 ? 'trilha' : 'trilhas'}`, result: value });
        } catch (err: any) {
            next(err);
        }
    };

    store = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, description } = req.body;

            if (!name || !description) {
                res.status(400).json({ error: true, msg: "Name and description are required" });
                return;
            }

            const newItem = { id: this.data.length + 1, name, description };
            this.data.push(newItem);

            res.status(201).json({ error: false, msg: "Created", result: newItem });
        } catch (err: any) {
            next(err);
        }
    }


    show = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const item = this.data.find((item) => item.id === id);

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

            const itemIndex = this.data.findIndex((item) => item.id === id);

            if (itemIndex === -1) {
                res.status(404).json({ error: true, msg: "Item not found" });
                return;
            }

            if (!name || !description) {
                res.status(400).json({ error: true, msg: "Name and description are required" });
                return;
            }

            this.data[itemIndex] = { ...this.data[itemIndex], name, description };

            res.json({ error: false, msg: "Updated", result: this.data[itemIndex] });
        } catch (err: any) {
            next(err);
        }
    }

    destroy = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            const itemIndex = this.data.findIndex((item) => item.id === id);

            if (itemIndex === -1) {
                res.status(404).json({ error: true, msg: "Item not found" });
                return;
            }

            const deletedItem = this.data.splice(itemIndex, 1);

            res.json({ error: false, msg: "Deleted", result: deletedItem });
        } catch (err: any) {
            next(err);
        }
    }
}

// Exporta uma instância do controller
export default new DiceController();