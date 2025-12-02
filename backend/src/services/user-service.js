const {UserRepository} = require("../repositories");
const {StatusCodes} = require("http-status-codes");
const bcrypt = require("bcryptjs");

const userRepository = new UserRepository();


async function create(data){
    try{
        data.password = await bcrypt.hash(data.password, 10);
        const user = await userRepository.create(data);
        return {
            status : StatusCodes.CREATED,
            data : user
        };
    }catch(error){
        return {
            status : StatusCodes.INTERNAL_SERVER_ERROR,
            error
        };
    }
}

module.exports = {
    create
}
