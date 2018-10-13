import { IAppOptions } from './app';

const isDocker = require('is-docker')();

const dev: IAppOptions = <IAppOptions>{
    'http': {
        'port': 5000,
        'host': isDocker ? '0.0.0.0' : 'localhost',
    },
    'mongo': {
        'connectUrl': `mongodb://root:track@${isDocker ? 'rtl-mongo' : '127.0.0.1'}:27018/track?authSource=admin`
    }
};

const prod: IAppOptions = <IAppOptions>{
    'http': {
        'port': 5000,
        'host': '0.0.0.0'
    },
    'mongo': {
        'connectUrl': `mongodb://root:track@${isDocker ? 'rtl-mongo' : '127.0.0.1'}:27018/track?authSource=admin`
    }
};

export const config: IAppOptions = Object.freeze((process.env.NODE_ENV || '').startsWith('prod') ? prod : dev);