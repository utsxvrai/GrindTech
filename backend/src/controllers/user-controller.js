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
        const start = Date.now();
        // req.auth is populated by Clerk middleware
        const clerkId = req.auth.userId;
        if (!clerkId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
        }
        
        console.log(`[getMe] Fetching/Creating user for clerkId: ${clerkId}`);
        
        // Use upsert to handle get-or-create atomically
        const clerkUser = req.auth;
        const userData = {
            username: clerkUser.sessionClaims?.username || clerkUser.sessionClaims?.email?.split('@')[0] || 'User',
            useremail: clerkUser.sessionClaims?.email || `${clerkId}@temp.com`,
            plan: 'free'
        };

        const result = await UserService.upsertByClerkId(clerkId, userData);
        
        const duration = Date.now() - start;
        console.log(`[getMe] Completed in ${duration}ms for ${clerkId}`);
        
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

async function updateLevelsDone(req, res) {
    try {
        const clerkId = req.auth.userId;
        if (!clerkId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
        }

        const { levelsDone } = req.body;
        if (typeof levelsDone !== 'number' || levelsDone < 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid levelsDone value" });
        }

        const result = await UserService.updateLevelsDone(clerkId, levelsDone);
        return res.status(result.status || StatusCodes.INTERNAL_SERVER_ERROR).json(result);
    } catch (error) {
        console.log("Cannot update levelsDone", error);
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
    updateLevelsDone,
    // signOut
}
