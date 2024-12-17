import express from 'express';
import User from '../models/User.js'; 

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { username } }); 

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.password === password) {
      return res.status(200).json({ 
        message: 'Login successful', 
        userId: user.id, 
        username: user.username, 
        name: user.name,
        roleId: user.roleId
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Error logging in' });
  }
});

export default router;
