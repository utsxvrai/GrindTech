const {UserService} = require("../services");
const {StatusCodes} = require("http-status-codes");


async function create(req,res){
    try{
        const user = await UserService.create({
            username : req.body.username,
            useremail : req.body.useremail,
            password : req.body.password
        });
        return res.status(user.status || StatusCodes.INTERNAL_SERVER_ERROR).json(user);
    }catch(error){
        console.log("CanNot create user",error);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

async function signin(req,res){
    try{
        const user = await UserService.signin({
            "useremail" : req.body.useremail,
            "password" : req.body.password
        });
        return res.status(user.status || StatusCodes.INTERNAL_SERVER_ERROR).json(user);
    }catch(error){
        console.log("CanNot signin user - Error details:", error);
        console.log("Error message:", error.message);
        console.log("Error stack:", error.stack);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: error.status || StatusCodes.INTERNAL_SERVER_ERROR,
            error: {
                message: error.message || "Internal Server Error",
                details: error
            }
        });
    }
}

async function get(req,res){
    try{
        const user = await UserService.get(req.params.id);
        return res.status(user.status || StatusCodes.INTERNAL_SERVER_ERROR).json(user);
    }catch(error){
        console.log("CanNot get user",error);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

// async function signOut(req, res) {
//     try {
//         const authHeader = req.headers.authorization;
//         if (!authHeader) {
//             return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Authorization header missing' });
//         }
//         await revokeToken(authHeader);
//         res.status(StatusCodes.OK).json({ message: 'Signed out successfully' });
//     } catch (error) {
//         console.error('Error in signOut controller:', error);
//         res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
//     }
// }


module.exports = {
    create,
    signin,
    get,
    // signOut
}
