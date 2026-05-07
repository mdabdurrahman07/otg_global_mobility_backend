import { Router } from "express";
import {
  createInquiry,
  getAllInquiries,
  deleteInquiry,
} from "../controllers/inquiryController.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.js";

const router = Router();

router.post("/", createInquiry);
router.get("/", verifyJWT, isAdmin, getAllInquiries);
router.delete("/:id", verifyJWT, isAdmin, deleteInquiry);

export default router;
