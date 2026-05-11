import { Router } from "express";
import {
  createInquiry,
  getAllInquiries,
  updateInquiry,
  deleteInquiry,
} from "../controllers/inquiryController.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.js";

const router = Router();

router.post("/", createInquiry);
router.get("/", verifyJWT, isAdmin, getAllInquiries);
router.patch("/:id", verifyJWT, isAdmin, updateInquiry);
router.delete("/:id", verifyJWT, isAdmin, deleteInquiry);

export default router;
