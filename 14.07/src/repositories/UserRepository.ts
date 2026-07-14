import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";

const repository = AppDataSource.getRepository(User);

export const UserRepository = {

    async findAll() {
        return repository.find({
            relations: {
                posts: true,
            },
        });
    },

    async findById(id: number) {
        return repository.findOne({
            where: { id },
            relations: {
                posts: true,
            },
        });
    },

    async findByEmail(email: string) {
        return repository.findOne({
            where: { email },
        });
    },

    create(data: Partial<User>) {
        return repository.create(data);
    },

    async save(user: User) {
        return repository.save(user);
    },

    async delete(id: number) {
        return repository.delete(id);
    },
};