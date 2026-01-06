import express from 'express';
import { 
  completeProfile, 
  updateDigilocker, 
  getProfileStatus 
} from '../controllers/customer.controller.js';

const router = express.Router();

router.post('/complete-profile', completeProfile);
router.post('/update-digilocker', updateDigilocker);
router.get('/profile-status', getProfileStatus);

export default router;

