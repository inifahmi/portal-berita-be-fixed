// routes/ArticleRoutes.js

import express from "express";
import { 
    getAllArticles, 
    createArticle,
    getArticleById,      // <-- Impor baru
    updateArticle,       // <-- Impor baru
    deleteArticle,       // <-- Impor baru
    incrementViewCount   // <-- Impor baru
} from "../controllers/ArticleController.js";
import { verifyToken, isJurnalisOrAdmin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Rute yang sudah ada
router.get('/articles', getAllArticles);
router.post('/articles', verifyToken, isJurnalisOrAdmin, createArticle);

// =======================================================
// Rute Baru
// =======================================================

// Rute untuk mendapatkan detail artikel berdasarkan ID (Publik)
router.get('/articles/:id', getArticleById);

// Rute untuk menambah view count (Publik, dipanggil saat user membuka detail)
router.patch('/articles/:id/view', incrementViewCount);

// Rute untuk update artikel (Protected: Penulis atau Admin)
router.put('/articles/:id', verifyToken, updateArticle);

// Rute untuk delete artikel (Protected: Penulis atau Admin)
router.delete('/articles/:id', verifyToken, deleteArticle);


export default router;