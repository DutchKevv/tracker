"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const geoip = require("geoip-lite");
const user_schema_1 = require("../schema/user.schema");
class MainController {
    async monit(req, res) {
        const ip = (req.ip || '').split(':')[0];
        const port = (req.ip || '').split(':')[1];
        const queryParams = req.query;
        const geo = geoip.lookup(ip);
        const model = req.device.parser.get_model();
        const deviceType = req.device.parser.get_type();
        const event = {
            device: {
                model,
                form: deviceType,
                browser: req.useragent.browser,
                version: req.useragent.version,
                os: req.useragent.os,
                source: req.useragent.source,
                platform: req.useragent.platform
            },
            ip,
            port,
            location: {
                country: geo.country,
                lat: geo.ll[0],
                long: geo.ll[1],
                region: geo.region,
                city: geo.city
            },
            url: queryParams.u
        };
        console.log(req.device, req.useragent);
        await user_schema_1.User.findOneAndUpdate({ name: queryParams.n }, {
            name: queryParams.n,
            $push: {
                events: event
            }
        }, { upsert: true, new: true, setDefaultsOnInsert: true });
        if (!queryParams.u)
            throw { message: 'no redirect url... (broken link)', statusCode: 409 };
        // res.redirect(queryParams.u);
    }
}
exports.MainController = MainController;
//# sourceMappingURL=main.controller.js.map