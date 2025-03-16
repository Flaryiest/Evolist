import express from 'express';

const auth = express.Router();

auth.get('/test', (req, res) => {
  res.send('Auth is working properly');
});

export default auth;
