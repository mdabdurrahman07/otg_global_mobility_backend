import { Router } from "express";
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../controllers/contactController.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.js";

const router = Router();

// Public route
router.post("/", createContact);

// Admin only routes
router.get("/", verifyJWT, isAdmin, getAllContacts);
router.get("/:id", verifyJWT, isAdmin, getContactById);
router.put("/:id", verifyJWT, isAdmin, updateContact);
router.delete("/:id", verifyJWT, isAdmin, deleteContact);

export default router;
