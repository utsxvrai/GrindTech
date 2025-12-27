const { TechRepository } = require('./src/repositories');
const prisma = require('./src/config/db-config');

async function checkTech() {
    const techRepo = new TechRepository();
    const dbms = await techRepo.findByName('DBMS');
    if (dbms) {
        console.log('DBMS tech already exists:', dbms);
    } else {
        console.log('DBMS tech does not exist. Creating...');
        const newTech = await techRepo.create({ techName: 'DBMS' });
        console.log('Created DBMS tech:', newTech);
    }
    await prisma.$disconnect();
}

checkTech();
