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
        await bootstrapper_1.app.controllers.main.monit(req, res);
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=main.api.js.map