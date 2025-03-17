import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as db from '../database/queries.js';
import { Request, Response, NextFunction } from 'express';

async function signUp(req: Request, res: Response) {
  bcrypt.hash(req.body.password, 10, async function (err, hash) {
    if (err) {
      console.error(err, 'error');
      return res.status(500).send('Internal server error');
    }
    const response = await db.signUp({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash
    });
    if (response) {
      res.status(200).send('Successfully signed up user');
    } else {
      res.status(200).send('Failed to sign up user');
    }
  });
}

async function login(req: Request, res: Response) {
  const userInfo = await db.getUserInfo(req.body.email);
  if (!userInfo) {
    return res.status(401).send('Invalid email or password');
  }

  bcrypt.compare(req.body.password, userInfo.password, function (err, result) {
    if (err) {
      console.log(err, 'error');
      return res.status(400).send();
    }
    if (result) {
      jwt.sign(
        { userInfo },
        process.env.SECRET_KEY,
        { expiresIn: '10000s' },
        (err: any, token: any) => {
          if (err) {
            console.log(err);
            return res.status(400).send();
          }

          return res
            .status(200)
            .cookie('jwt', token, {
              sameSite: 'none',
              secure: true,
              path: '/',
              httpOnly: true,
              expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
              partitioned: false
            })
            .send('Authentication successful');
        }
      );
    } else {
      return res.status(401).send('Invalid email or password');
    }
  });
}

async function verifyToken(req: Request, res: Response, next: NextFunction) {}

export { signUp, login, verifyToken };
