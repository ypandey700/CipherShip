const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify JWT token and set req.user
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash -password");
    if (!user) return res.status(401).json({ message: "Unauthorized: User not found" });
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT auth error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}

// Middleware factory to authorize based on allowed roles
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized: No user info" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
    next();
  };
}

module.exports = {
  verifyToken,
  authorizeRoles,
};
