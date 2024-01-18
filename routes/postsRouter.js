import express from 'express';
import { createPosts } from '../controllers/postsContoller.js';

const postsRouter = express.Router();


postsRouter.post('/posts/upload', createPosts)

export default postsRouter