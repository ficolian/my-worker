import express from 'express';

import { deleteUserById, getUserById } from '../db/user';

// export const getAllUsers = async (req: express.Request, res: express.Response): Promise<any> => {
//     try{
//         const users = await getUsers();
//         return res.status(200).json(users);
//     } catch (error){
//         console.log(error);
//         return res.sendStatus(400);
//     }
// }

export const deleteUser = async (req: express.Request, res: express.Response, env: Record<string, string>): Promise<any> => {
    try{
        const {id} = req.params;

        const deletedUser = await deleteUserById(id, env);

        return res.json(deletedUser);
    } catch (error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const getUsersById = async (req: express.Request, res: express.Response, env:Record<string,string>): Promise<any> => {
    try{
        const { id } = req.params;

        const user = await getUserById(id, env);

        return res.status(200).json(user);
    } catch(error) {
        console.log(error);
        return res.sendStatus(400);
    }
}