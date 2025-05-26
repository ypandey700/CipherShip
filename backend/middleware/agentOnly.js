// Middleware to allow only delivery agents
// Requires verifyToken middleware to run before this

const agentOnly = (req, res, next) => {
  console.log('agentOnly - req.user:', req.user);
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (req.user.role !== 'deliveryAgent') {
    console.log('Forbidden: User role:', req.user.role);
    return res.status(403).json({ message: 'Forbidden: Agents only' });
  }
  next();
};

module.exports = agentOnly;
