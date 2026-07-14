import { AppDataSource } from '../config/data-source';
import { Post } from '../models/Post';

const repository = AppDataSource.getRepository(Post);

export const PostRepository = {
   
  async findAll() {
    return repository.find({
        relations: {
            user: true,
        },
    });
},

async findById(id: number) {
    return repository.findOne({
        where: { id },
        relations: {
            user: true,
        },
    });
},
    create(data: Partial<Post>) {
        return repository.create(data);
    },

    async save(post: Post) {
        return repository.save(post);
    },

    async delete(id: number) {
        return repository.delete(id);
    },
};