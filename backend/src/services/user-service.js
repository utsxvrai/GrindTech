const { UserRepository } = require("../repositories");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const { checkPassword, generateToken, revokeToken } = require("../utils/auth");

const userRepository = new UserRepository();


async function create(data) {
    try {
        // Only hash password if provided (for Clerk users, password might not be needed)
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        const user = await userRepository.create(data);
        return {
            status: StatusCodes.CREATED,
            data: user
        };
    } catch (error) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error
        };
    }
}

async function signin(data) {
    try {
        console.log("Signin attempt for email:", data.useremail);
        const user = await userRepository.getUserByEmail(data.useremail);
        console.log("User found:", user ? "Yes" : "No");

        if (!user) {
            return {
                status: StatusCodes.NOT_FOUND,
                message: "User not found"
            };
        }

        const isPasswordValid = await checkPassword(data.password, user.password);
        console.log("Password matched:", isPasswordValid);

        if (!isPasswordValid) {
            return {
                status: StatusCodes.UNAUTHORIZED,
                message: "Invalid password"
            };
        }

        const token = generateToken(user.id);
        console.log("Token generated successfully");

        return {
            status: StatusCodes.OK,
            data: user,
            token
        };
    } catch (error) {
        console.error("Error in signin service:", error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error: {
                message: error.message,
                stack: error.stack
            }
        };
    }
}

async function get(id) {
    try {
        const user = await userRepository.findById(id);
        return {
            status: StatusCodes.OK,
            data: user
        };
    } catch (error) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error
        };
    }
}

async function getByClerkId(clerkId) {
    try {
        const user = await userRepository.getUserByClerkId(clerkId);
        if (!user) {
            return {
                status: StatusCodes.NOT_FOUND,
                message: "User not found"
            };
        }
        return {
            status: StatusCodes.OK,
            data: user
        };
    } catch (error) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error
        };
    }
}

async function getAll() {
    try {
        const users = await userRepository.findAll();
        return {
            status: StatusCodes.OK,
            data: users
        };
    } catch (error) {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error
        };
    }
}

// async function signout(token){
//     try{
//         if(!token){
//             return {
//                 status : StatusCodes.BAD_REQUEST,
//                 message : "Token is required"
//             };
//         }

//         // Revoke the token
//         revokeToken(token);

//         return {
//             status : StatusCodes.OK,
//             message : "Signed out successfully"
//         };
//     }catch(error){
//         console.error("Error in signout service:", error);
//         return {
//             status : StatusCodes.INTERNAL_SERVER_ERROR,
//             error: {
//                 message: error.message || "Failed to sign out"
//             }
//         };
//     }
// }\r

async function updatePlan(clerkId, plan) {
    try {
        if (!['free', 'pro'].includes(plan)) {
            return {
                status: StatusCodes.BAD_REQUEST,
                message: "Invalid plan type. Must be 'free' or 'pro'"
            };
        }

        const user = await userRepository.updatePlan(clerkId, plan);
        return {
            status: StatusCodes.OK,
            data: user
        };
    } catch (error) {
        console.error("Error updating plan:", error);
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            error
        };
    }
}

module.exports = {
    create,
    signin,
    // signout,
    get,
    getByClerkId,
    getAll,
    updatePlan
}
