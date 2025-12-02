const {ResourceRepository} = require("../repositories");
const {StatusCodes} = require("http-status-codes");


const resourceRepository = new ResourceRepository();

async function create(data){
    try{
        const resource = await resourceRepository.create(data);
        return resource;
    }catch(error){
        console.log("CanNot create resource",error);
        return error;
    }
}

async function getAll(){
    try{
        const resource = await resourceRepository.findAll();
        return resource;
    }catch(error){
        console.log("CanNot get all resource",error);
        return error;
    }
}

async function get(rid){
    try{
        const resource = await resourceRepository.findById(rid);
        return resource;
    }catch(error){
        console.log("CanNot get resource",error);
        return error;
    }
}

async function update(rid,data){
    try{
        const resource = await resourceRepository.update(rid,data);
        return resource;
    }catch(error){
        console.log("CanNot update resource",error);
        return error;
    }
}

async function remove(rid){
    try{
        const resource = await resourceRepository.delete(rid);
        return resource;
    }catch(error){
        console.log("CanNot remove resource",error);
        return error;
    }
}

module.exports = {
    create,
    getAll,
    get,
    update,
    remove
}


