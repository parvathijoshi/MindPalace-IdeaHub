import Role from '../models/Role.js'; 
import Category from '../models/Category.js'; 

const insertDefaultRoles = async () => {
    try {
        const roles = await Role.findAll();
        if (roles.length === 0) {
            await Role.bulkCreate([
                { id: 1, name: 'admin' },
                { id: 2, name: 'user' },
                { id: 3, name: 'reviewer' },
            ]);
            console.log('Default roles inserted');
        }
    } catch (error) {
        console.error('Error inserting default roles:', error);
    }
};

const insertDefaultCategories = async () => {
    try {
        const categories = await Category.findAll();
        if (categories.length === 0) {
            await Category.bulkCreate([
                { id: 1, name: 'Technology' },
                { id: 2, name: 'Finance' },
                { id: 3, name: 'Healthcare' },
                { id: 4, name: 'Education' },
                { id: 5, name: 'Entertainment' },
                { id: 6, name: 'Science' },
                { id: 7, name: 'Environment' },
                { id: 8, name: 'Business' },
                { id: 9, name: 'Lifestyle' },
                { id: 10, name: 'Sports' },
                { id: 11, name: 'Politics' },
                { id: 12, name: 'Travel' },
                { id: 13, name: 'Food' },
                { id: 14, name: 'Art & Culture' },
                { id: 15, name: 'Social Issues' }
            ]);
            console.log('Default categories inserted');
        }
    } catch (error) {
        console.error('Error inserting default categories:', error);
    }
};

export { insertDefaultRoles, insertDefaultCategories };
