import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { PostController } from '../controllers/PostController';
import { validateUser } from '../middlewares/validateUser';
import { validatePost } from "../middlewares/validatedPost";
import { asyncHandler } from '../middlewares/asyncHandler';

const routes = Router();
const userController = new UserController();
const postController = new PostController();

routes.get('/users', asyncHandler(userController.list.bind(userController)));
routes.get('/users/:id', asyncHandler(userController.getById.bind(userController)));
routes.post('/users', validateUser, asyncHandler(userController.create.bind(userController)));
routes.put('/users/:id', asyncHandler(userController.update.bind(userController)));
routes.delete('/users/:id', asyncHandler(userController.delete.bind(userController)));

routes.get('/posts', asyncHandler(postController.list.bind(postController)));
routes.get('/posts/:id', asyncHandler(postController.getById.bind(postController)));
routes.post('/posts', validatePost, asyncHandler(postController.create.bind(postController)));
routes.put('/posts/:id', asyncHandler(postController.update.bind(postController)));
routes.delete('/posts/:id', asyncHandler(postController.delete.bind(postController)));

export default routes;