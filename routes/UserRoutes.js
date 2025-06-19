// routes/UserRoutes.js

import express from "express";
import { 
    register, 
    login,
    getAllUsers,      
    updateUserRole,   
    deleteUser        
} from "../controllers/UserController.js";
import { verifyToken, isAdminUtama } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Rute untuk registrasi
// Method: POST, Endpoint: /api/register
router.post('/register', register);

// Rute untuk login
// Method: POST, Endpoint: /api/login
router.post('/login', login);

// =======================================================
// RUTE MANAJEMEN PENGGUNA (HANYA ADMIN UTAMA)
// =======================================================

router.get('/users', verifyToken, isAdminUtama, getAllUsers);
router.patch('/users/:id/role', verifyToken, isAdminUtama, updateUserRole);
router.delete('/users/:id', verifyToken, isAdminUtama, deleteUser);

export default router;