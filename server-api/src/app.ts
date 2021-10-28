import * as path from 'path';
import * as http from 'http';
import * as formidable from 'express-formidable';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as device from 'express-device';
import * as ua from 'express-useragent';
import { config } from './config';
import { MainController } from './controller/main.controller';
import { UserController } from './controller/user.controller';

export interface IAppOptions {
    http: {
        port: number;
        host: string;
    },
    mongo: {
        connectUrl: string;
    }
}

export class App {

    public db: mongoose.Connection;
    public api: express.Application;
    public server: http.Server;
    public controllers: { main?: MainController, user?: UserController } = {
        main: new MainController,
        user: new UserController
    };

    constructor(public options: IAppOptions) { }

    public async init() {
        // open db connection
        this._connectMongo();

        // listen for incoming requests
        await this._setupHttp();
    }

    private async _setupHttp() {
        // http
        this.api = express();
        this.server = new http.Server(this.api);

        // statics
        this.api.use(express.static(path.join(__dirname, '../../client/dist'), {index: '_'}));

        // ip address
        this.api.enable('trust proxy');

        // device info
        this.api.use(device.capture({
            parseUserAgent: true
        }));

        // logging
        this.api.use(morgan('dev'));

        // user agent info
        this.api.use(ua.express());

        // default security headers
        this.api.use(helmet());

        // headers
        this.api.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
            res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
            next();
        });

        // bodies
        this.api.use(formidable());

        /**
         * http routes
         */
        this.api.get('/o', (req, res) => res.sendFile(path.join(__dirname, '../../client/dist/index.html')));

        this.api.use('/user', require('./api/user.api').router);
        this.api.use('/r', require('./api/main.api').router);

        /**
         * error handling
         */
        this.api.use((error, req, res, next) => {
            if (res.headersSent) {
                console.error('HEADERS ALREADT SENT: ', error);
                return next(error);
            }

            // normal error objects
            if (error && (error.code || error.statusCode)) {

                // known error
                if (error.statusCode) {
                    return res.status(error.statusCode).send(error.error || {
                        statusCode: error.statusCode,
                        message: error.message
                    });
                }
            }

            // unknown error
            else {
                console.error('RTL-API', error);
                res.status(500).send('Unknown server error');
            }
        });

        this.server.listen(
            config.http.port,
            config.http.host,
            () => console.info('RTL-API', `Service started -> ${config.http.host}:${config.http.port}`));
    }

    private _connectMongo() {
        this.db = mongoose.connection;
        this.db.once('error', error => {
            console.error('connection error:', error);
        })
        this.db.once('open', () => {
            console.info('RTL-API', 'connected to DB');
        });

console.log(config.mongo.connectUrl)
        mongoose.connect(config.mongo.connectUrl, { useNewUrlParser: true });
    }
}