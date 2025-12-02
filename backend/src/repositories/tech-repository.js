const prisma = require("../config/db-config");
const CrudRepository = require("./crud-repository");

class TechRepository extends CrudRepository {
    constructor() {
        super(prisma.tech, 'techId');
    }
} 

module.exports = TechRepository;