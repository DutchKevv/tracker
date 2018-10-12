import { App } from './app';
import { config } from './config';

export const app = new App(config);
app.init().catch(error => { throw error });