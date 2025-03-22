import * as db from '../database/queries.js';
import { Request, Response } from 'express';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const tagModel = z.object({
  title: z.string(),
  type: z.string()
});

const taskModel = z.object({
  title: z.string(),
  description: z.string(),
  dueDate: z.string(),
  tags: z.array(tagModel)
});

const tasksResponseModel = z.object({
  tasks: z.array(taskModel)
});

async function createTask(req: Request, res: Response) {
  const response = await db.createTask(req.body);
  if (response) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json('Failed to create task');
  }
}

async function changeTaskStatus(req: Request, res: Response) {
  console.log('testing');
  const response = await db.changeTaskStatus(req.body.taskId, req.body.status);
  console.log(response);
  if (response) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json('Failed to change status');
  }
}

async function getTasks(req: Request, res: Response) {
  try {
    if (!req.body.email) {
      return res
        .status(400)
        .json({ error: 'Missing required parameter: email' });
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

async function generateTasks(req: Request, res: Response) {
  try {
    if (!req.body.email) {
      return res
        .status(400)
        .json({ error: 'Missing required parameter: email' });
    }

    const existingTasks = await db.getTasks(req.body.email);

    if (existingTasks) {
      const existingTasksSummary = existingTasks.map((task) => ({
        title: task.title,
        description: task.description,
        tags: task.tags?.map((tag) => tag.title).join(', ') || '',
        isCompleted: task.status
      }));

      const userSkills = (await db.getSkills(req.body.email)) || [];
      const skillsSummary = Array.isArray(userSkills)
        ? userSkills
            .map((skill) => `${skill.name} (Level ${skill.level || 1})`)
            .join(', ')
        : '';

      const avgDescLength =
        existingTasks.reduce(
          (acc, task) => acc + (task.description?.length || 0),
          0
        ) / Math.max(existingTasks.length, 1);

      const avgTagCount =
        existingTasks.reduce((acc, task) => acc + (task.tags?.length || 0), 0) /
        Math.max(existingTasks.length, 1);

      const completionRate =
        existingTasks.length > 0
          ? existingTasks.filter((t) => t.status).length / existingTasks.length
          : 0.5;

      let difficultyLevel = 'moderate';
      if (completionRate > 0.8) difficultyLevel = 'challenging';
      if (completionRate < 0.4) difficultyLevel = 'easier';

      const completion = await client.beta.chat.completions.parse({
        model: 'gpt-4o-2024-08-06',
        messages: [
          {
            role: 'system',
            content: `You are an intelligent task generation assistant. Analyze the user's existing tasks and skills to create 3 new meaningful tasks that are appropriately challenging.
            
            The user has ${existingTasks.length} existing tasks with a completion rate of ${Math.round(completionRate * 100)}%.
            Based on this, generate tasks at a "${difficultyLevel}" difficulty level.
            
            Each task should:
            - Have a clear, specific title
            - Include a detailed description about 100-160 characters long
            - Have a realistic due date (within the next 2 weeks)
            - Include ${Math.ceil(avgTagCount)} relevant tags, each with a title and type ("default" or "primary")
            
            Make tasks contextually relevant to the user's existing tasks and skills.
            
            IMPORTANT: 
            1. Return your response as a JSON object with a 'tasks' array containing exactly 3 tasks.
            2. Each task must have title, description, dueDate and tags properties.
            3. Each tag must have title and type properties.`
          },
          {
            role: 'user',
            content: `Here are my current tasks: 
            ${JSON.stringify(existingTasksSummary, null, 2)}
            
            My skills: ${skillsSummary || 'No specific skills information available'}
            
            Please generate 3 new tasks that would help me make progress and are at an appropriate difficulty level.
            ${req.body.preferences ? `Preferences: ${req.body.preferences}` : ''}`
          }
        ],
        temperature: 0.7,
        response_format: zodResponseFormat(
          tasksResponseModel,
          'tasksResponseModel'
        )
      });

      const generatedTasks = completion.choices[0].message.parsed.tasks;

      const validatedTasks = generatedTasks.slice(0, 3);
      if (validatedTasks.length === 0) {
        throw new Error('Failed to generate valid tasks');
      }

      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
      const formattedDate = oneWeekFromNow.toISOString().split('T')[0];

      const tasksWithUpdatedDates = validatedTasks.map((task) => ({
        ...task,
        dueDate: formattedDate
      }));

      res.status(200).json({
        success: true,
        message: 'Tasks generated successfully',
        tasks: tasksWithUpdatedDates
      });
    } else {
      throw new Error('User not found or no existing tasks');
    }
  } catch (err) {
    console.error('Error generating tasks:', err);
    res
      .status(400)
      .json({
        error: err.message || 'An error occurred while generating tasks'
      });
  }
}

export { createTask, changeTaskStatus, getTasks, generateTasks };
