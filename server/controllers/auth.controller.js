import { 
  getUserByIdentifier, 
  getUserByCredentials, 
  createUser, 
  userExists 
} from '../config/database.js';
import { createUserObject, sanitizeUser } from '../models/user.model.js';

export const identifyUser = (req, res) => {
  const { identifier } = req.body;
  
  if (!identifier) {
    return res.status(400).json({ error: 'Identifier is required' });
  }

  const user = getUserByIdentifier(identifier);

  if (!user) {
    return res.json({
      customerExists: false,
      digilockerVerified: false,
      basicProfileCompleted: false
    });
  }

  res.json({
    customerExists: true,
    digilockerVerified: user.digilockerVerified || false,
    basicProfileCompleted: user.basicProfileCompleted || false
  });
};

export const register = (req, res) => {
  const { email, phone, username, password, digilockerVerified, verifiedData } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (userExists(email, phone, username)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const userData = createUserObject({
    email,
    phone,
    username,
    password,
    digilockerVerified: digilockerVerified || false,
    verifiedData: verifiedData || {}
  });

  const newUser = createUser(userData);

  res.json({
    success: true,
    user: sanitizeUser(newUser)
  });
};

export const login = (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Identifier and password are required' });
  }

  const user = getUserByCredentials(identifier, password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    success: true,
    user: sanitizeUser(user)
  });
};

