import express from 'express';
import { signUp, login } from '../middleware/auth.middle.js';
const auth = express.Router();

auth.get('/test', (req, res) => {
  res.send('Auth is working properly');
});

auth.post('/signup', (req, res) => {
  signUp(req, res);
});

auth.post('/login', (req, res) => {
  login(req, res);
});

export default auth;
