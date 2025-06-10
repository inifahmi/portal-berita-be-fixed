// server.js (versi final setelah refaktor)

import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import UserRoutes from './routes/UserRoutes.js';
import ArticleRoutes from './routes/ArticleRoutes.js';
import CategoryRoutes from './routes/CategoryRoutes.js';

// Impor koneksi db dari models/index.js yang sudah terkonfigurasi
import { db } from "./models/index.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Fungsi untuk menguji koneksi dan sinkronisasi database
const startServer = async () => {
    try {
        // Cukup panggil db.authenticate() karena model sudah terdefinisi
        // dan terasosiasi saat diimpor dari models/index.js
        await db.authenticate();
        console.log("Koneksi database berhasil.");
        
        // Sinkronkan semua model yang terdefinisi dengan database
        // PERHATIAN: Gunakan { alter: true } dalam pengembangan agar tidak error
        // saat mengubah model, tapi jangan gunakan di produksi.
        await db.sync(); 
        console.log("Semua model telah disinkronkan.");

    } catch (error) {
        console.error("Gagal terhubung atau sinkronisasi dengan database:", error);
    }
};

// Middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());

//Gunakan rute
app.use('/api', UserRoutes);
app.use('/api', ArticleRoutes);
app.use('/api', CategoryRoutes);

// Rute dasar untuk pengujian
app.get("/", (req, res) => {
    res.send("Server Backend Portal Berita Aktif!");
});


// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    startServer();
});