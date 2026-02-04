const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.tech.count();
    console.log('Total techs:', count);
    const techs = await prisma.tech.findMany();
    console.log('Tech names:', techs.map(t => t.techName));
  } catch (err) {
    console.error('Error fetching techs:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
