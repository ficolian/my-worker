import express from 'express';
import { getUserByEmail, createUser, getUserById, UserModel, updateUserById } from "../db/user";
import { authentication, random } from "../helpers";
import { generateToken, blacklistToken } from '../middlewares/jwtUtils';
import { InsertSuccess, Success } from '../common/appfunc';

interface registerRequest {
    email: string;
    password: string;
    username: string;
}

export const login = async (request: Request, env:Record<string,string>): Promise<Response> => {
    try {
        const { email, password }: { email: string, password: string } = await request.json();
        console.log(email);
        if (!email || !password) {
            return new Response('Bad Request', { status: 400 });
        }

        const user = await getUserByEmail(email, env);

        if (!user) {
            return new Response('Invalid user', { status: 400 });
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash) {
            return new Response('Invalid Password', { status: 403 });
        }

        const token = generateToken(user.email, env);
        user.authentication.jwtToken = token;

        await updateUserById(String(user.userId), user, env)
            .then(() => {
                console.log('User updated successfully');
            })
            .catch((error) => {
                console.error('Error updating user:', error);
            });
        
        const userResponse = {
            email : user.email,
            token: user.authentication.jwtToken
        };
        
        return Success('Login is successfull', userResponse)
    } catch (error) {
        console.log(error);
        return new Response('Internal Server Error', { status: 500 });
    }
};


export const register = async (request: Request, env:Record<string,string>): Promise<Response> => {
    try {
        const { email, password, username }: registerRequest = await request.json();

        if (!email || !password || !username) {
            return new Response('Bad Request: Missing required fields', { status: 400 });
        }

        const existingUser = await getUserByEmail(email, env);

        if (existingUser) {
            return new Response('Bad Request: User already exists', { status: 400 });
        }

        const salt = random();  // Ensure you have a proper implementation of 'random()'

        const user = new UserModel(
            null, 
            username, 
            email, 
            {
                password: authentication(salt, password),
                salt: salt,
                jwtToken: null
            }
        );

        await createUser(user, env);

        return InsertSuccess("User")
    } catch (error) {
        console.error('Error during registration:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};

export const logout = async (request: Request, env: Record<string,string>): Promise<Response> => {
    try {
        const { jwtToken }: { jwtToken: string } = await request.json();

        if (!jwtToken) {
            return new Response('Bad Request: jwtToken is required', { status: 400 });
        }

        await blacklistToken(jwtToken, env);

        return new Response('Logged out successfully', { status: 200 });
    } catch (error) {
        console.error('Error logging out:', error);

        return new Response('Error logging out', { status: 500 });
    }
};
