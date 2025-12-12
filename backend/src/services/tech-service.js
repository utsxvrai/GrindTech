const {TechRepository} = require("../repositories");
const {StatusCodes} = require("http-status-codes");


const techRepository = new TechRepository();

async function create(data){
    try{
        const tech = await techRepository.create(data);
        return{
            status : StatusCodes.CREATED,
            data : tech
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
        const tech = await techRepository.findAll();
        return{
            status : StatusCodes.OK,
            data : tech
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
        const tech = await techRepository.findById(id);
        return{
            status : StatusCodes.OK,
            data : tech
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
        const tech = await techRepository.update(id,data);
        return{
            status : StatusCodes.OK,
            data : tech
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
        const tech = await techRepository.delete(id);
        return{
            status : StatusCodes.OK,
            data : tech
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
        const tech = await techRepository.findByName(name);
        if(!tech){
             return{
                status : StatusCodes.NOT_FOUND,
                error : { message: "Tech not found" }
            }
        }
        return{
            status : StatusCodes.OK,
            data : tech
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
    update,
    remove
}



