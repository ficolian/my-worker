import express from 'express';
import { getUserByEmail, createUser, getUserById, UserModel, updateUserById } from "../db/user";
import { authentication, random } from "../helpers";
import { generateToken, blacklistToken } from '../middlewares/jwtUtils';
import { BadRequest, Fail, InsertSuccess, Success } from '../common/appfunc';

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
            return BadRequest('Missing Parameter');
        }

        const user = await getUserByEmail(email, env);

        if (!user) {
            return Fail('Invalid user');
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash) {
            return Fail('Invalid Password');
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
            token: user.authentication.jwtToken,
            username: user.username
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
            return Fail('Bad Request: Missing required fields');
        }

        const existingUser = await getUserByEmail(email, env);

        if (existingUser) {
            return Fail('Bad Request: User already exists');
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
            return Fail('Bad Request: jwtToken is required');
        }

        await blacklistToken(jwtToken, env);

        return Success('Logged out successfully',null);
    } catch (error) {
        console.error('Error logging out:', error);

        return new Response('Error logging out', { status: 500 });
    }
};
