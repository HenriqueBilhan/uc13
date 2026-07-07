import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { AppError } from "../errors/error-handler";

export class UserController {

    private readonly service: UserService

    constructor() {
        this.service = new UserService()
    }

    async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.service.getAllUser()
            return res.status(200).json(users)
        } catch (err) {
            return res.status(err instanceof AppError ? err.statusCode : 500).json({
                message: err instanceof AppError ? err.message : 'Erro interno do servidor'
            })
        }
    }

    async register(req: Request, res: Response): Promise<Response> {
        const { nome, email, senha } = req.body;

        try {
            const user = await this.service.registerUser(nome, email, senha);

            return res.status(201).json({
                mensagem: "Usuário criado com sucesso",
                user
            });

        } catch (err) {
            console.error(err);
            
            return res.status(err instanceof AppError ? err.statusCode : 500).json({
                message: err instanceof AppError
                    ? err.message
                    : "Erro interno do servidor"
            });
        }
    }
}