import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Patient } from "../models/patient.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

/* ======================================================
   TOKEN HELPERS
====================================================== */
const generateAccessAndRefreshTokens = async (patientId) => {
  try {
    const patient = await Patient.findById(patientId);

    const accessToken = patient.generateAccessToken();
    const refreshToken = patient.generateRefreshToken();

    patient.refreshToken = refreshToken;
    await patient.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};

/* ======================================================
   REGISTER PATIENT (NO AVATAR REQUIRED)
====================================================== */
const registerPatient = asyncHandler(async (req, res) => {
  const { name, healthId, age, gender, blood, address, password } = req.body;

  if (![name, healthId, age, gender, blood, address, password].every(Boolean)) {
    throw new ApiError(400, "All fields are required");
  }

  const existingPatient = await Patient.findOne({ abha_id: healthId });
  if (existingPatient) {
    throw new ApiError(409, "Patient with this ABHA ID already exists");
  }

  const patient = await Patient.create({
    fullName: name,
    abha_id: healthId,
    age,
    gender,
    blood,
    address,
    password
  });

  const createdPatient = await Patient.findById(patient._id)
    .select("-password -refreshToken");

  return res
    .status(201)
    .json(new ApiResponse(201, createdPatient, "Patient registered successfully"));
});

/* ======================================================
   LOGIN PATIENT
====================================================== */
const loginPatient = asyncHandler(async (req, res) => {
  const { healthId, password } = req.body;

  if (!healthId || !password) {
    throw new ApiError(400, "ABHA ID and password are required");
  }

  const patient = await Patient.findOne({ abha_id: healthId });
  if (!patient) {
    throw new ApiError(404, "Patient not found");
  }

  const isPasswordValid = await patient.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(patient._id);

  const loggedInPatient = await Patient.findById(patient._id)
    .select("-password -refreshToken");

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { patient: loggedInPatient, accessToken, refreshToken },
        "Login successful"
      )
    );
});

/* ======================================================
   LOGOUT
====================================================== */
const logoutPatient = asyncHandler(async (req, res) => {
  await Patient.findByIdAndUpdate(req.patient._id, {
    $unset: { refreshToken: 1 }
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  };

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

/* ======================================================
   REFRESH ACCESS TOKEN
====================================================== */
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized");
  }

  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const patient = await Patient.findById(decoded._id).select("+refreshToken");

  if (!patient || patient.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(patient._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken },
        "Access token refreshed"
      )
    );
});

/* ======================================================
   CHANGE PASSWORD
====================================================== */
const changePatientPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and new passwords are required");
  }

  const patient = await Patient.findById(req.patient._id).select("+password");

  const isPasswordValid = await patient.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(400, "Old password is incorrect");
  }

  patient.password = newPassword;
  await patient.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully"));
});

/* ======================================================
   GET CURRENT PATIENT
====================================================== */
const getCurrentPatient = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.patient, "Patient fetched"));
});

/* ======================================================
   UPDATE PATIENT DETAILS
====================================================== */
const updatePatientDetails = asyncHandler(async (req, res) => {
  const { name, age, gender, blood, address } = req.body;

  const updateData = {};
  if (name) updateData.fullName = name;
  if (age) updateData.age = age;
  if (gender) updateData.gender = gender;
  if (blood) updateData.blood = blood;
  if (address) updateData.address = address;

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "At least one field is required");
  }

  const updatedPatient = await Patient.findByIdAndUpdate(
    req.patient._id,
    { $set: updateData },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPatient, "Profile updated"));
});

/* ======================================================
   UPDATE AVATAR (OPTIONAL)
====================================================== */
const updatePatientAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar?.url) {
    throw new ApiError(500, "Avatar upload failed");
  }

  const patient = await Patient.findByIdAndUpdate(
    req.patient._id,
    { avatar: avatar.url },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, patient, "Avatar updated"));
});

/* ======================================================
   GET DIAGNOSIS HISTORY  ✅ (FIXES YOUR ERROR)
====================================================== */
const getDiagnosisHistory = asyncHandler(async (req, res) => {
  const patient = await Patient.findById(req.patient._id)
    .populate({
      path: "diagnosisHistory",
      options: { sort: { diagnosisDate: -1 } }
    })
    .select("diagnosisHistory");

  return res.status(200).json(
    new ApiResponse(
      200,
      patient?.diagnosisHistory || [],
      "Diagnosis history fetched successfully"
    )
  );
});

/* ======================================================
   EXPORTS
====================================================== */
export {
  registerPatient,
  loginPatient,
  logoutPatient,
  refreshAccessToken,
  changePatientPassword,
  getCurrentPatient,
  updatePatientDetails,
  updatePatientAvatar,
  getDiagnosisHistory   // ✅ REQUIRED BY ROUTES
};
