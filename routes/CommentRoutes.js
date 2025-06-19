import express from "express";
import { getCommentsByArticle, postComment } from "../controllers/CommentController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get('/articles/:id/comments', getCommentsByArticle);
router.post('/comments', verifyToken, postComment);

export default router;