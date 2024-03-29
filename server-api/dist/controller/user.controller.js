"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_schema_1 = require("../schema/user.schema");
class UserController {
    getList(req, params) {
        return user_schema_1.User.find({});
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map