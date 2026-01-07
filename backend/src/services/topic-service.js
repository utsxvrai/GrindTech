const {TopicRepository} = require("../repositories");
const {StatusCodes} = require("http-status-codes");

const topicRepository = new TopicRepository();

async function create(data){
    try{
        const topic = await topicRepository.create(data);
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
        const topic = await topicRepository.findAll();
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
        const topic = await topicRepository.findById(id);
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
        const topic = await topicRepository.delete(id);
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

async function getByName(name){
    try{
        const topic = await topicRepository.findByName(name);
        if(!topic) {
            return {
                status: StatusCodes.NOT_FOUND,
                error: { message: "Topic not found" }
            }
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

async function getTopicsByTechId(techId){
    try{
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
