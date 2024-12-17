import express from 'express';
import { sequelize } from '../config/db.js';
import Idea from '../models/Idea.js';
import IdeasWithTags from '../models/IdeasWithTags.js';

const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const { createdBy } = req.query;
        let query = `
            SELECT "Ideas".id, "Ideas".title, "Ideas".description, "Ideas"."createdAt", "Ideas".likes, "Ideas"."deletedStatus", "Ideas"."createdBy", "Users".username 
            FROM public."Ideas"
            INNER JOIN public."Users" ON "Ideas"."createdBy" = "Users".id
            WHERE "Ideas"."deletedStatus" = 1`;        
            
        if (createdBy) {
            query += ` AND "Ideas"."createdBy" = :createdBy `;
        }

        query += ' ORDER BY "Ideas"."createdAt" DESC;';

        
        const deletedIdeas = await sequelize.query(query, {
            replacements: createdBy ? { createdBy } : {},  
            type: sequelize.QueryTypes.SELECT
        });

        if (deletedIdeas.length === 0) {
            return res.status(404).json({ message: 'No deleted ideas found' });
        }
        res.status(200).json(deletedIdeas);
    } catch (error) {
        console.error("Error fetching deleted ideas:", error);
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await IdeasWithTags.destroy({
        where: {
          ideaId: id
        }
      });
  
      const deletedRows = await Idea.destroy({
        where: {
          id: id
        }
      });
      if (deletedRows === 0) {
        return res.status(404).json({ message: 'Idea not found' });
      }
  
      res.status(200).json({ message: 'Idea permanently deleted' });
    } catch (error) {
      console.error('Error in backend deletion:', error);
      res.status(500).json({ error: 'Failed to delete idea' });
    }
  });
  

router.put('/restore/:id', async (req, res) => {
    const { id } = req.params;
    try {
        
        const [updatedRows] = await Idea.update(
            { deletedStatus: 0 },
            { where: { id: id } } 
        );

        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Idea not found or already restored' });
        }

        res.status(200).json({ message: 'Idea restored successfully' });
    } catch (error) {
        console.error('Error restoring idea:', error);
        res.status(500).json({ error: 'Failed to restore idea' });
    }
});
  
export default router;
