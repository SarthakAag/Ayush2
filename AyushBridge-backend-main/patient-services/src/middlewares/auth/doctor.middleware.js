import jwt from "jsonwebtoken";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Doctor } from "../../models/doctor.model.js";

export const verifyDoctor = asyncHandler(async (req, _, next) => {
  try {
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

    const doctor = await Doctor.findById(decodedToken?._id)
      .select("-password -refreshToken");

    if (!doctor) {
      throw new ApiError(401, "Invalid doctor access token");
    }

    req.doctor = doctor; // ✅ attach doctor
    next();
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Invalid doctor access token"
    );
  }
});
