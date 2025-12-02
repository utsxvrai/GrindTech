const {TopicService} = require("../services");
const {StatusCodes} = require("http-status-codes");

async function create(req,res){
    try{
        const topic = await TopicService.create({
            name : req.body.name,
            techId : req.body.techId,
            userId : req.body.userId

        });
        return res.status(topic.status || StatusCodes.INTERNAL_SERVER_ERROR).json(topic);
    }catch(error){
        console.log("CanNot create topic",error);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

async function getAll(req,res){
    try{
        const topic = await TopicService.getAll();
        return res.status(topic.status || StatusCodes.INTERNAL_SERVER_ERROR).json(topic);
    }catch(error){
        console.log("CanNot get all topic",error);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

async function get(req,res){
    try{
        const topic = await TopicService.get(req.params.id);
        return res.status(topic.status || StatusCodes.INTERNAL_SERVER_ERROR).json(topic);
    }catch(error){
        console.log("CanNot get topic",error);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

async function update(req,res){
    try{
        const topic = await TopicService.update(req.params.id,req.body);
        return res.status(topic.status || StatusCodes.INTERNAL_SERVER_ERROR).json(topic);
    }catch(error){
        console.log("CanNot update topic",error);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

async function remove(req,res){
    try{
        const topic = await TopicService.remove(req.params.id);
        return res.status(topic.status || StatusCodes.INTERNAL_SERVER_ERROR).json(topic);
    }catch(error){
        console.log("CanNot remove topic",error);
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