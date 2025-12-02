const {QuestionRepository} = require("../repositories");
const {StatusCodes} = require("http-status-codes");


const questionRepository = new QuestionRepository();

async function create(data){
    try{
        const question = await questionRepository.create(data);
        return {
            status : StatusCodes.CREATED,
            data : question
        };
    }catch(error){
        return {
            status : StatusCodes.INTERNAL_SERVER_ERROR,
            error
        };
    }
}

async function get(qid){
    try{
        const question = await questionRepository.findById(qid);
        return {
            status : StatusCodes.OK,
            data : question
        };
    }catch(error){
        return {
            status : StatusCodes.INTERNAL_SERVER_ERROR,
            error
        };
    }
}

async function getAll(){
    try{
        const questions = await questionRepository.getAll();
        return {
            status : StatusCodes.OK,
            data : questions
        };
    }catch(error){
        return {
            status : StatusCodes.INTERNAL_SERVER_ERROR,
            error
        };
    }
}


async function update(qid,data){
    try{
        const question = await questionRepository.update(qid,data);
        return {
            status : StatusCodes.OK,
            data : question
        };
    }catch(error){
        return {
            status : StatusCodes.INTERNAL_SERVER_ERROR,
            error
        };
    }
}

async function remove(qid){
    try{
        const question = await questionRepository.delete(qid);
        return {
            status : StatusCodes.OK,
            data : question
        };
    }catch(error){
        return {
            status : StatusCodes.INTERNAL_SERVER_ERROR,
            error
        };
    }
}

module.exports = {
    create,
    get,
    getAll,
    update,
    remove
}
