const prisma = require("../config/db-config");
const CrudRepository = require("./crud-repository");

class TopicRepository extends CrudRepository {
    constructor() {
        super(prisma.topic, 'topicId');
    }
}

module.exports = TopicRepository;