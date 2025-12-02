const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;


function checkPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
}

function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        name: user.name
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw {
            statusCode: StatusCodes.UNAUTHORIZED,
            message: 'Invalid or expired token'
        };
    }   
}

module.exports = {
    checkPassword,
    generateToken,
    verifyToken
};

