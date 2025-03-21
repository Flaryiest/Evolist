import express from 'express';
import { changeTaskStatus, createTask } from '../controllers/tasks.js';
const tasksRouter = express.Router();

tasksRouter.get('/test', (req, res) => {
  res.send('Tasks is working properly');
});

tasksRouter.put('/status', (req, res) => {
  changeTaskStatus(req, res);
});

tasksRouter.post('/create', (req, res) => {
  createTask(req, res);
});

export default tasksRouter;
