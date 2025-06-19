// routes/AdminRoutes.js

import express from "express";
import { getDashboardStats } from "../controllers/AdminController.js";
import { verifyToken, isAdmin } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Rute untuk mendapatkan statistik dashboard
// Endpoint: GET /api/admin/stats
router.get('/admin/stats', verifyToken, isAdmin, getDashboardStats);

export default router;