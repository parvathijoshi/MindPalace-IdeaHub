import express from 'express';
import axios from 'axios';
import { sequelize } from '../config/db.js';  
import IdeasWithTags from '../models/IdeasWithTags.js';
import Category from '../models/Category.js';

const router = express.Router();

const removeHtmlTags = (htmlString) => {
    return htmlString.replace(/<[^>]*>/g, '');
};

const getCategories = async () => {
    return await sequelize.query(
        `SELECT * FROM "Categories"`,
        {
            type: sequelize.QueryTypes.SELECT
        }
    );
};

router.get('/updateTags/:ideaId', async (req, res) => {
    const ideaId = req.params.ideaId;
    try {
        const idea = await sequelize.query(
            `SELECT * FROM "Ideas" WHERE id = :ideaId`,
            {
                replacements: { ideaId },
                type: sequelize.QueryTypes.SELECT
            }
        );

        const categories = await getCategories();

        if (!idea || idea.length === 0) {
            return res.status(404).json({ message: 'Idea not found' });
        }
        const ideaData = idea[0];

        const cleanDescription = removeHtmlTags(ideaData.description);

        const input = {
            id: ideaData.id,
            title: ideaData.title,
            description: cleanDescription, 
            categories: categories.map(category => ({
                id: category.id,
                name: category.name
            }))
        };

        const flaskResponse = await axios.post('http://nlp:5000/classify', input);
        const ideaWithTags = flaskResponse.data.categories.map(category => ({
            ideaId: ideaData.id,
            categoryId: category.id
        }));

        await IdeasWithTags.bulkCreate(ideaWithTags);
        res.status(200).json({
            success: true,
            ideaID: ideaData.id,
            categories: flaskResponse.data.categories
        });

    } catch (error) {
        console.error('Error processing the request:', error);
        res.status(500).json({ message: 'Error processing the request' });
    }
});

router.get('/getTags/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const ideaTags = await IdeasWithTags.findAll({
          where: { ideaId: id },
          attributes: ['categoryId'] 
      });
  
      const categoryIds = ideaTags.map(tag => tag.categoryId);
      const categories = categoryIds.length > 0
          ? await Category.findAll({
              where: { id: categoryIds },
              attributes: ['id', 'name']
            })
          : [];

      res.status(200).json({
          ideaId: id,
          categories: categories
      });
      
  } catch (error) {
      console.error('Error fetching categories for idea:', error);
      res.status(500).json({ error: 'Failed to fetch categories for the idea' });
  }
});

export default router;
