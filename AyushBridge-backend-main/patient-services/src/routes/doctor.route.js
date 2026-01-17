import { Router } from "express";
import {
  registerDoctorBasic,
  registerDoctor,
  loginDoctor,
  logoutDoctor,
  refreshDoctorAccessToken,
  changeDoctorPassword,
  getCurrentDoctor,
  updateDoctorDetails,
  updateDoctorAvatar
} from "../controllers/doctor.controller.js";

import { verifyDoctor } from "../middlewares/auth/doctor.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// 🔹 BASIC REGISTER (Option A)
router.post("/register-basic", registerDoctorBasic);

// 🔹 FULL REGISTER (profile completion later)
router.post("/register", upload.single("avatar"), registerDoctor);

// Auth
router.post("/login", loginDoctor);
router.post("/refresh-token", refreshDoctorAccessToken);
router.post("/logout", verifyDoctor, logoutDoctor);

// Profile
router.get("/me", verifyDoctor, getCurrentDoctor);
router.patch("/update", verifyDoctor, updateDoctorDetails);
router.patch("/avatar", verifyDoctor, upload.single("avatar"), updateDoctorAvatar);
router.patch("/change-password", verifyDoctor, changeDoctorPassword);

export default router;
