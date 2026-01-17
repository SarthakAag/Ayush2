import { Router } from "express";
import { createDiagnosis } from "../controllers/diagnosis.controller.js";
import { verifyDoctor } from "../middlewares/auth/doctor.middleware.js";

const router = Router();

// Doctor writes diagnosis after accepting appointment
router.post(
  "/:appointmentId",
  verifyDoctor,
  createDiagnosis
);

export default router;
