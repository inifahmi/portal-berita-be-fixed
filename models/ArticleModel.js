// models/ArticleModel.js

import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Article = db.define('articles', {
    id_article: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING, // VARCHAR(255) adalah default
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT('long'), // Menggunakan LONGTEXT
        allowNull: false
    },
    thumbnail_url: {
        type: DataTypes.STRING
    },
    // author_id akan menjadi foreign key ke users.id_user
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('draft', 'menunggu', 'ditolak', 'diterbitkan', 'take_down'),
        allowNull: false,
        defaultValue: 'draft'
    },
    view_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    published_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    // Untuk soft delete, kita akan menggunakan fitur 'paranoid' dari Sequelize
}, {
    freezeTableName: true,
    paranoid: true, // Ini akan membuat kolom 'deletedAt' secara otomatis
    // dan menangani soft delete
    deletedAt: 'deleted_at' // Menyesuaikan nama kolom sesuai ERD
});

export default Article;