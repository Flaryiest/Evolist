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

const synonymModel = z.object({
  synonymFound: z.boolean(),
  synonym: z.string()
});

async function extractSkills(req: Request, res: Response) {
  try {
    if (!req.body.text || !req.body.email) {
      return res
        .status(400)
        .json({ error: 'Missing required parameters: text and email' });
    }

    const completion = await client.beta.chat.completions.parse({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'system',
          content:
            'Based on the following user input, identify a broad skill name and estimate experience points (XP) for that skill. The XP should scale with time spent and difficulty, with difficulty having a slightly lower impact. Roughly adhere to the formula XP=(Hours×10)+(Hours×Difficulty Factor) '
        },
        {
          role: 'user',
          content:
            req.body.text ||
            'No Info provided. Return 10 experience for a skill called failure'
        }
      ],
      temperature: 0,
      response_format: zodResponseFormat(skillModel, 'skillModel')
    });

    const skillResponse = completion.choices[0].message.parsed;

    const user = await db.getUserInfo(req.body.email);
    if (user) {
      const userSkills = user.skills || [];
      const skillNamesString = userSkills.map((skill) => skill.name).join(', ');
      console.log("User's existing skills:", skillNamesString);

      const synonymPrompt = `The user already knows these skills: ${skillNamesString}. 
                              Based on the new task '${req.body.text}', identify if this builds on existing skills or represents a new skill.`;

      const synonymCompletion = await client.beta.chat.completions.parse({
        model: 'gpt-4o-2024-08-06',
        messages: [
          {
            role: 'system',
            content: synonymPrompt
          }
        ],
        temperature: 0,
        response_format: zodResponseFormat(synonymModel, 'synonymModel')
      });

      const synonymResponse = synonymCompletion.choices[0].message.parsed;

      if (!synonymResponse.synonymFound) {
        console.log('New skill');
        await db.createSkill(
          req.body.email,
          skillResponse.name,
          skillResponse.experience
        );
        res.status(200).json({
          message: 'New skill created',
          skill: skillResponse
        });
      } else {
        console.log('Existing skill');
        const existingSkill = userSkills.find(
          (skill) => skill.name === synonymResponse.synonym
        );
        if (existingSkill) {
          await db.updateSkill(
            req.body.email,
            synonymResponse.synonym,
            skillResponse.experience
          );
          res.status(200).json({
            message: 'Existing skill updated',
            skill: {
              name: synonymResponse.synonym,
              experience: skillResponse.experience
            }
          });
        } else {
          console.error('Existing skill not found');
          res.status(400).json({ error: 'Existing skill not found' });
        }
      }
    } else {
      throw new Error('User not found');
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'An error occurred' });
  }
}

export { extractSkills };
