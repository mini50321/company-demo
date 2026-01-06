import express from 'express';
import { initiate, callback } from '../controllers/digilocker.controller.js';

const router = express.Router();

router.post('/initiate', initiate);
router.post('/callback', callback);

export default router;

