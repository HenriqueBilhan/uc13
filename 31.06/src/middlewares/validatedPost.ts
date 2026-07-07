import { Request, Response, NextFunction } from 'express';

export function validatePost(req: Request, res: Response, next: NextFunction) {
    const { title, userId } = req.body;

    if (!title || !userId) {
        return res.status(400).json({
            message: 'Os campos title e userId são obrigatórios.',
        });
    }

    next();
}