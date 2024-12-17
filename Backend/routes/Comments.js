import express from 'express';
import Comment from '../models/Comments.js';
import { sequelize } from '../config/db.js'; 

const router = express.Router();

router.post('/', async (req, res) => {
    const { comment, commentedBy, commentedOn, isApproverComment } = req.body;
    
    try {
        const newComment = await Comment.create({
            comment,
            commentedBy,
            commentedOn,
            isApproverComment
        });
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error adding comment' });
    }
});

router.get('/:ideaId', async (req, res) => {
    const ideaId = req.params.ideaId;

    try {
        const comments = await sequelize.query(
            `SELECT c.id, c.comment, c."createdAt", c."updatedAt", c."commentedBy", c."isApproverComment", u.username
            FROM public."Comments" c
            JOIN public."Users" u ON c."commentedBy" = u.id
            WHERE c."commentedOn" = :ideaId`,
            {
                replacements: { ideaId: ideaId },
                type: sequelize.QueryTypes.SELECT
            }
        );

        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
      const deleted = await Comment.destroy({ where: { id } });
      
      if (deleted === 0) {
        return res.status(404).send({ message: 'Comment not found' });
      }
  
      res.status(204).send(); 
    } catch (error) {
      res.status(500).send({ message: 'Error deleting comment', error });
    }
  });
  

export default router;
