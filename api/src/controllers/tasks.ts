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
  const response = await db.createTask(req.body.task);
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

export { createTask, changeTaskStatus };
