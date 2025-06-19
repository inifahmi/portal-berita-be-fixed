// controllers/UserController.js

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { User, AdminLog} from "../models/index.js"; // Impor dari index model

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

// =======================================================
// FUNGSI KHUSUS ADMIN
// =======================================================

// Fungsi untuk mendapatkan semua pengguna
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            // Jangan sertakan password dalam response demi keamanan
            attributes: ['id_user', 'username', 'nama_lengkap', 'email', 'role', 'createdAt', 'updatedAt']
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Fungsi untuk mengubah peran pengguna
export const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const admin_id = req.user.id_user; // ID admin yang melakukan aksi

    // Validasi peran yang diizinkan
    const allowedRoles = ['admin_utama', 'admin_biasa', 'jurnalis', 'pembaca'];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Peran tidak valid." });
    }

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan." });
        }

        // Admin Utama tidak bisa mengubah perannya sendiri
        if (user.id_user === admin_id) {
            return res.status(403).json({ message: "Tidak dapat mengubah peran diri sendiri." });
        }

        user.role = role;
        await user.save();

        // Catat aksi admin
        await AdminLog.create({
            admin_id,
            action: 'ubah_peran_pengguna',
            note: `Peran pengguna ID ${id} (${user.username}) diubah menjadi ${role}.`
        });

        res.status(200).json({ message: "Peran pengguna berhasil diubah.", data: user });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Fungsi untuk men-suspend (soft delete) pengguna
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const admin_id = req.user.id_user;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan." });
        }

        // Admin Utama tidak bisa men-suspend dirinya sendiri
        if (user.id_user === admin_id) {
            return res.status(403).json({ message: "Tidak dapat men-suspend diri sendiri." });
        }
        
        // Pengguna dengan peran admin_utama tidak bisa di-suspend
        if (user.role === 'admin_utama') {
            return res.status(403).json({ message: "Admin Utama tidak dapat disuspend." });
        }

        await user.destroy(); // Soft delete

        // Catat aksi admin
        await AdminLog.create({
            admin_id,
            action: 'suspend_pengguna',
            note: `Pengguna ID ${id} (${user.username}) telah disuspend.`
        });

        res.status(200).json({ message: "Pengguna berhasil disuspend." });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};