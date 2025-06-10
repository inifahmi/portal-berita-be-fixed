// routes/ArticleRoutes.js

import express from "express";
import { getAllArticles, createArticle } from "../controllers/ArticleController.js";
import { verifyToken, isJurnalisOrAdmin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Rute untuk mendapatkan semua artikel (Publik)
// Endpoint: GET /api/articles
router.get('/articles', getAllArticles);

// Rute untuk membuat artikel baru (Protected: Hanya Jurnalis atau Admin)
// Endpoint: POST /api/articles
router.post('/articles', verifyToken, isJurnalisOrAdmin, createArticle);


export default router;