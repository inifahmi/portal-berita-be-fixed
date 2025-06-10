// controllers/UserController.js

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js"; // Impor dari index model

// Fungsi untuk Registrasi Pengguna
export const register = async (req, res) => {
    // Ambil data dari body request
    const { username, nama_lengkap, email, password, role } = req.body;

    // Lakukan validasi dasar
    if (!username || !nama_lengkap || !email || !password) {
        return res.status(400).json({ message: "Semua kolom harus diisi" });
    }

    try {
        // Cek apakah email atau username sudah terdaftar
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email sudah terdaftar" });
        }
        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
            return res.status(400).json({ message: "Username sudah terdaftar" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Buat user baru di database
        await User.create({
            username,
            nama_lengkap,
            email,
            password: hashedPassword,
            role: role || 'pembaca' // Default role adalah 'pembaca' jika tidak disediakan
        });

        res.status(201).json({ message: "Pendaftaran berhasil!" });

    } catch (error) {
        console.error("Error saat register:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Fungsi untuk Login Pengguna
export const login = async (req, res) => {
    try {
        // Cari pengguna berdasarkan username
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user) {
            return res.status(404).json({ message: "Username tidak ditemukan" });
        }

        // Bandingkan password yang di-request dengan password di database
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Password salah" });
        }

        // Buat payload untuk token JWT
        const payload = {
            id_user: user.id_user,
            username: user.username,
            nama_lengkap: user.nama_lengkap,
            email: user.email,
            role: user.role
        };

        // Buat token JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d' // Token akan kedaluwarsa dalam 1 hari
        });

        // Kirim response berisi token dan data user
        res.status(200).json({
            message: "Login berhasil",
            token,
            user: payload // Frontend Anda mengharapkan objek 'user'
        });

    } catch (error) {
        console.error("Error saat login:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};