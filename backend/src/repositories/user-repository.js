const prisma = require("../config/db-config");
const CrudRepository = require("./crud-repository");

class UserRepository extends CrudRepository {
    constructor() {
        super(prisma.user);
    }
}


module.exports = UserRepository;
