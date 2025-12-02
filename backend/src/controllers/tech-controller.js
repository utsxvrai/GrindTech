const {TechService} = require("../services");
const {StatusCodes} = require("http-status-codes");


async function create(req,res){
    try{
        const tech = await TechService.create({
            techName : req.body.techName
        });
        return res.status(tech.status || StatusCodes.INTERNAL_SERVER_ERROR).json(tech);
    }catch(error){
        console.log("CanNot create tech",error);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

async function getAll(req,res){
    try{
        const tech = await TechService.getAll();
        return res.status(tech.status || StatusCodes.INTERNAL_SERVER_ERROR).json(tech);
    }catch(error){
        console.log("CanNot get all tech",error);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

async function get(req,res){
    try{
        const tech = await TechService.get(req.params.id);
        return res.status(tech.status || StatusCodes.INTERNAL_SERVER_ERROR).json(tech);
    }catch(error){
        console.log("CanNot get tech",error);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

async function update(req,res){
    try{
        const tech = await TechService.update(req.params.id,req.body);
        return res.status(tech.status || StatusCodes.INTERNAL_SERVER_ERROR).json(tech);
    }catch(error){
        console.log("CanNot update tech",error);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

async function remove(req,res){
    try{
        const tech = await TechService.remove(req.params.id);
        return res.status(tech.status || StatusCodes.INTERNAL_SERVER_ERROR).json(tech);
    }catch(error){
        console.log("CanNot remove tech",error);
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