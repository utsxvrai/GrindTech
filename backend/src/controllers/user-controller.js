const {UserService} = require("../services");
const {StatusCodes} = require("http-status-codes");


async function create(req,res){
    try{
        const user = await UserService.create({
            username : req.body.username,
            useremail : req.body.useremail,
            password : req.body.password
        });
        return res.status(user.status || StatusCodes.INTERNAL_SERVER_ERROR).json(user.data);
    }catch(error){
        console.log("CanNot create user",error);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}


module.exports = {
    create
}
