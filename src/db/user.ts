import {redis} from "../middlewares/redisUtils";
import { toJSON, fromJSON } from "../middlewares/jsonUtils"; // Assuming these methods exist for serialization

export class UserModel{
    constructor(
        public userId: number | null,
        public username: string,
        public email: string,
        public authentication: {
            password: string;
            salt: string;
            jwtToken: string | null;
        }
    ) {}

    toObject(): any {
        return {
            userId: this.userId,
            username: this.username,
            email: this.email,
            authentication: this.authentication
        };
    }

    static fromObject(obj: any): UserModel {
        return new UserModel(
            obj.userId,
            obj.username,
            obj.email,
            obj.authentication
        );
    }
}

export const setUser = async (id: string, user: UserModel): Promise<void> => {
    const key = `user:${id}`;
    await redis.set(key, toJSON(user.toObject())); 
};

export const getUserByEmail = async (email: string): Promise<UserModel | null> => {
    try {
        const keys = await redis.keys(`user:*`);

        for (const key of keys) {
            const userData  = await redis.get(key);
            
            if (userData) {
                const parsedUser = UserModel.fromObject(userData);
                if (parsedUser.email === email) {
                    return parsedUser;
                }
            }
        }
        return null;
    } 
    catch (error) {
        return null;
    }
};

export const deleteUserById = async (id: string): Promise<void> => {
    const key = `user:${id}`;
    await redis.del(key);
};

export const getUserByJwtToken = async (jwtToken: string): Promise<UserModel | null> => {
    const keys = await redis.keys(`user:*`);
    for (const key of keys) {
        const userData = await redis.get(key);
        // Skip if no data found for the key
        if (!userData || typeof userData !== 'string') {
            continue;
        }

        if (userData) {
            const parsedUser = UserModel.fromObject(fromJSON(userData));
            if (parsedUser.authentication.jwtToken === jwtToken) {
                return parsedUser;
            }
        }
    }
    return null;
};

export const getUserById = async (id: string): Promise<UserModel | null> => {
    const key = `user:${id}`;
    const userData = await redis.get(key);
  
    if (!userData || typeof userData !== 'string') {
      return null;
    }
  
    let parsedUser: UserModel | null = null;
    try {
      parsedUser = UserModel.fromObject(fromJSON(userData)); // Assuming fromJSON converts string to object
    } catch (error) {
      console.error(`Failed to parse user data for key ${key}:`, error);
      return null; // Return null if parsing fails
    }
  
    // Return the parsed user
    return parsedUser;
};
  
export const createUser = async (user: UserModel): Promise<void> => {
    const userId = await redis.incr('userIdCounter');
    const key = `user:${userId}`;
    user.userId = userId;
    await redis.sadd('user', user.userId);
    await redis.set(key, JSON.stringify(user.toObject())); 
};

export const updateUserById = async (id: string, updatedValues: Record<string, any>): Promise<void> => {
    const user = await getUserById(id);
    if (user) {
        const updatedUser = { ...user.toObject(), ...updatedValues }; 
        await setUser(id, UserModel.fromObject(updatedUser));
    }
};