import express, { request, response } from 'express';
import taskRoute from './routes/tasksRoutes.js'
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();


app.use(express.json());

app.use("/api/tasks", taskRoute)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});




