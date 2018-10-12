"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./config");
exports.app = new app_1.App(config_1.config);
exports.app.init().catch(error => { throw error; });
//# sourceMappingURL=bootstrapper.js.map