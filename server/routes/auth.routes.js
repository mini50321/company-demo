import express from 'express';
import { identifyUser, register, login } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/identify-user', identifyUser);
router.post('/register', register);
router.post('/login', login);

export default router;

