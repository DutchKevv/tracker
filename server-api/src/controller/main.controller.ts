import * as geoip from 'geoip-lite';
import { User, IUserModel, IUserEvent, IUserEventLocation } from '../schema/user.schema';
import { MongooseDocument, DocumentQuery } from 'mongoose';
import { Response } from 'express';

export interface IMonitRequestQueryParams {
    u?: string; // redirect url
    n?: string; // custom name
}

export class MainController {

    public async monit(req: any, res: Response): Promise<any> {
        const ip = (req.ip || '').split(':')[0];
        const port = (req.ip || '').split(':')[1];
        const queryParams = <IMonitRequestQueryParams>req.query;
        const geo = geoip.lookup(ip);
        const model = req.device.parser.get_model();
        const deviceType = req.device.parser.get_type();

        const event: IUserEvent = {
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
            location: geo ? {
                country: geo.country,
                lat: geo.ll[0],
                long: geo.ll[1],
                region: geo.region,
                city: geo.city
            } : {},
            url: queryParams.u
        };

        console.log(req.device, req.useragent);

        await User.findOneAndUpdate({ name: queryParams.n }, {
            name: queryParams.n,
            $push: {
                events: event
            }
        }, { upsert: true, new: true, setDefaultsOnInsert: true });

        if (!queryParams.u)
            throw { message: 'no redirect url... (broken link)', statusCode: 409 };

        res.redirect(queryParams.u);
    }
}