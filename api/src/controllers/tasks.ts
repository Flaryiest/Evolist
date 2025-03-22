import * as db from '../database/queries.js';
import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

async function createTask(req: Request, res: Response) {
  const response = await db.createTask(req.body);
  if (response) {
    res.status(200).json({"success": true});
  }
  else {
    res.status(400).json('Failed to create task');
  }
}

async function changeTaskStatus(req: Request, res: Response) {
  console.log("testing")
  const response = await db.changeTaskStatus(req.body.taskId, req.body.status);
  console.log(response);
  if (response) {
    res.status(200).json({"success": true});
  } else {
    res.status(400).json('Failed to change status');
  }
}

async function getTasks(req: Request, res: Response) {
  try {
    if (!req.body.email) {
      return res.status(400).json({ error: 'Missing required parameter: email' });
    }

    const tasks = await db.getTasks(req.body.email);
    if (tasks) {
      res.status(200).json({ tasks: tasks });
    } else {
      throw new Error('User not found');
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'An error occurred' });
  }
}

export { createTask, changeTaskStatus, getTasks };
