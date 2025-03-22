import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function clearUsers() {
  try {
    await prisma.skill.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();

    console.log('Successfully cleared all users and related data');
  } catch (error) {
    console.error('Error clearing users:', error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    await clearUsers();

    const skillCategories = await prisma.skillCategories.createMany({
      data: [
        { name: 'Programming' },
        { name: 'Design' },
        { name: 'Language' },
        { name: 'Soft Skills' },
        { name: 'Finance' }
      ],
      skipDuplicates: true
    });
    console.log('Created skill categories');

    const hashedPassword1 = await bcrypt.hash('fire', 10);
    const hashedPassword2 = await bcrypt.hash('spicy', 10);

    const user1 = await prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: hashedPassword1
      }
    });

    const user2 = await prisma.user.create({
      data: {
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        password: hashedPassword2
      }
    });

    console.log('Created users');

    const skillsData = [
      {
        name: 'JavaScript',
        level: 4,
        experience: 20,
        userId: user1.id
      },
      {
        name: 'React',
        level: 3,
        experience: 90,
        userId: user1.id
      },
      {
        name: 'Node.js',
        level: 3,
        experience: 50,
        userId: user1.id
      },

      {
        name: 'UI Design',
        level: 5,
        experience: 920,
        userId: user2.id
      },
      {
        name: 'Figma',
        level: 4,
        experience: 680,
        userId: user2.id
      }
    ];

    for (const skillData of skillsData) {
      await prisma.skill.create({ data: skillData });
    }

    console.log('Created skills');

    const tasksData = [
      {
        title: 'Complete React Project',
        description: 'Finish the dashboard implementation with all components',
        status: false,
        dueDate: '2025-03-25',
        dueTime: '18:00',
        userId: user1.id,
        tags: {
          create: [
            { title: 'High', type: 'Priority' },
            { title: 'Development', type: 'Category' }
          ]
        }
      },
      {
        title: 'Learn GraphQL',
        description: 'Complete the online GraphQL course',
        status: true,
        dueDate: '2025-03-20',
        dueTime: '12:00',
        userId: user1.id,
        tags: {
          create: [
            { title: 'Medium', type: 'Priority' },
            { title: 'Learning', type: 'Category' }
          ]
        }
      },
      {
        title: 'Design Homepage',
        description: 'Create a new homepage design with modern aesthetics',
        status: false,
        dueDate: '2025-03-22',
        dueTime: '15:00',
        userId: user2.id,
        tags: {
          create: [
            { title: 'High', type: 'Priority' },
            { title: 'Design', type: 'Category' }
          ]
        }
      },
      {
        title: 'Client Meeting',
        description: 'Discuss project requirements with the client',
        status: false,
        dueDate: '2025-03-19',
        dueTime: '10:00',
        userId: user2.id,
        tags: {
          create: [
            { title: 'High', type: 'Priority' },
            { title: 'Meeting', type: 'Category' }
          ]
        }
      }
    ];

    for (const taskData of tasksData) {
      await prisma.task.create({
        data: taskData,
        include: { tags: true }
      });
    }

    console.log('Created tasks with tags');
    console.log('Database seeded pog');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  console.log('Starting database initialization...');

  try {
    await seedDatabase();
    console.log('Database initialization completed.');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();
