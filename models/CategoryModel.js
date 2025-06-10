// models/CategoryModel.js

import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Category = db.define('categories', {
    id_category: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    // created_by akan menjadi foreign key ke users.id_user
    // Kita akan definisikan relasinya nanti.
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true // Bisa jadi null jika kategori dibuat oleh sistem
    }
}, {
    freezeTableName: true
});

export default Category;