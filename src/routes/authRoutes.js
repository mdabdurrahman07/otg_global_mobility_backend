import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateUser,
  deleteUser,
  getAllUsers,
} from "../controllers/authController.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.js";
import upload from "../config/multer.js";

const router = Router();
// isAdmin missing add it after registration
router.post("/register", isAdmin, upload.single("userImage"), registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/me", verifyJWT, getCurrentUser);
router.get("/", verifyJWT, isAdmin, getAllUsers);
router.patch("/:userId", verifyJWT, isAdmin, upload.single("userImage"), updateUser);
router.delete("/:userId", verifyJWT, isAdmin, deleteUser);

export default router;
