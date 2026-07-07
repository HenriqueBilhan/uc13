import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../models/User';

export class NotFoundError extends Error {}

export const UserService = {
   
    async listAll() {
        return UserRepository.findAll();
    },

    async getById(id: number) {
        const user = await UserRepository.findById(id);

        if (!user) {
            throw new NotFoundError('Usuário não encontrado.');
        }

        return user;
    },

    async create(data: { name: string; email: string; password: string }) {
       
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = UserRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
        });

        const savedUser = await UserRepository.save(user);

        
        return omitPassword(savedUser);
    },

    async update(
        id: number,
        data: { name?: string; email?: string; password?: string }
    ) {
        const user = await UserRepository.findById(id);

        if (!user) {
            throw new NotFoundError('Usuário não encontrado.');
        }

        if (data.name) user.name = data.name;
        if (data.email) user.email = data.email;

        if (data.password) {
            user.password = await bcrypt.hash(data.password, 10);
        }

        const updatedUser = await UserRepository.save(user);

        return omitPassword(updatedUser);
    },

    async delete(id: number) {
        const result = await UserRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundError('Usuário não encontrado.');
        }
    },
};

function omitPassword(user: User) {
    const { password, ...rest } = user;
    return rest;
}