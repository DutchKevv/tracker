"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const formidable = require("express-formidable");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const config_1 = require("./config");
class App {
    constructor(options) {
        this.options = options;
        this.controllers = {};
    }
    async init() {
        // open db connection
        this._connectMongo();
        // start scraping
        this.controllers.maze.startScraping();
        // listen for incoming requests
        await this._setupHttp();
    }
    async _setupHttp() {
        // http
        this.api = express();
        this.server = new http.Server(this.api);
        // logging
        this.api.use(morgan('dev'));
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
        this.api.use('/api/v1/shows', require('./api/show.api').router);
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
        this.server.listen(config_1.config.http.port, config_1.config.http.host, () => console.info('RTL-API', `Service started -> ${config_1.config.http.host}:${config_1.config.http.port}`));
    }
    _connectMongo() {
        this.db = mongoose.connection;
        this.db.once('error', error => {
            console.error('connection error:', error);
        });
        this.db.once('open', () => {
            console.info('RTL-API', 'connected to DB');
        });
        mongoose.connect(config_1.config.mongo.connectUrl, { useNewUrlParser: true });
    }
}
exports.App = App;
