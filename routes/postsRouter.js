import express from 'express';
import { createPosts, deletePost, getPostOfFollowing, likeAndUnlikePost } from '../controllers/postsContoller.js';
import { isAuthenticated } from '../middlewares/isAuthenticated.js';

const postsRouter = express.Router();


postsRouter.post('/post/upload', isAuthenticated , createPosts)
postsRouter.get('/post/likeAndUnlike/:id', isAuthenticated , likeAndUnlikePost)
postsRouter.delete('/post/delete/:id', isAuthenticated , deletePost)
postsRouter.get('/post/' , isAuthenticated , getPostOfFollowing)

export default postsRouter