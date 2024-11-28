import { createUser, getAllUsers } from "../controller";
import { Router } from 'express';
// Old node way
// const express = require('express');
// const Router = express.Router;
const userRouter = Router();
userRouter.post('/create', createUser);
userRouter.get('/', getAllUsers);
userRouter.patch('/:id');
userRouter.delete('/:id');
export default userRouter;
