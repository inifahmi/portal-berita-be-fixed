// models/CommentModel.js

import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Comment = db.define('comments', {
    id_comment: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    // Foreign Key ke articles
    article_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // Foreign Key ke users
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    // Foreign Key ke comments (dirinya sendiri) untuk balasan
    parent_comment_id: {
        type: DataTypes.INTEGER,
        allowNull: true // NULL jika ini adalah komentar utama
    }
}, {
    freezeTableName: true
});

export default Comment;