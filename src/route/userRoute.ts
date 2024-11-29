import { createUser, getAllUsers, updateUser } from "../controller";
import { Router } from 'express';
// Old node way
// const express = require('express');
// const Router = express.Router;
const userRouter = Router();
userRouter.post('/create', createUser);
userRouter.get('/', getAllUsers);
userRouter.put('/update/:id', updateUser);
userRouter.delete('/:id');
export default userRouter;
