// Middleware to allow only customers
// Requires verifyToken middleware to run before this

function customerOnly(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Forbidden: Customers only" });
  }
  next();
}

module.exports = customerOnly;
