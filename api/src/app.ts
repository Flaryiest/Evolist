import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import api from './routes/api.routes.js';
import auth from './routes/auth.routes.js';
const app = express();
const port = process.env.PORT || 8080;

app.use(cors({ origin: ['*'], credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log('Server is running on port: ' + String(port));
});

app.use('/api', api);
app.use('/auth', auth);

export default app;
