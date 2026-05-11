import { Router } from "express";
import {
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.js";
import upload from "../config/multer.js";

const router = Router();

router.post("/", verifyJWT, isAdmin, upload.single("authorImage"), createTestimonial);
router.get("/", getAllTestimonials);
router.patch("/:id", verifyJWT, isAdmin, upload.single("authorImage"), updateTestimonial);
router.delete("/:id", verifyJWT, isAdmin, deleteTestimonial);

export default router;
