// models/AdminLogModel.js

import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const AdminLog = db.define('admin_logs', {
    id_log: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    admin_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    article_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    action: {
        type: DataTypes.ENUM(
            'verifikasi_artikel', 'tolak_artikel', 'take_down_artikel', 'hapus_artikel',
            'ubah_peran_pengguna', 'suspend_pengguna', 'hapus_kategori',
            'tambah_kategori', 'ubah_pengaturan_situs', 'backup_data_sistem'
        ),
        allowNull: false
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    freezeTableName: true,
    // ERD Anda memiliki 'timestamp', yang fungsinya sama dengan 'createdAt' Sequelize.
    // Kita akan menggunakan 'createdAt' dan menonaktifkan 'updatedAt'.
    createdAt: 'timestamp',
    updatedAt: false
});

export default AdminLog;