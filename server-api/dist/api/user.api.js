"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bootstrapper_1 = require("../bootstrapper");
exports.router = express_1.Router();
/**
 * get list
 */
exports.router.get('/', async (req, res, next) => {
    try {
        res.send(await bootstrapper_1.app.controllers.user.getList(req, req.query));
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=user.api.js.map