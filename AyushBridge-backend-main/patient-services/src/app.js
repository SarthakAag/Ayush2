import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

/* ==============================
   ✅ CORS (React ↔ Backend)
================================ */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

/* ==============================
   ✅ Body Parsers
================================ */
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

/* ==============================
   ✅ Routes
================================ */
import appointmentRoutes from "./routes/appointment.route.js";
import diagnosisRoutes from "./routes/diagnosis.route.js";
import doctorRoutes from "./routes/doctor.route.js";
import patientRoutes from "./routes/patient.route.js";

app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/diagnosis", diagnosisRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/patients", patientRoutes);

/* ==============================
   ✅ Global Error Handler
================================ */
app.use((err, req, res, next) => {
  console.error("🔥 Backend Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

export { app };

