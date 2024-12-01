import express from 'express';

import { deleteUser, getUsersById } from '../controllers/user';
import { isAuthenticated } from '../middlewares';
import { update } from 'lodash';
export default (router: express.Router): any => {
    // router.get('/users', isAuthenticated, getAllUsers);
    router.get('/users/:id', isAuthenticated, getUsersById);
    router.delete('/users/:id', deleteUser);
}