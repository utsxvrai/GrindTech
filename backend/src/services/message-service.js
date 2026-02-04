const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

class MessageService {
    async createMessage(data) {
        return await prisma.interviewMessage.create({
            data: {
                content: data.content,
                company: data.company,
                userId: data.userId,
                techId: data.techId
            },
            include: {
                user: {
                    select: {
                        username: true,
                        uuid: true
                    }
                }
            }
        });
    }

    async getRecentMessages(techId, limit = 50) {
        return await prisma.interviewMessage.findMany({
            where: {
                techId: techId
            },
            take: limit,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        username: true,
                        uuid: true
                    }
                }
            }
        });
    }
}

module.exports = new MessageService();
