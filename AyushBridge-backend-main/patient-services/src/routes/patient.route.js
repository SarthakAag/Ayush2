import { Router } from "express";
import {
  registerPatient,
  loginPatient,
  logoutPatient,
  refreshAccessToken,
  changePatientPassword,
  getCurrentPatient,
  updatePatientDetails,
  updatePatientAvatar,
  getDiagnosisHistory
} from "../controllers/patient.controller.js";

import { verifyPatient } from "../middlewares/auth/patient.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Auth
+ router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", verifyPatient, logoutPatient);

// Profile
router.get("/me", verifyPatient, getCurrentPatient);
router.patch("/update", verifyPatient, updatePatientDetails);
router.patch("/avatar", verifyPatient, upload.single("avatar"), updatePatientAvatar);
router.patch("/change-password", verifyPatient, changePatientPassword);

// Diagnosis history
router.get("/diagnosis-history", verifyPatient, getDiagnosisHistory);

export default router;
