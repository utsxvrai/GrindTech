const {TopicRepository} = require("../repositories");
const {StatusCodes} = require("http-status-codes");
const redis = require("../config/redis-config");

const topicRepository = new TopicRepository();
const CACHE_TTL = 3600; // 1 hour

async function create(data){
    try{
        const topic = await topicRepository.create(data);
        await redis.del("topic:all");
        if (data.techId) await redis.del(`topic:tech:${data.techId}`);
        return{
            status : StatusCodes.CREATED,
            data : topic
        }
    }catch(error){
        return{
            status : StatusCodes.INTERNAL_SERVER_ERROR,
            error
        }
    }
}

async function getAll(){
    try{
        const cached = await redis.get("topic:all");
        if (cached) return { status: StatusCodes.OK, data: cached };

        const topic = await topicRepository.findAll();
        await redis.set("topic:all", topic, { ex: CACHE_TTL });
        return{
            status : StatusCodes.OK,
            data : topic
        }
    }catch(error){
        return{
            status : StatusCodes.INTERNAL_SERVER_ERROR,
            error   
        }
    }
}

async function get(id){
    try{
        const cacheKey = `topic:id:${id}`;
        const cached = await redis.get(cacheKey);
        if (cached) return { status: StatusCodes.OK, data: cached };

        const topic = await topicRepository.findById(id);
        await redis.set(cacheKey, topic, { ex: CACHE_TTL });
        return{
            status : StatusCodes.OK,
            data : topic
        }
    }catch(error){
        return{
            status : StatusCodes.INTERNAL_SERVER_ERROR,
            error   
        }
    }
}


async function update(id,data){
    try{
        const topic = await topicRepository.update(id,data);
        await redis.del("topic:all", `topic:id:${id}`);
        // Invalidate tech-specific topic list if we have the topic
        const updatedTopic = await topicRepository.findById(id);
        if (updatedTopic && updatedTopic.techId) {
            await redis.del(`topic:tech:${updatedTopic.techId}`);
        }
        return{
            status : StatusCodes.OK,
            data : topic
        }
    }catch(error){
        return{
            status : StatusCodes.INTERNAL_SERVER_ERROR,
            error   
        }
    }
}

async function remove(id){
    try{
        const topic = await topicRepository.findById(id);
        const res = await topicRepository.delete(id);
        await redis.del("topic:all", `topic:id:${id}`);
        if (topic && topic.techId) {
            await redis.del(`topic:tech:${topic.techId}`);
        }
        return{
            status : StatusCodes.OK,
            data : res
        }
    }catch(error){
        return{
            status : StatusCodes.INTERNAL_SERVER_ERROR,
            error   
        }
    }

}

async function getByName(name){
    try{
        const cacheKey = `topic:name:${name}`;
        const cached = await redis.get(cacheKey);
        if (cached) return { status: StatusCodes.OK, data: cached };

        const topic = await topicRepository.findByName(name);
        if(!topic) {
            return {
                status: StatusCodes.NOT_FOUND,
                error: { message: "Topic not found" }
            }
        }
        await redis.set(cacheKey, topic, { ex: CACHE_TTL });
        return{
            status : StatusCodes.OK,
            data : topic
        }
    }catch(error){
        return{
            status : StatusCodes.INTERNAL_SERVER_ERROR,
            error   
        }
    }
}

async function getTopicsByTechId(techId){
    try{
        const cacheKey = `topic:tech:${techId}`;
        const cached = await redis.get(cacheKey);
        if (cached) return { status: StatusCodes.OK, data: cached };

        const topics = await topicRepository.findAllByTechId(techId);
        if(!topics) {
            return {
                status: StatusCodes.OK,
                data: []
            }
        }
        
        // Sort by trailing number for DBMS topics (e.g., "Introduction to DBMS 1" -> 1)
        topics.sort((a, b) => {
            const aMatch = a.name.match(/\s(\d+)$/);
            const bMatch = b.name.match(/\s(\d+)$/);
            
            const aNum = aMatch ? parseInt(aMatch[1], 10) : 0;
            const bNum = bMatch ? parseInt(bMatch[1], 10) : 0;
            
            return aNum - bNum;
        });
        
        await redis.set(cacheKey, topics, { ex: CACHE_TTL });
        return{
            status : StatusCodes.OK,
            data : topics
        }
    }catch(error){
        return{
            status : StatusCodes.INTERNAL_SERVER_ERROR,
            error   
        }
    }
}

module.exports = {
    create,
    getAll,
    get,
    getByName,
    getTopicsByTechId,
    update,
    remove
}
