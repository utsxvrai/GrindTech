const prisma = require("../config/db-config");
const CrudRepository = require("./crud-repository");

class QuestionRepository extends CrudRepository {
    constructor() {
        super(prisma.question, 'qid');
    }
}

module.exports = QuestionRepository;