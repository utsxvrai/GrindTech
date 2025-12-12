const prisma = require("../config/db-config");
const CrudRepository = require("./crud-repository");

class TopicRepository extends CrudRepository {
    constructor() {
        super(prisma.topic, 'topicId');
    }
    async findByName(name) {
        return await this.model.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive'
                }
            },
            include: {
                resources: true,
                questions: true
            }
        });
    }

    async findAllByTechId(techId) {
        return await this.model.findMany({
            where: {
                techId: techId
            },
            include: {
                resources: true,
                questions: true
            }
        });
    }
}

module.exports = TopicRepository;