import express from 'express';
import { extractSkills, getSkills } from '../controllers/skills.js';
const skillsRouter = express.Router();

skillsRouter.get('/test', (req, res) => {
  res.send('Skills is working properly');
});

skillsRouter.post('/extract', (req, res) => {
  extractSkills(req, res);
});

skillsRouter.post('/get', (req, res) => {
  getSkills(req, res);
})

export default skillsRouter;
