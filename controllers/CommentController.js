// controllers/CommentController.js

import { Comment, User } from "../models/index.js";

// Helper function untuk membangun struktur pohon komentar
const buildCommentTree = (comments) => {
    const commentsMap = new Map();
    const rootComments = [];

    // Pertama, mapping semua komentar berdasarkan ID nya
    comments.forEach(comment => {
        const commentJSON = comment.toJSON();
        commentJSON.replies = [];
        commentsMap.set(commentJSON.id_comment, commentJSON);
    });

    // Kedua, masukkan setiap balasan ke dalam array 'replies' dari induknya
    commentsMap.forEach(comment => {
        if (comment.parent_comment_id) {
            const parent = commentsMap.get(comment.parent_comment_id);
            if (parent) {
                parent.replies.push(comment);
            }
        } else {
            rootComments.push(comment);
        }
    });
    
    // Urutkan komentar dan balasan dari yang terbaru
    const sortComments = (commentList) => {
        return commentList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(comment => {
            if (comment.replies.length > 0) {
                comment.replies = sortComments(comment.replies);
            }
            return comment;
        });
    };

    return sortComments(rootComments);
};

// Fungsi untuk mendapatkan semua komentar untuk sebuah artikel
export const getCommentsByArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await Comment.findAll({
            where: { article_id: id },
            include: {
                model: User,
                as: 'user',
                attributes: ['username']
            },
            order: [['createdAt', 'DESC']]
        });
        
        // Bangun struktur pohon dari hasil flat array
        const nestedComments = buildCommentTree(comments);
        
        res.status(200).json(nestedComments);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// Fungsi untuk mengirim komentar baru
export const postComment = async (req, res) => {
    try {
        const { article_id, content, parent_comment_id } = req.body;
        const user_id = req.user.id_user;

        if (!content) {
            return res.status(400).json({ message: "Isi komentar tidak boleh kosong." });
        }

        const newComment = await Comment.create({
            article_id,
            user_id,
            content,
            parent_comment_id: parent_comment_id || null
        });

        res.status(201).json({ message: "Komentar berhasil ditambahkan.", data: newComment });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};