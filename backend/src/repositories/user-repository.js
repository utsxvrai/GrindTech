const prisma = require("../config/db-config");
const CrudRepository = require("./crud-repository");

class UserRepository extends CrudRepository {
    constructor() {
        super(prisma.user, 'uuid');
    }

    async getUserByEmail(email){
        return await this.model.findUnique({
            where:{
                useremail : email
            }
        })
    }
}


module.exports = UserRepository;
