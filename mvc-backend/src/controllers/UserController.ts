import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {

    private service = new UserService();

    createUser(req: Request, res: Response): Response {
        const { id, nome, email } = req.body;

        if (!id || !nome || !email) {
            return res.status(400).json({ mensagem: "Id, nome e email são obrigatórios!" });
        }

        const usuario = this.service.create(id, nome, email);

        return res.status(201).json({
            mensagem: "Usuário criado com sucesso!",
            usuario
        });
    }

    listAllUsers(req: Request, res: Response): Response {
        const users = this.service.findAll();
        return res.status(200).json(users);
    }

    updateUser(req: Request, res: Response): Response {
        const id = Number(req.params.id);
        const { nome, email } = req.body;

        if (!nome || !email) {
            return res.status(400).json({ mensagem: "Nome e email são obrigatórios!" });
        }

        const usuario = this.service.update(id, nome, email);

        if (!usuario) {
            return res.status(404).json({ mensagem: "Usuário não encontrado!" });
        }

        return res.status(200).json({
            mensagem: "Usuário atualizado com sucesso!",
            usuario
        });
    }

    deleteUser(req: Request, res: Response): Response {
        const id = Number(req.params.id);

        const deleted = this.service.delete(id);

        if (!deleted) {
            return res.status(404).json({ mensagem: "Usuário não encontrado!" });
        }

        return res.status(204).send();
    }
}