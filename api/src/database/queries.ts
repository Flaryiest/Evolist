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

export { signUp, getUserInfo, createTask, changeTaskStatus };
