import { Request, Response, NextFunction } from 'express';

export function validateUser(req: Request, res: Response, next: NextFunction) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: 'Os campos name, email e password são obrigatórios.',
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: 'A senha deve ter pelo menos 6 caracteres.',
        });
    }

    next();
}