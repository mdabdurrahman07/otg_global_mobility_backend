import { Router } from "express";
import {
  createTestimonial,
  getAllTestimonials,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.js";
import upload from "../config/multer.js";

const router = Router();

router.post("/", verifyJWT, isAdmin, upload.single("authorImage"), createTestimonial);
router.get("/", getAllTestimonials);
router.delete("/:id", verifyJWT, isAdmin, deleteTestimonial);

export default router;
