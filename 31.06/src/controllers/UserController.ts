import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  
    async list(req: Request, res: Response) {
        const users = await UserService.listAll();
        return res.json(users);
    }

    
    async getById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const user = await UserService.getById(id);
        return res.json(user);
    }

   
    async create(req: Request, res: Response) {
        const { name, email, password } = req.body;
        const user = await UserService.create({ name, email, password });
        return res.status(201).json(user);
    }

    
    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        const { name, email, password } = req.body;
        const user = await UserService.update(id, { name, email, password });
        return res.json(user);
    }
    async delete(req: Request, res: Response) {
        const id = Number(req.params.id);
        await UserService.delete(id);

        return res.status(204).send();
    }
}