import express from 'express';
import { createPosts, likeAndUnlikePost } from '../controllers/postsContoller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const postsRouter = express.Router();


postsRouter.post('/post/upload', isAuthenticated , createPosts)
postsRouter.get('/post/likeAndUnlike/:id', isAuthenticated , likeAndUnlikePost)

export default postsRouter