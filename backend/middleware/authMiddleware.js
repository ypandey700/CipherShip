const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Exclude passwordHash or password field
    try {
      const user = await User.findById(decoded.id).select("-passwordHash -password");
      if (!user) return res.status(401).json({ message: "Unauthorized: User not found" });
      req.user = user;
      next();
    } catch (err) {
      console.error("DB error in verifyToken:", err);
      return res.status(500).json({ message: "Server error" });
    }
    
  } catch (error) {
    console.error("JWT auth error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user info" });
    }

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
