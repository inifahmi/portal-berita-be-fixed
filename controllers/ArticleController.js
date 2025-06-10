// controllers/ArticleController.js

import { Op } from "sequelize";
import { Article, User, Category } from "../models/index.js";

// Fungsi untuk mendapatkan semua artikel (dengan filter)
export const getAllArticles = async (req, res) => {
    try {
        const { status, category, q } = req.query;
        let options = {
            include: [
                {
                    model: User,
                    as: 'author', // Sesuai dengan alias di model/index.js
                    attributes: ['username', 'nama_lengkap']
                },
                {
                    model: Category,
                    attributes: ['name'],
                    through: { attributes: [] } // Jangan tampilkan data dari tabel pivot
                }
            ],
            where: {},
            order: [
                ['published_at', 'DESC'],
                ['createdAt', 'DESC']
            ]
        };

        // Filter berdasarkan status
        if (status) {
            options.where.status = status;
        }

        // Filter berdasarkan kategori
        if (category) {
            options.include[1].where = { name: category };
        }

        // Filter berdasarkan query pencarian (q)
        if (q) {
            options.where[Op.or] = [
                { title: { [Op.like]: `%${q}%` } },
                { content: { [Op.like]: `%${q}%` } }
            ];
        }

        const articles = await Article.findAll(options);
        res.status(200).json(articles);

    } catch (error) {
        console.error("Error saat mengambil artikel:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

// Fungsi untuk membuat artikel baru
export const createArticle = async (req, res) => {
    const { title, content, thumbnail_url, status, category_ids } = req.body;
    // author_id diambil dari user yang sudah login (datanya dari middleware verifyToken)
    const author_id = req.user.id_user; 

    if (!title || !content) {
        return res.status(400).json({ message: "Judul dan konten tidak boleh kosong." });
    }

    try {
        // Buat artikel baru
        const newArticle = await Article.create({
            title,
            content,
            thumbnail_url,
            author_id,
            status: status || 'draft',
            // Jika status 'diterbitkan', set `published_at`
            published_at: status === 'diterbitkan' ? new Date() : null
        });

        // Jika ada category_ids, hubungkan artikel dengan kategori
        if (category_ids && category_ids.length > 0) {
            // Method 'setCategories' otomatis ada dari Sequelize karena relasi Many-to-Many
            await newArticle.setCategories(category_ids);
        }
        
        // Ambil kembali data artikel yang baru dibuat beserta relasinya untuk response
        const result = await Article.findByPk(newArticle.id_article, {
            include: [{ model: Category, through: { attributes: [] } }]
        });

        res.status(201).json({ message: "Artikel berhasil dibuat", data: result });

    } catch (error) {
        console.error("Error saat membuat artikel:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};