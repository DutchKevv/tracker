import * as geoip from 'geoip-lite';
import { User, IUserModel, IUserEvent, IUserEventLocation } from '../schema/user.schema';
import { MongooseDocument, DocumentQuery } from 'mongoose';
import { Response } from 'express';

export class UserController {

    getList(req, params): DocumentQuery<IUserModel[], IUserModel> {
        return User.find({});
    }
}