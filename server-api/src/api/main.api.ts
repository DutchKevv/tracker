import { Router, Response } from 'express';
import { app } from '../bootstrapper';

export const router = Router();

/**
 * get list
 */
router.get('/', async (req: any, res: Response, next) => {
	try {
		await app.controllers.main.monit(req, res)
	} catch (error) {
		next(error)
	}
});