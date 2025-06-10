// routes/UserRoutes.js

import express from "express";
import { register, login } from "../controllers/UserController.js";

const router = express.Router();

// Rute untuk registrasi
// Method: POST, Endpoint: /api/register
router.post('/register', register);

// Rute untuk login
// Method: POST, Endpoint: /api/login
router.post('/login', login);

export default router;