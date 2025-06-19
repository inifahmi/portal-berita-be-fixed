// middleware/AuthMiddleware.js

import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    // Ambil header 'authorization'
    const authHeader = req.headers['authorization'];
    // Token ada di header jika formatnya "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        // Jika tidak ada token, kirim response 401 Unauthorized
        return res.status(401).json({ message: "Akses ditolak. Token tidak tersedia." });
    }

    // Verifikasi token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Jika token tidak valid (misal: sudah expired)
            return res.status(403).json({ message: "Token tidak valid." });
        }
        // Jika token valid, simpan payload (data user) ke dalam request
        req.user = decoded;
        next(); // Lanjutkan ke controller/middleware selanjutnya
    });
};

// Middleware tambahan untuk mengecek peran (role)
export const isAdmin = (req, res, next) => {
    // Middleware ini harus dijalankan setelah verifyToken
    if (req.user && (req.user.role === 'admin_utama' || req.user.role === 'admin_biasa')) {
        next();
    } else {
        res.status(403).json({ message: "Akses ditolak. Rute ini hanya untuk Admin." });
    }
};

export const isJurnalisOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin_utama' || req.user.role === 'admin_biasa' || req.user.role === 'jurnalis')) {
        next();
    } else {
        res.status(403).json({ message: "Akses ditolak. Anda bukan Jurnalis atau Admin." });
    }
};

export const isAdminUtama = (req, res, next) => {
    if (req.user && req.user.role === 'admin_utama') {
        next();
    } else {
        res.status(403).json({ message: "Akses ditolak. Rute ini hanya untuk Admin Utama." });
    }
};