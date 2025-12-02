class CrudRepository {
    constructor(model, primaryKey = 'id') {
        this.model = model;
        this.primaryKey = primaryKey;
    }


    async create(data) {
        return await this.model.create({ data });
    }

    async findById(id) {
        return await this.model.findUnique({ where: { [this.primaryKey]: id } });
    }

    async findAll() {
        return await this.model.findMany();
    }

    async update(id, data) {
        return await this.model.update({ where: { [this.primaryKey]: id }, data });
    }

    async delete(id) {
        return await this.model.delete({ where: { [this.primaryKey]: id } });
    }
}

module.exports = CrudRepository;
