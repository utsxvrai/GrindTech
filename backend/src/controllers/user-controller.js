const { UserService } = require("../services");
const { StatusCodes } = require("http-status-codes");
const { clerkClient } = require("@clerk/express");


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
        const clerkId = req.auth.userId;
        if (!clerkId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });
        }
        
        console.log(`[getMe] processing for clerkId: ${clerkId}`);
        
        // 1. Fetch current record from our DB
        const existingUserResult = await UserService.getByClerkId(clerkId);
        let user = existingUserResult.data;
        
        // 2. Fetch latest identity from Clerk API
        // We do this to ensure we have the real name if the DB has "User" or if name changed in Clerk
        let latestClerkUser;
        try {
            latestClerkUser = await clerkClient.users.getUser(clerkId);
        } catch (clerkError) {
            console.error("[getMe] Clerk API call failed:", clerkError);
        }

        const firstName = latestClerkUser?.firstName || '';
        const lastName = latestClerkUser?.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim() || latestClerkUser?.username || latestClerkUser?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'User';
        const useremail = latestClerkUser?.emailAddresses?.[0]?.emailAddress || user?.useremail || `${clerkId}@temp.com`;

        // 3. Update DB if name has changed or if user doesn't exist
        const userData = {
            username: fullName,
            useremail: useremail,
            plan: user?.plan || 'free' // Preserve existing plan
        };

        const result = await UserService.upsertByClerkId(clerkId, userData);
        user = result.data;

        const duration = Date.now() - start;
        console.log(`[getMe] Synced user: ${clerkId} → ${user.username} (UUID: ${user.uuid})`);
        
        return res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            data: user
        });
    } catch (error) {
        console.error("[getMe] Fatal error:", error);
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
