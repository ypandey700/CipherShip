const express = require("express");
const router = express.Router();

const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");
const { getUsers, createUser, updateUser, deleteUser } = require("../controllers/UserController");

// GET all users (admin only)
router.get("/", verifyToken, authorizeRoles("admin"), getUsers);

// CREATE new user (admin only)
router.post("/", verifyToken, authorizeRoles("admin"), createUser);

// UPDATE user by ID (admin only)
router.put("/:id", verifyToken, authorizeRoles("admin"), updateUser);

// DELETE user by ID (admin only)
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteUser);

module.exports = router;
