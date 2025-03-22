import express from 'express';
import {
  changeTaskStatus,
  createTask,
  getTasks,
  generateTasks
} from '../controllers/tasks.js';
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

tasksRouter.post('/get', (req, res) => {
  getTasks(req, res);
});

tasksRouter.post('/generate', (req, res) => {
  generateTasks(req, res);
});

export default tasksRouter;
