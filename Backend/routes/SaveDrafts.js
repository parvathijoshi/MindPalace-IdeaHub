import express from 'express';
import Idea from '../models/Idea.js';

const router = express.Router();

router.put('/submit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        
        const [updatedRows] = await Idea.update(
            { is_draft: false },
            { where: { id: id } } 
        );

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        res.status(200).json({ message: 'Idea submitted successfully!' });
    } catch (error) {
        console.error('Error restoring idea:', error);
        res.status(500).json({ error: 'Failed to restore idea' });
    }
});
  
export default router;
