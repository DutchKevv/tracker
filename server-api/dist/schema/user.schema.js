"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
;
exports.UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        default: 'unknown',
        unique: true
    },
    events: {
        type: [
            {
                time: {
                    type: Date,
                    default: Date.now
                },
                url: String,
                device: {
                    model: String,
                    form: String,
                    browser: String,
                    os: String,
                    version: String,
                    source: String,
                    platform: String
                },
                location: {
                    lat: {
                        type: Number
                    },
                    long: {
                        type: Number
                    },
                    country: {
                        type: String
                    },
                    region: {
                        type: String
                    },
                    city: {
                        type: String
                    }
                },
                ip: String,
                port: Number,
                agent: {
                    family: String,
                    version: Number
                }
            }
        ],
        default: []
    }
}, {
    timestamps: true
});
// UserSchema.plugin(<any>beautifyUnique);
exports.User = mongoose_1.model('User', exports.UserSchema);
//# sourceMappingURL=user.schema.js.map