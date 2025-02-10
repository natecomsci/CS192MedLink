import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed Managers
  const managers = await prisma.manager.createMany({
    data: Array.from({ length: 10 }, () => ({
      name: faker.person.fullName(),
      password: faker.internet.password(),
    })),
  });

  // Seed Admins
  const admins = await prisma.admin.createMany({
    data: Array.from({ length: 10 }, () => ({
      name: faker.person.fullName(),
      password: faker.internet.password(),
    })),
  });

  // Seed Users
  const users = await prisma.user.createMany({
    data: Array.from({ length: 10 }, () => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    })),
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
