"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const isDocker = require('is-docker')();
const dev = {
    'http': {
        'port': 5000,
        'host': 'localhost',
    },
    'mongo': {
        'connectUrl': `mongodb://root:track@127.0.0.1}:27017/track?authSource=admin`
    }
};
const prod = {
    'http': {
        'port': 80,
        'host': '0.0.0.0'
    },
    'mongo': {
        'connectUrl': `mongodb://root:track@${isDocker ? 'rtl-mongo' : '127.0.0.1'}:27018/track?authSource=admin`
    }
};
exports.config = Object.freeze((process.env.NODE_ENV || '').startsWith('prod') ? prod : dev);
//# sourceMappingURL=config.js.map