import express from 'express';
import { sequelize } from '../config/db.js';

const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const result = await sequelize.query(
      `SELECT "Ideas".id, "Ideas".title, "Ideas".description, "Ideas".likes, "Ideas"."createdAt", 
              "Users".username, "Ideas"."isApproved"
       FROM public."Ideas"
       INNER JOIN public."Users" ON "Ideas"."createdBy" = "Users".id
       WHERE "Ideas".likes > 10 AND "Ideas"."deletedStatus" = 0
       ORDER BY "Ideas"."createdAt" DESC;`,
      { type: sequelize.QueryTypes.SELECT }
    );

    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'No ideas with more than 10 likes.' });
    }
  } catch (error) {
    console.error('Error fetching approval ideas:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/approve/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Update the idea's approval status
    const [updated] = await sequelize.query(
      `UPDATE public."Ideas"
       SET "isApproved" = 1
       WHERE id = :id`,
      { replacements: { id }, type: sequelize.QueryTypes.UPDATE }
    );

    if (updated) {
      res.status(200).json({ message: 'Idea approved successfully!' });
    } else {
      res.status(404).json({ message: 'Idea not found' });
    }
  } catch (error) {
    console.error('Error updating idea approval status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/reject/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [updated] = await sequelize.query(
      `UPDATE public."Ideas"
       SET "isApproved" = 2
       WHERE id = :id`,
      { replacements: { id }, type: sequelize.QueryTypes.UPDATE }
    );

    if (updated) {
      res.status(200).json({ message: 'Idea rejected successfully!' });
    } else {
      res.status(404).json({ message: 'Idea not found' });
    }
  } catch (error) {
    console.error('Error updating idea rejection status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


export default router;
