const { TechRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const redis = require("../config/redis-config");

const techRepository = new TechRepository();
const CACHE_TTL = 3600; // 1 hour

async function create(data) {
    try {
        const tech = await techRepository.create(data);
        await redis.del("tech:all");
        return {
            status: StatusCodes.CREATED,
            data: tech
        }
    } catch (error) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error
        }
    }
}

async function getAll() {
    try {
        const cached = await redis.get("tech:all");
        if (cached) return { status: StatusCodes.OK, data: cached };

        const tech = await techRepository.findAll();
        await redis.set("tech:all", tech, { ex: CACHE_TTL });
        return {
            status: StatusCodes.OK,
            data: tech
        }
    } catch (error) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error
        }
    }
}

async function get(id) {
    try {
        const cacheKey = `tech:id:${id}`;
        const cached = await redis.get(cacheKey);
        if (cached) return { status: StatusCodes.OK, data: cached };

        const tech = await techRepository.findById(id);
        await redis.set(cacheKey, tech, { ex: CACHE_TTL });
        return {
            status: StatusCodes.OK,
            data: tech
        }
    } catch (error) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error
        }
    }
}

async function update(id, data) {
    try {
        const tech = await techRepository.update(id, data);
        await redis.del("tech:all", `tech:id:${id}`);
        return {
            status: StatusCodes.OK,
            data: tech
        }
    } catch (error) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error
        }

    }
}

async function remove(id) {
    try {
        const tech = await techRepository.delete(id);
        await redis.del("tech:all", `tech:id:${id}`);
        return {
            status: StatusCodes.OK,
            data: tech
        }
    } catch (error) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error
        }
    }
}


async function getByName(name) {
    try {
        const cacheKey = `tech:name:${name}`;
        const cached = await redis.get(cacheKey);
        if (cached) return { status: StatusCodes.OK, data: cached };

        const tech = await techRepository.findByName(name);
        if (!tech) {
            return {
                status: StatusCodes.NOT_FOUND,
                error: { message: "Tech not found" }
            }
        }
        await redis.set(cacheKey, tech, { ex: CACHE_TTL });
        return {
            status: StatusCodes.OK,
            data: tech
        }
    } catch (error) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error
        }
    }
}

module.exports = {
    create,
    getAll,
    get,
    getByName,
    update,
    remove
}



