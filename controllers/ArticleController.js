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

// Fungsi untuk mendapatkan satu artikel berdasarkan ID
export const getArticleById = async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['username', 'nama_lengkap']
                },
                {
                    model: Category,
                    attributes: ['id_category', 'name'],
                    through: { attributes: [] }
                }
            ]
        });

        if (!article) {
            return res.status(404).json({ message: "Artikel tidak ditemukan" });
        }

        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Fungsi untuk memperbarui artikel
export const updateArticle = async (req, res) => {
    const { id } = req.params;
    const { title, content, thumbnail_url, status, category_ids } = req.body;

    try {
        const article = await Article.findByPk(id);
        if (!article) {
            return res.status(404).json({ message: "Artikel tidak ditemukan" });
        }
        
        // Cek otorisasi: Hanya penulis asli atau admin yang bisa mengedit
        const currentUser = req.user;
        if (article.author_id !== currentUser.id_user && currentUser.role !== 'admin_utama' && currentUser.role !== 'admin_biasa') {
            return res.status(403).json({ message: "Anda tidak memiliki izin untuk mengedit artikel ini." });
        }

        // Update data artikel
        article.title = title;
        article.content = content;
        article.thumbnail_url = thumbnail_url;
        article.status = status;
        
        // Jika status diubah menjadi 'diterbitkan' untuk pertama kalinya
        if (status === 'diterbitkan' && !article.published_at) {
            article.published_at = new Date();
        }

        await article.save();

        // Update relasi kategori jika ada
        if (category_ids) {
            await article.setCategories(category_ids);
        }
        
        const result = await Article.findByPk(id, {
            include: [{ model: Category, through: { attributes: [] } }]
        });


        res.status(200).json({ message: "Artikel berhasil diperbarui", data: result });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Fungsi untuk menghapus artikel (Soft Delete)
export const deleteArticle = async (req, res) => {
    const { id } = req.params;

    try {
        const article = await Article.findByPk(id);
        if (!article) {
            return res.status(404).json({ message: "Artikel tidak ditemukan" });
        }

        // Cek otorisasi: Hanya penulis asli atau admin yang bisa menghapus
        const currentUser = req.user;
        if (article.author_id !== currentUser.id_user && currentUser.role !== 'admin_utama' && currentUser.role !== 'admin_biasa') {
            return res.status(403).json({ message: "Anda tidak memiliki izin untuk menghapus artikel ini." });
        }

        // Karena kita menggunakan 'paranoid' di model, .destroy() akan melakukan soft delete
        await article.destroy();

        res.status(200).json({ message: "Artikel berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Fungsi untuk menambah view count
export const incrementViewCount = async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);
        if (article) {
            article.view_count += 1;
            await article.save();
            res.status(200).json({ message: "View count berhasil ditambahkan" });
        } else {
            res.status(404).json({ message: "Artikel tidak ditemukan" });
        }
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
};

