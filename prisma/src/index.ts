import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
    },
  });
  console.log(user);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
