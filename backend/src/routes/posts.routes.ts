import { Router } from 'express';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
} from '../controllers/posts.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const postsRouter = Router();

postsRouter.use(authMiddleware);

postsRouter.get('/', getPosts);
postsRouter.get('/:id', getPost);
postsRouter.post('/', createPost);
postsRouter.put('/:id', updatePost);
postsRouter.delete('/:id', deletePost);
