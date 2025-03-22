import * as db from '../database/queries.js';
import { Request, Response } from 'express';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const skillModel = z.object({
  name: z.string(),
  experience: z.number()
});
async function extractSkills(req: Request, res: Response) {
  try {
    const completion = await client.beta.chat.completions.parse({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content:
            'Based on the following user input, identify a broad skill name and estimate experience points (XP) for that skill. The XP should scale with time spent and difficulty, with difficulty having a slightly lower impact. Roughly adhere to the formula XP=(Hours×10)+(Hours×Difficulty Factor) '
        },
        { role: 'user', content: 'Style navbar component' }
      ],
      temperature: 0,
      response_format: zodResponseFormat(skillModel, 'skillModel')
    });
    console.log(completion);
    const skillExperience = completion.choices[0].message.parsed;
    console.log(skillExperience);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
}

async function checkSynonyms(req: Request, res: Response) {}

export { extractSkills };
