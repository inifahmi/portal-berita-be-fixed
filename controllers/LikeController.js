// controllers/LikeController.js

import { Like } from "../models/index.js";

// Fungsi untuk menambah like
export const addLike = async (req, res) => {
    try {
        const article_id = req.body.article_id;
        const user_id = req.user.id_user;

        // Cek apakah sudah pernah like sebelumnya
        const existingLike = await Like.findOne({ where: { user_id, article_id } });
        if (existingLike) {
            return res.status(400).json({ message: "Anda sudah menyukai artikel ini." });
        }

        await Like.create({ user_id, article_id });
        res.status(201).json({ message: "Artikel berhasil disukai." });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Fungsi untuk menghapus/membatalkan like
export const removeLike = async (req, res) => {
    try {
        const article_id = req.params.articleId;
        const user_id = req.user.id_user;

        const result = await Like.destroy({ where: { user_id, article_id } });

        if (result === 0) {
            return res.status(404).json({ message: "Like tidak ditemukan." });
        }
        res.status(200).json({ message: "Suka pada artikel dibatalkan." });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Fungsi untuk mendapatkan jumlah like pada artikel
export const getLikeCount = async (req, res) => {
    try {
        const count = await Like.count({ where: { article_id: req.params.articleId } });
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Fungsi untuk mengecek apakah user sudah like artikel tertentu
export const checkUserLike = async (req, res) => {
    try {
        const { userId, articleId } = req.params;
        const like = await Like.findOne({ where: { user_id: userId, article_id: articleId } });
        res.status(200).json({ isLiked: !!like }); // Kirim true jika like ada, false jika tidak
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};