const prisma = require("../config/db-config");
const CrudRepository = require("./crud-repository");

class UserRepository extends CrudRepository {
    constructor() {
        super(prisma.user, 'uuid');
    }

    async getUserByEmail(email) {
        return await this.model.findUnique({
            where: {
                useremail: email
            }
        })
    }

    async getUserByClerkId(clerkId) {
        return await this.model.findUnique({
            where: {
                clerkId: clerkId
            }
        })
    }

    async updatePlan(clerkId, plan) {
        return await this.model.update({
            where: {
                clerkId: clerkId
            },
            data: {
                plan: plan
            }
        })
    }

    async updateLevelsDone(clerkId, levelsDone) {
        return await this.model.update({
            where: {
                clerkId: clerkId
            },
            data: {
                levelsDone: levelsDone
            }
        })
    }

    async upsertUserByClerkId(clerkId, data) {
        return await this.model.upsert({
            where: {
                clerkId: clerkId
            },
            update: data, // Update with same data or just keep existing
            create: {
                ...data,
                clerkId: clerkId
            }
        });
    }
}


module.exports = UserRepository;
