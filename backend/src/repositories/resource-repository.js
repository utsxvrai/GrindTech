const prisma = require("../config/db-config");
const CrudRepository = require("./crud-repository");

class ResourceRepository extends CrudRepository {
    constructor() {
        super(prisma.resource, 'rid');
    }
}

module.exports = ResourceRepository;
