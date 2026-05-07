import { Router } from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.js";
import upload from "../config/multer.js";

const router = Router();
// verifyJWT & isAdmin add after user configuration
router.post("/",  upload.single("serviceImage"), createService);
router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.patch("/:id", verifyJWT, isAdmin, upload.single("serviceImage"), updateService);
router.delete("/:id", verifyJWT, isAdmin, deleteService);

export default router;
