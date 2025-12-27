const { TechRepository, TopicRepository, UserRepository } = require('./src/repositories');
const prisma = require('./src/config/db-config');

async function seedDbms() {
    const techRepo = new TechRepository();
    const topicRepo = new TopicRepository();
    const userRepo = new UserRepository();

    let dbms = await techRepo.findByName('DBMS');
    if (!dbms) {
        dbms = await techRepo.create({ techName: 'DBMS' });
    }

    const adminUser = await userRepo.model.findFirst(); // Just pick any user for now as the creator
    if (!adminUser) {
        console.error('No users found to assign topics to');
        return;
    }

    const topics = [
        'Introduction to DBMS',
        'ER Modeling',
        'Relational Model & Keys',
        'SQL Basics',
        'Advanced SQL',
        'Normalization (1NF, 2NF, 3NF, BCNF)',
        'Transaction Management & ACID',
        'Concurrency Control',
        'Indexing & Hashing',
        'NoSQL Databases'
    ];

    for (const topicName of topics) {
        const existing = await topicRepo.model.findFirst({
            where: {
                name: topicName,
                techId: dbms.techId
            }
        });
        if (!existing) {
            await topicRepo.create({
                name: topicName,
                techId: dbms.techId,
                userId: adminUser.uuid
            });
            console.log(`Created topic: ${topicName}`);
        } else {
            console.log(`Topic already exists: ${topicName}`);
        }
    }

    await prisma.$disconnect();
}

seedDbms();
