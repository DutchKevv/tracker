"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bootstrapper_1 = require("../bootstrapper");
exports.router = express_1.Router();
/**
 * get by local id
 */
exports.router.get('/:id', async (req, res, next) => {
    try {
        res.send(await bootstrapper_1.app.controllers.maze.getByMazeId(req.user, req.params.id));
    }
    catch (error) {
        next(error);
    }
});
/**
 * get list
 */
exports.router.get('/', async (req, res, next) => {
    try {
        console.log('asdasdfsdfasdfasdfsdf');
        res.send(await bootstrapper_1.app.controllers.maze.getList(req.user, req.query));
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=default.api.js.map