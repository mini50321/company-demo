import { getUserById, updateUser } from '../config/database.js';
import { sanitizeUser } from '../models/user.model.js';

export const completeProfile = (req, res) => {
  const { userId, profileData } = req.body;

  const user = getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const updatedUser = updateUser(userId, {
    basicProfileCompleted: true,
    ...profileData
  });

  res.json({
    success: true,
    user: sanitizeUser(updatedUser)
  });
};

export const updateDigilocker = (req, res) => {
  const { userId, verifiedData } = req.body;

  const user = getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const updatedUser = updateUser(userId, {
    digilockerVerified: true,
    verifiedData: verifiedData || {}
  });

  res.json({
    success: true,
    user: sanitizeUser(updatedUser)
  });
};

export const getProfileStatus = (req, res) => {
  const { userId } = req.query;

  const user = getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    digilockerVerified: user.digilockerVerified || false,
    basicProfileCompleted: user.basicProfileCompleted || false
  });
};

