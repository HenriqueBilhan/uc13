import { Request, Response } from 'express';
import { PostService } from '../services/PostService';

export class PostController {
  
    async list(req: Request, res: Response) {
        const posts = await PostService.listAll();
        return res.json(posts);
    }

    
    async getById(req: Request, res: Response) {
        const id = Number(req.params.id);
        const post = await PostService.getById(id);
        return res.json(post);
    }

    
    async create(req: Request, res: Response) {
        const { title, userId } = req.body;
        const post = await PostService.create({ title, userId });
        return res.status(201).json(post);
    }

    
    async update(req: Request, res: Response) {
        const id = Number(req.params.id);
        const { title, userId } = req.body;
        const post = await PostService.update(id, { title, userId });
        return res.json(post);
    }

  
    async delete(req: Request, res: Response) {
        const id = Number(req.params.id);
        await PostService.delete(id);
        return res.status(204).send();
    }
}