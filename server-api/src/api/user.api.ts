import { Router, Response } from 'express';
import { app } from '../bootstrapper';

export const router = Router();

/**
 * get list
 */
router.get('/', async (req: any, res: Response, next) => {
	try {
		res.send(await app.controllers.user.getList(req, req.query))
	} catch (error) {
		next(error)
	}
});