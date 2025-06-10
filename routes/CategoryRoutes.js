// routes/CategoryRoutes.js

import express from "express";
import { 
    createCategory, 
    getAllCategories, 
    updateCategory, 
    deleteCategory 
} from "../controllers/CategoryController.js";
import { verifyToken, isAdmin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Rute GET untuk semua pengguna (tidak perlu token)
router.get('/categories', getAllCategories);

// Rute POST, PUT, DELETE hanya untuk Admin (perlu token & peran admin)
router.post('/categories', verifyToken, isAdmin, createCategory);
router.put('/categories/:id', verifyToken, isAdmin, updateCategory);
router.delete('/categories/:id', verifyToken, isAdmin, deleteCategory);

export default router;