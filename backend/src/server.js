import express, { request, response } from 'express';
import taskRoute from './routes/tasksRoutes.js'
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

connectDB();
app.use("/api/tasks", taskRoute)
app.listen(5001, () => {
  console.log('Server is running on port 5001');
});

 