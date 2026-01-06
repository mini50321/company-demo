export const createUserObject = (data) => {
  return {
    id: data.id || Date.now().toString(),
    email: data.email,
    phone: data.phone || '',
    username: data.username || '',
    password: data.password,
    digilockerVerified: data.digilockerVerified || false,
    verifiedData: data.verifiedData || {},
    basicProfileCompleted: data.basicProfileCompleted || false,
    createdAt: data.createdAt || new Date().toISOString()
  };
};

export const sanitizeUser = (user) => {
  return {
    id: user.id,
    email: user.email,
    digilockerVerified: user.digilockerVerified || false,
    basicProfileCompleted: user.basicProfileCompleted || false
  };
};

