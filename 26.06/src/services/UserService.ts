import { error } from "console";
import { AppError } from "../errors/error-handler";
import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";

export class UserService {

    private readonly repository = new UserRepository();

    async getAllUser() {
        try {
            const users = await this.repository.findAll();
            return users;
        } catch {
            throw new AppError('Erro ao buscar dados!', 500)
        }
    }

    async registerUser(nome: string, email: string, senha: string) {

        if (!nome || !email || !senha)
            throw new AppError("Todos os campos são obrigatórios!", 400);
    
        const userAlreadyExists = await this.repository.findByEmail(email);
    
        if (userAlreadyExists)
            throw new AppError("Usuário já existe!", 409);
    
        const user = new User(undefined, nome, email, senha);
    
        return await this.repository.create(user);
    }
}