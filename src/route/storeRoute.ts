import { createStore, getAllStores, updateStore } from "../controller";
import { Router } from 'express';
// Old node way
// const express = require('express');
// const Router = express.Router;
const storeRouter = Router();
storeRouter.post('/create', createStore);
storeRouter.get('/', getAllStores);
storeRouter.put('/update/:id', updateStore);
export default storeRouter;