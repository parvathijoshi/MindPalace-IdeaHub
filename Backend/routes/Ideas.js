import express from 'express';
import Idea from '../models/Idea.js'; 
import { sequelize } from '../config/db.js';  

const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const { createdBy, is_draft, isApproved } = req.query; 
        let query = `
            SELECT "Ideas".id, "Ideas".title, "Ideas".description, "Ideas"."createdAt", "Ideas".likes, "Ideas"."createdBy", "Users".username, "Ideas"."is_draft", "Ideas"."isApproved"
            FROM public."Ideas"
            INNER JOIN public."Users" ON "Ideas"."createdBy" = "Users".id
        `;
        const whereConditions = [];
        whereConditions.push(`"Ideas"."deletedStatus" = 0`);
        if (createdBy) {
            whereConditions.push(`"Ideas"."createdBy" = :createdBy`);
        }
        if (is_draft !== undefined) {
            whereConditions.push(`"Ideas"."is_draft" = :is_draft`);
        }
        if (isApproved !== undefined) {
            whereConditions.push(`"Ideas"."isApproved" != :isApproved`);
        }

        if (whereConditions.length > 0) {
            query += ` WHERE ${whereConditions.join(' AND ')}`;
        }
        query += ' ORDER BY "Ideas"."createdAt" DESC;';

        const ideas = await sequelize.query(query, {
            replacements: {
                createdBy: createdBy,
                is_draft: is_draft,
                isApproved: isApproved
            },  
            type: sequelize.QueryTypes.SELECT
        });
        
        res.json(ideas);
    } catch (error) {
        console.error("Error fetching ideas:", error);  
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const ideaId = req.params.id;

        const idea = await Idea.findOne({
            where: { id: ideaId },
        });

        if (idea) {
            res.status(200).json(idea);
        } else {
            res.status(404).json({ message: 'Idea not found.' });
        }
    } catch (error) {
        console.error("Error fetching idea:", error);
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    const { title, description, createdBy, is_draft } = req.body;
    try {
        const newIdea = await Idea.create({ title, description, createdBy, is_draft });
        res.status(201).json(newIdea);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [updatedRowCount] = await Idea.update(
            { deletedStatus: 1 },
            { where: { id: id } }
        );

        if (updatedRowCount === 0) {
            res.status(404).json({ message: 'Idea not found' });
        } else {
            res.status(200).json({ message: 'Idea moved to bin successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error moving the idea to bin', error });
    }
});

router.put('/:id', async (req, res) => { 
    const { id } = req.params;
    const { title, description, createdBy } = req.body;
    try {
        const updated = await Idea.update(
            { title, description, createdBy },
            { where: { id } }
        );
        
        if (updated[0] === 0) {
            return res.status(404).send({ message: 'Idea not found' });
        }

        const updatedIdea = await Idea.findOne({ where: { id } });
        res.send(updatedIdea);
    } catch (error) {
        res.status(500).send({ message: 'Error updating idea', error });
    }
});
  
router.post('/:id/like', async (req, res) => {
    try {
        const ideaId = req.params.id;
        const result = await sequelize.query(`
            UPDATE public."Ideas"
            SET "likes" = "likes" + 1
            WHERE id = :id
        `, {
            replacements: { id: ideaId }
        });
        
        if (result[1].rowCount > 0) {
            res.status(200).json({ message: 'Idea liked successfully.' });
        } else {
            res.status(404).json({ message: 'Idea not found.' });
        }
    } catch (error) {
        console.error("Error liking idea:", error);
        res.status(500).json({ message: error.message });
    }
});

export default router;
