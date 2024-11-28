import { createStore } from "../controller";
import { Router } from 'express';
// Old node way
// const express = require('express');
// const Router = express.Router;
const storeRouter = Router();
storeRouter.post('/create', createStore);
export default storeRouter;