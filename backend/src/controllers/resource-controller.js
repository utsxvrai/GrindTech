const {ResourceService} = require("../services");
const {StatusCodes} = require("http-status-codes");


async function create(req,res){
    try{
        const resource = await ResourceService.create({
            name : req.body.name,
            resource : req.body.resource,
            topicId : req.body.topicId
        });
        return res.status(resource.status || StatusCodes.INTERNAL_SERVER_ERROR).json(resource);
    }catch(error){
        console.log("CanNot create resource",error);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

async function getAll(req,res){
    try{
        const resource = await ResourceService.getAll();
        return res.status(resource.status || StatusCodes.INTERNAL_SERVER_ERROR).json(resource);
    }catch(error){
        console.error("CanNot get all resource", error);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message || "Internal Server Error",
            stack: error.stack,
            error: error
        });
    }
}

async function get(req,res){
    try{
        const resource = await ResourceService.get(req.params.rid);
        return res.status(resource.status || StatusCodes.INTERNAL_SERVER_ERROR).json(resource);
    }catch(error){
        console.log("CanNot get resource",error);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

async function update(req,res){
    try{
        const resource = await ResourceService.update(req.params.rid,req.body);
        return res.status(resource.status || StatusCodes.INTERNAL_SERVER_ERROR).json(resource);
    }catch(error){
        console.log("CanNot update resource",error);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

async function remove(req,res){
    try{
        const resource = await ResourceService.remove(req.params.id);
        return res.status(resource.status || StatusCodes.INTERNAL_SERVER_ERROR).json(resource);
    }catch(error){
        console.log("CanNot remove resource",error);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

module.exports = {
    create,
    getAll,
    get,
    update,
    remove
}

