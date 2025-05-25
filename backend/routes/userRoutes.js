const express = require("express");
const router = express.Router();

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");

const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

// Admin user management
router.get("/", verifyToken, authorizeRoles("admin"), getUsers);
router.post("/", verifyToken, authorizeRoles("admin"), createUser);
router.put("/:id", verifyToken, authorizeRoles("admin"), updateUser);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteUser);

module.exports = router;
