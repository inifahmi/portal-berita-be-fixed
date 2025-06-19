// controllers/AdminController.js

import { User, Article, AdminLog } from "../models/index.js";
import { Op } from "sequelize";

// Fungsi untuk mendapatkan statistik dashboard
export const getDashboardStats = async (req, res) => {
    try {
        // Mendapatkan awal hari ini
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // Menjalankan semua query count secara paralel
        const [totalUsers, totalArticles, pendingReviews, todayActivity] = await Promise.all([
            // Hitung total semua pengguna
            User.count(),
            // Hitung total semua artikel (termasuk yang di-soft-delete)
            Article.count({ paranoid: false }),
            // Hitung artikel yang menunggu review
            Article.count({ where: { status: 'menunggu' } }),
            // Hitung aktivitas hari ini (log admin yang dibuat hari ini)
            AdminLog.count({
                where: {
                    timestamp: {
                        [Op.gte]: startOfDay
                    }
                }
            })
        ]);

        // Kirim hasil sebagai response
        res.status(200).json({
            totalUsers,
            totalArticles,
            pendingReviews,
            todayActivity
        });

    } catch (error) {
        console.error("Error saat mengambil statistik dashboard:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};