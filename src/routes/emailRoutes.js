import { Router } from "express";
import { sendEmail, replyToInquiry } from "../controllers/emailController.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.js";

const router = Router();

router.post("/send", verifyJWT, isAdmin, sendEmail);
router.post("/reply/:id", verifyJWT, isAdmin, replyToInquiry);

export default router;
