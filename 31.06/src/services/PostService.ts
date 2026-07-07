import { PostRepository } from '../repositories/PostRepository';
import { UserRepository } from '../repositories/UserRepository';
import { NotFoundError } from './UserService';

export const PostService = {
    async listAll() {
        return PostRepository.findAll();
    },

    async getById(id: number) {
        const post = await PostRepository.findById(id);

        if (!post) {
            throw new NotFoundError('Post não encontrado.');
        }

        return post;
    },

    async create(data: { title: string; userId: number }) {
        const user = await UserRepository.findById(data.userId);

        if (!user) {
            throw new NotFoundError('Usuário não encontrado.');
        }

        const post = PostRepository.create({ title: data.title, user });
        return PostRepository.save(post);
    },

    async update(id: number, data: { title?: string; userId?: number }) {
        const post = await PostRepository.findById(id);

        if (!post) {
            throw new NotFoundError('Post não encontrado.');
        }

        if (data.title) post.title = data.title;

        if (data.userId) {
            const user = await UserRepository.findById(data.userId);
            if (!user) {
                throw new NotFoundError('Usuário não encontrado.');
            }
            post.user = user;
        }

        return PostRepository.save(post);
    },

    async delete(id: number) {
        const result = await PostRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundError('Post não encontrado.');
        }
    },
};