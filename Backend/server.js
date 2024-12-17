import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDB } from './config/db.js';
import { insertDefaultRoles, insertDefaultCategories } from './config/initDefaults.js';
import ideasRouter from './routes/Ideas.js';
import loginRouter from './routes/Auth.js';
import commentsRouter from './routes/Comments.js';
import approvalsRouter from './routes/Approvals.js';
import binRouter from './routes/BinPage.js';
import tagsRouter from './routes/TaggingIdeas.js';
import draftsRouter from './routes/SaveDrafts.js';
import groupsRouter from './routes/Groups.js';

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware setup
app.use(cors({
  origin: ['http://mind-palace.online', 'http://localhost:3000', 'http://localhost:5173', 'http://localhost' ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());

// Route handling
app.use('/api/ideas', ideasRouter);
app.use('/api/auth', loginRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/approvals', approvalsRouter);
app.use('/api/bin', binRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/drafts', draftsRouter);
app.use('/api/groups', groupsRouter);

const startServer = async () => {
  try {
    await connectDB(); 
    await insertDefaultRoles(); 
    await insertDefaultCategories(); 

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
};

startServer();
