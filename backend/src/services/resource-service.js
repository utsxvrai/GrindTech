const {ResourceRepository} = require("../repositories");
const {StatusCodes} = require("http-status-codes");


const resourceRepository = new ResourceRepository();

async function create(data){
    try{
        const resource = await resourceRepository.create(data);
        return {
            status: StatusCodes.CREATED,
            data: resource
        };
    }catch(error){
        console.log("CanNot create resource",error);
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error: error
        };
    }
}

async function getAll(){
    try{
        const resource = await resourceRepository.findAll();
        return {
            status: StatusCodes.OK,
            data: resource
        };
    }catch(error){
        console.log("CanNot get all resource",error);
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error: error
        };
    }
}

async function get(rid){
    try{
        const resource = await resourceRepository.findById(rid);
        return {
            status: StatusCodes.OK,
            data: resource
        };
    }catch(error){
        console.log("CanNot get resource",error);
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error: error
        };
    }
}

async function update(rid,data){
    try{
        const resource = await resourceRepository.update(rid,data);
        return {
            status: StatusCodes.OK,
            data: resource
        };
    }catch(error){
        console.log("CanNot update resource",error);
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error: error
        };
    }
}

async function remove(rid){
    try{
        const resource = await resourceRepository.delete(rid);
        return {
            status: StatusCodes.OK,
            data: resource
        };
    }catch(error){
        console.log("CanNot remove resource",error);
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error: error
        };
    }
}

module.exports = {
    create,
    getAll,
    get,
    update,
    remove
}


