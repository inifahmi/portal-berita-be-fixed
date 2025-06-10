// models/LikeModel.js

import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

// Tabel 'likes' tidak memiliki primary key tunggal, melainkan composite key
// dari user_id dan article_id.
const Like = db.define('likes', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    article_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    }
}, {
    freezeTableName: true,
    // Kita tidak butuh kolom 'updatedAt' untuk tabel like
    updatedAt: false
});

export default Like;