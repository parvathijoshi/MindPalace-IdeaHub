import express from 'express';
import { sequelize } from '../config/db.js';

const router = express.Router();

router.get('/categories', async (req, res) => {
  try {
    const categories = await sequelize.query(
      'SELECT * FROM public."Categories"',
      { type: sequelize.QueryTypes.SELECT }
    );
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/categories/:categoryID', async (req, res) => {
  try {
    const { categoryID } = req.params;
    const ideas = await sequelize.query(
      `
      SELECT 
        "Ideas".id, 
        "Ideas".title, 
        "Ideas".description, 
        "Ideas"."createdAt", 
        "Ideas".likes, 
        "Ideas"."isApproved",
        "Users".username
      FROM public."Ideas"
      INNER JOIN public."Users" 
        ON "Ideas"."createdBy" = "Users".id
      INNER JOIN public."IdeasWithTags" 
        ON "IdeasWithTags"."ideaId" = "Ideas".id
      WHERE "IdeasWithTags"."categoryId" = :categoryID
      AND "Ideas"."deletedStatus" = 0
      `,
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { categoryID },
      }
    );

    res.json(ideas);
  } catch (error) {
    console.error("Error fetching ideas:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/categories', async (req, res) => {
  const { name } = req.body;
  const namePattern = /^[A-Za-z\s]+$/;
  if (!name || !namePattern.test(name.trim())) {
    return res.status(400).json({ message: 'Category name is invalid. Only letters and spaces are allowed.' });
  }

  try {
    const existingCategory = await sequelize.query(
      'SELECT * FROM public."Categories" WHERE LOWER(name) = LOWER(:name)',
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: { name: name.trim() },
      }
    );

    if (existingCategory.length > 0) {
      return res.status(400).json({ message: 'Category already exists.' });
    }

    const [newCategory] = await sequelize.query(
      `INSERT INTO public."Categories" (name)
      VALUES (:name)
      RETURNING id, name;`,
      {
        type: sequelize.QueryTypes.INSERT,
        replacements: { name: name.trim() },
      }
    );

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/categories/:categoryID', async (req, res) => {
  const { categoryID } = req.params;

  try {
    await sequelize.query(
      'DELETE FROM public."IdeasWithTags" WHERE "categoryId" = :categoryID',
      {
        type: sequelize.QueryTypes.DELETE,
        replacements: { categoryID },
      }
    );

    await sequelize.query(
      'DELETE FROM public."Categories" WHERE id = :categoryID',
      {
        type: sequelize.QueryTypes.DELETE,
        replacements: { categoryID },
      }
    );

    res.status(200).json({ message: 'Category deleted successfully.' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
