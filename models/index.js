// models/index.js (Versi Final Lengkap)

import db from "../config/database.js";

// Impor semua model
import User from "./UserModel.js";
import Article from "./ArticleModel.js";
import Category from "./CategoryModel.js";
import Comment from "./CommentModel.js";
import Like from "./LikeModel.js";
import AdminLog from "./AdminLogModel.js";

// =================================================================
// Definisikan Relasi Antar Tabel
// =================================================================

// 1. User -> Article (One-to-Many)
User.hasMany(Article, { foreignKey: 'author_id', as: 'articles' });
Article.belongsTo(User, { foreignKey: 'author_id', as: 'author' });

// 2. User -> Category (One-to-Many)
User.hasMany(Category, { foreignKey: 'created_by', as: 'created_categories' });
Category.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// 3. Article <-> Category (Many-to-Many)
Article.belongsToMany(Category, { through: 'article_categories', foreignKey: 'article_id', otherKey: 'category_id' });
Category.belongsToMany(Article, { through: 'article_categories', foreignKey: 'category_id', otherKey: 'article_id' });

// 4. User -> Comment (One-to-Many)
User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// 5. Article -> Comment (One-to-Many)
Article.hasMany(Comment, { foreignKey: 'article_id', as: 'comments' });
Comment.belongsTo(Article, { foreignKey: 'article_id', as: 'article' });

// 6. Comment -> Comment (Self-referencing untuk balasan)
Comment.hasMany(Comment, { as: 'replies', foreignKey: 'parent_comment_id', useJunction: false });
Comment.belongsTo(Comment, { as: 'parent', foreignKey: 'parent_comment_id', useJunction: false });

// 7. User <-> Article (Many-to-Many untuk Likes)
User.belongsToMany(Article, { through: Like, foreignKey: 'user_id', as: 'liked_articles' });
Article.belongsToMany(User, { through: Like, foreignKey: 'article_id', as: 'liking_users' });

// 8. User -> AdminLog (One-to-Many)
User.hasMany(AdminLog, { foreignKey: 'admin_id', as: 'admin_logs' });
AdminLog.belongsTo(User, { foreignKey: 'admin_id', as: 'admin' });

// 9. Article -> AdminLog (One-to-Many, opsional)
Article.hasMany(AdminLog, { foreignKey: 'article_id', as: 'logs' });
AdminLog.belongsTo(Article, { foreignKey: 'article_id', as: 'article_log' });


// Ekspor semua model dan koneksi db
export { db, User, Article, Category, Comment, Like, AdminLog };