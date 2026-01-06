const users = [];

export const getUserById = (id) => {
  return users.find(u => u.id === id);
};

export const getUserByIdentifier = (identifier) => {
  return users.find(u => 
    u.email === identifier || 
    u.phone === identifier || 
    u.username === identifier
  );
};

export const getUserByCredentials = (identifier, password) => {
  return users.find(u => 
    (u.email === identifier || u.phone === identifier || u.username === identifier) &&
    u.password === password
  );
};

export const createUser = (userData) => {
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  return newUser;
};

export const updateUser = (userId, updates) => {
  const user = getUserById(userId);
  if (user) {
    Object.assign(user, updates);
    return user;
  }
  return null;
};

export const userExists = (email, phone, username) => {
  return users.some(u => 
    u.email === email || 
    (phone && u.phone === phone) || 
    (username && u.username === username)
  );
};

export default users;

