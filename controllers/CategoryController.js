// controllers/CategoryController.js

import { Category, User } from "../models/index.js";

// Fungsi untuk membuat kategori baru
export const createCategory = async (req, res) => {
    const { name } = req.body;
    // Dapatkan ID admin dari token yang sudah diverifikasi
    const created_by = req.user.id_user;

    if (!name) {
        return res.status(400).json({ message: "Nama kategori tidak boleh kosong" });
    }

    try {
        const newCategory = await Category.create({ name, created_by });
        res.status(201).json({ message: "Kategori berhasil ditambahkan", data: newCategory });
    } catch (error) {
        // Handle error jika nama kategori sudah ada (karena UNIQUE constraint)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "Nama kategori sudah ada." });
        }
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Fungsi untuk mendapatkan semua kategori
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            // Sertakan data pembuatnya (hanya username)
            include: {
                model: User,
                as: 'creator',
                attributes: ['username']
            },
            order: [['name', 'ASC']] // Urutkan berdasarkan nama
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Fungsi untuk memperbarui kategori
export const updateCategory = async (req, res) => {
    const { id } = req.params; // Ambil ID dari parameter URL
    const { name } = req.body;

    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Kategori tidak ditemukan" });
        }

        category.name = name;
        await category.save();

        res.status(200).json({ message: "Kategori berhasil diperbarui", data: category });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "Nama kategori sudah ada." });
        }
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Fungsi untuk menghapus kategori
export const deleteCategory = async (req, res) => {
    const { id } = req.params; // Ambil ID dari parameter URL

    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Kategori tidak ditemukan" });
        }

        await category.destroy();

        res.status(200).json({ message: "Kategori berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};