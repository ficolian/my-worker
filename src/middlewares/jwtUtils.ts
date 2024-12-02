import jwt, { decode, JwtPayload } from 'jsonwebtoken';
import { createRedisClient } from './redisUtils';
import { getUserByEmail } from '../db/user';

export const generateToken = (email: string, env:Record<string,string>) => {
    const payload = ({ email });
    const options = { expiresIn: '1h' };

    return jwt.sign(payload, env.SECRET_KEY, options);
};

export const verifyToken = async (request: Request, env:Record<string,string>): Promise<boolean> => {
    // const SECRET_KEYS : string | = process.env.PASSWORD_KEY
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return false;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return false; // Token is invalid if it's empty
        }

        const decoded = jwt.verify(token, env.SECRET_KEY) as JwtPayload;
        const exp = decoded.exp ? decoded.exp : 1;
        const expirationTimestamp = exp * 1000;
        const currentTimestamp = Date.now();

        if (currentTimestamp > expirationTimestamp) {
            return false; // Token has expired
        }

        const existingUser = await getUserByEmail(decoded['email'], env);
        if (!existingUser) {
            return false; // User doesn't exist or is invalid
        }

        const isBlacklisted = await isTokenBlacklisted(token, env);
        if (isBlacklisted) {
            return false; // Token has been blacklisted
        }

        return true; // Token is valid
    } catch (error) {
        console.error(error);
        return false; // Token is invalid
    }
};
export const blacklistToken = async (jwtToken: string, env: Record<string,string>): Promise<void> => {
    const redis = await createRedisClient(env)
    const blacklistKey = 'jwtBlacklist';
    
    await redis.sadd(blacklistKey, jwtToken);
};

export const isTokenBlacklisted = async (jwtToken: string, env: Record<string,string>): Promise<Number> => {
    const redis = await createRedisClient(env)
    const blacklistKey = 'jwtBlacklist';
    
    const isBlacklisted = await redis.sismember(blacklistKey, jwtToken);

    return isBlacklisted;
};