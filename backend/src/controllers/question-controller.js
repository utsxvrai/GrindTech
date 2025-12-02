const {QuestionService} = require("../services");
const {StatusCodes} = require("http-status-codes");

async function create(req,res){
    try{
        const question = await QuestionService.create({
            question : req.body.question,
            topicId : req.body.topicId,
            userId : req.body.userId
        })
        return res.status(StatusCodes.CREATED).json(question);
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

async function getAll(req,res){
    try{
        const questions = await QuestionService.getAll();
        return res.status(StatusCodes.OK).json(questions);
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}


async function get(req,res){
    try{
        const question = await QuestionService.get(req.params.id);
        return res.status(StatusCodes.OK).json(question);
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

async function update(req,res){
    try{
        const question = await QuestionService.update(req.params.id, req.body);
        return res.status(StatusCodes.OK).json(question);
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

async function remove(req,res){
    try{
        const question = await QuestionService.remove(req.params.id);
        return res.status(StatusCodes.OK).json(question);
    }catch(error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

module.exports = {
    create,
    getAll,
    get,
    update,
    remove
}