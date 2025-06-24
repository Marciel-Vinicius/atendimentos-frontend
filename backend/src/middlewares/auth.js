import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  // ✅ Permitir preflight CORS
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // No Content
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.CLERK_JWT_KEY, { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Failed to authenticate token' });
    }

    req.user = decoded;
    next();
  });
};
