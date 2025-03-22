import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

async function signUp(data: Prisma.UserCreateInput) {
  try {
    return await prisma.user.create({ data });
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getUserInfo(email: string) {
  try {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        skills: true,
        tasks: {
          include: {
            tags: true
          }
        }
      }
    });
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function createTask(data: Prisma.TaskCreateInput) {
  try {
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function changeTaskStatus(taskId: number, newStatus: boolean) {
  try {
    return await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus }
    });
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function createSkill(email: string, name: string, experience: number) {
  try {
    return await prisma.skill.create({
      data: {
        name,
        level: 0,
        experience: experience,
        User: {
          connect: { email }
        }
      }
    });
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function updateSkill(email: string, name: string, experienceToAdd: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        skills: {
          where: { name }
        }
      }
    });

    if (!user || !user.skills || user.skills.length === 0) {
      console.log(`Skill "${name}" not found for user ${email}`);
      return false;
    }

    const skill = user.skills[0];

    let newExperience = skill.experience + experienceToAdd;
    let newLevel = skill.level;
    
    while (newExperience >= 100) {
      newLevel += 1;
      newExperience -= 100;
    }

    return await prisma.skill.update({
      where: { 
        id: skill.id 
      },
      data: { 
        experience: newExperience,
        level: newLevel
      }
    });
  } catch (err) {
    console.log('Error updating skill:', err);
    return false;
  }
}

async function getSkills(email: string) {
  try {
    return await prisma.skill.findMany({
      where: { User: { email } }
    });
  } catch (err) {
    console.log(err);
    return false;
  }
}

export {
  signUp,
  getUserInfo,
  createTask,
  changeTaskStatus,
  createSkill,
  updateSkill,
  getSkills
};
