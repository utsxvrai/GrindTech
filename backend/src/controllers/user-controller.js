const { UserService } = require("../services");
const { StatusCodes } = require("http-status-codes");


async function create(req, res) {
    try {
        const user = await UserService.create({
            username: req.body.username,
            useremail: req.body.useremail,
            password: req.body.password
        });
        return res.status(user.status || StatusCodes.INTERNAL_SERVER_ERROR).json(user);
    } catch (error) {
        console.log("CanNot create user", error);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

async function signin(req, res) {
    try {
        const user = await UserService.signin({
            "useremail": req.body.useremail,
            "password": req.body.password
        });
        return res.status(user.status || StatusCodes.INTERNAL_SERVER_ERROR).json(user);
    } catch (error) {
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

async function get(req, res) {
    try {
        const user = await UserService.get(req.params.id);
        return res.status(user.status || StatusCodes.INTERNAL_SERVER_ERROR).json(user);
    } catch (error) {
        console.log("CanNot get user", error);
        return res.status(error.status || StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

async function getMe(req, res) {
    try {
        // req.auth is populated by Clerk middleware
        const clerkId = req.auth.userId;
        if (!clerkId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
        }
        
        let result = await UserService.getByClerkId(clerkId);
        
        // If user not found, create them automatically
        if (result.status === StatusCodes.NOT_FOUND) {
            console.log(`User not found for clerkId: ${clerkId}, creating...`);
            
            // Get user info from Clerk (req.auth contains basic info)
            const clerkUser = req.auth;
            
            // Create user with default values
            const createResult = await UserService.create({
                clerkId: clerkId,
                username: clerkUser.sessionClaims?.username || clerkUser.sessionClaims?.email?.split('@')[0] || 'User',
                useremail: clerkUser.sessionClaims?.email || `${clerkId}@temp.com`,
                plan: 'free'
            });
            
            if (createResult.status === StatusCodes.CREATED) {
                result = createResult;
            } else {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to create user" });
            }
        }
        
        return res.status(result.status || StatusCodes.INTERNAL_SERVER_ERROR).json(result);
    } catch (error) {
        console.log("Cannot get current user", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}

async function getAll(req, res) {
    try {
        const users = await UserService.getAll();
        return res.status(users.status || StatusCodes.INTERNAL_SERVER_ERROR).json(users);
    } catch (error) {
        console.log("CanNot get all users", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
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
// }\r


async function upgradeToPro(req, res) {
    try {
        // req.auth is populated by Clerk middleware
        const clerkId = req.auth.userId;
        if (!clerkId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
        }

        const result = await UserService.updatePlan(clerkId, 'pro');
        return res.status(result.status || StatusCodes.INTERNAL_SERVER_ERROR).json(result);
    } catch (error) {
        console.log("Cannot upgrade to pro", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}


module.exports = {
    create,
    signin,
    get,
    getMe,
    getAll,
    upgradeToPro,
    // signOut
}
