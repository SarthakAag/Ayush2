import { Router } from "express";
import {
  requestAppointment,
  getAppointmentsForDoctor,
  respondToAppointment,
  getAppointmentsForPatient
} from "../controllers/appointment.controller.js";

import { verifyPatient } from "../middlewares/auth/patient.middleware.js";
import { verifyDoctor } from "../middlewares/auth/doctor.middleware.js";

const router = Router();

/**
 * ---------------- PATIENT ----------------
 */

// Patient sends appointment request
router.post(
  "/request",
  verifyPatient,
  requestAppointment
);

// Patient views all appointments
router.get(
  "/my",
  verifyPatient,
  getAppointmentsForPatient
);

/**
 * ---------------- DOCTOR ----------------
 */

// Doctor views pending appointment requests
router.get(
  "/doctor/pending",
  verifyDoctor,
  getAppointmentsForDoctor
);

// Doctor accepts or rejects appointment
router.patch(
  "/:appointmentId/respond",
  verifyDoctor,
  respondToAppointment
);

export default router;
