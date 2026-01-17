import jwt from "jsonwebtoken";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Patient } from "../../models/patient.model.js";

export const verifyPatient = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  const decodedToken = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET
  );

  const patient = await Patient.findById(decodedToken._id)
    .select("-password -refreshToken");

  if (!patient) {
    throw new ApiError(401, "Invalid patient access token");
  }

  req.patient = patient; // ✅ attach patient
  next(); // ✅ MUST be called
});
