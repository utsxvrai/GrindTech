const prisma = require("../config/db-config");
const CrudRepository = require("./crud-repository");

class TechRepository extends CrudRepository {
    constructor() {
        super(prisma.tech, 'techId');
    }
    async findByName(name) {
        return await this.model.findFirst({
            where: {
                techName: {
                    equals: name,
                    mode: 'insensitive'
                }
            }
        });
    }
} 

module.exports = TechRepository;