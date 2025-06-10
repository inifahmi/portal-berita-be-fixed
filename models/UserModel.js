// models/UserModel.js

import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const User = db.define('users', {
    // Sesuai dengan ERD: id_user (PK, INT, AUTO_INCREMENT)
    id_user: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    // Sesuai dengan ERD: username (VARCHAR(50), UNIQUE, NOT NULL)
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    // Sesuai dengan ERD: nama_lengkap (VARCHAR(100), NOT NULL)
    nama_lengkap: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    // Sesuai dengan ERD: email (VARCHAR(100), UNIQUE, NOT NULL)
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true // Validasi format email
        }
    },
    // Sesuai dengan ERD: password_hash (VARCHAR(255), NOT NULL)
    // Di aplikasi, kita akan menyebutnya 'password' agar lebih umum.
    // Proses hashing (menjadi 'password_hash') akan dilakukan di controller.
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    // Sesuai dengan ERD: role (ENUM(...), NOT NULL)
    role: {
        type: DataTypes.ENUM('admin_utama', 'admin_biasa', 'jurnalis', 'pembaca'),
        allowNull: false
    }
    // Kolom created_at dan updated_at akan dibuat otomatis oleh Sequelize
    // karena 'timestamps: true' adalah default.
}, {
    // Opsi tambahan untuk model
    freezeTableName: true // Mencegah Sequelize mengubah nama tabel menjadi jamak
});

export default User;