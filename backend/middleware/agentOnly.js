// backend/middleware/agentOnly.js
const agentOnly = (req, res, next) => {
    if (req.user?.role !== 'delivery_agent') {
      return res.status(403).json({ message: 'Forbidden: Agents only' });
    }
    next();
  };
  
  module.exports = agentOnly;
  