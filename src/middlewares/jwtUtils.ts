import jwt, { decode, JwtPayload } from 'jsonwebtoken';
import express from 'express';
import { redis } from './redisUtils';
import { getUserByEmail } from '../db/user';

// Load .env variables into process.env
const SECRET_KEY = 'your-secret-key';

export const generateToken = (email: string) => {
    const payload = ({ email });
    const options = { expiresIn: '1h' };

    return jwt.sign(payload, SECRET_KEY, options);
};

// Function to verify a JWT token

export const verifyToken = async (request: Request): Promise<boolean> => {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return false;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return false; // Token is invalid if it's empty
        }

        // Verify the token with the secret key
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
        const exp = decoded.exp ? decoded.exp : 1;
        const expirationTimestamp = exp * 1000;
        const currentTimestamp = Date.now();

        if (currentTimestamp > expirationTimestamp) {
            return false; // Token has expired
        }

        // Get the user associated with the token
        const existingUser = await getUserByEmail(decoded['email']);
        if (!existingUser) {
            return false; // User doesn't exist or is invalid
        }

        const isBlacklisted = await isTokenBlacklisted(token);
        if (isBlacklisted) {
            return false; // Token has been blacklisted
        }

        return true; // Token is valid
    } catch (error) {
        console.error(error);
        return false; // Token is invalid
    }
};
export const blacklistToken = async (jwtToken: string): Promise<void> => {
    const blacklistKey = 'jwtBlacklist';
    
    await redis.sadd(blacklistKey, jwtToken);
};

export const isTokenBlacklisted = async (jwtToken: string): Promise<Number> => {
    const blacklistKey = 'jwtBlacklist';
    
    const isBlacklisted = await redis.sismember(blacklistKey, jwtToken);

    return isBlacklisted;
};