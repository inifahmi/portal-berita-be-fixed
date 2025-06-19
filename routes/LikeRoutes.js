import express from "express";
import { addLike, removeLike, getLikeCount, checkUserLike } from "../controllers/LikeController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get('/articles/:articleId/likes/count', getLikeCount);
router.get('/users/:userId/likes/:articleId', verifyToken, checkUserLike);
router.post('/likes', verifyToken, addLike);
router.delete('/likes/:articleId', verifyToken, removeLike);

export default router;