import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../services/UserService';

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.error('Erro capturado pelo errorHandler:', err);

    if (err instanceof NotFoundError) {
        return res.status(404).json({ message: err.message });
    }

    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Registro duplicado (email já existente).' });
    }

    return res.status(500).json({ message: 'Erro interno no servidor.' });
}