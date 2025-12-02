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

module.exports = {
    create,
    getAll,
    get,
    update,
    remove
}
