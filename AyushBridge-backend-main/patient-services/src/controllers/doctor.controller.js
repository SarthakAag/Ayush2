import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Doctor } from "../models/doctor.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

/* ======================================================
   TOKEN GENERATOR
====================================================== */
const generateDoctorTokens = async (doctorId) => {
  try {
    const doctor = await Doctor.findById(doctorId);
    const accessToken = doctor.generateAccessToken();
    const refreshToken = doctor.generateRefreshToken();

    doctor.refreshToken = refreshToken;
    await doctor.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};

/* ======================================================
   BASIC REGISTER (NOW with asyncHandler ✅)
====================================================== */
const registerDoctorBasic = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new ApiError(400, "Username, email and password are required");
  }

  const existingDoctor = await Doctor.findOne({
    $or: [{ email: email.toLowerCase() }, { username }]
  });

  if (existingDoctor) {
    throw new ApiError(409, "Doctor already exists");
  }

  const doctor = await Doctor.create({
    username,
    email: email.toLowerCase(),
    password
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        _id: doctor._id,
        username: doctor.username,
        email: doctor.email
      },
      "Clinician account created successfully"
    )
  );
});

/* ======================================================
   FULL REGISTER (PROFILE COMPLETION)
====================================================== */
const registerDoctor = asyncHandler(async (req, res) => {
  const {
    name,
    qualification,
    specializations,
    location,
    areaOfExpertise,
    email,
    phone,
    password,
    docId
  } = req.body;

  if (![name, qualification, location, email, phone, password, docId].every(Boolean)) {
    throw new ApiError(400, "All required fields must be provided");
  }

  const existingDoctor = await Doctor.findOne({
    $or: [{ email }, { phone }, { docId }]
  });

  if (existingDoctor) {
    throw new ApiError(409, "Doctor already exists");
  }

  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar?.url) {
    throw new ApiError(500, "Avatar upload failed");
  }

  const doctor = await Doctor.create({
    name,
    qualification,
    specializations,
    location,
    areaOfExpertise,
    email: email.toLowerCase(),
    phone,
    password,
    docId,
    avatar: avatar.url
  });

  const createdDoctor = await Doctor.findById(doctor._id)
    .select("-password -refreshToken");

  return res.status(201).json(
    new ApiResponse(201, createdDoctor, "Doctor registered successfully")
  );
});

/* ======================================================
   LOGIN
====================================================== */
const loginDoctor = asyncHandler(async (req, res) => {
  const { email, phone, docId, password } = req.body;

  if (!(email || phone || docId)) {
    throw new ApiError(400, "Email, phone, or docId is required");
  }

  const doctor = await Doctor.findOne({
    $or: [{ email }, { phone }, { docId }]
  }).select("+password");

  if (!doctor) {
    throw new ApiError(404, "Doctor not found");
  }

  const isPasswordValid = await doctor.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateDoctorTokens(doctor._id);

  const loggedInDoctor = await Doctor.findById(doctor._id)
    .select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { doctor: loggedInDoctor, accessToken, refreshToken },
        "Logged in successfully"
      )
    );
});

/* ======================================================
   LOGOUT
====================================================== */
const logoutDoctor = asyncHandler(async (req, res) => {
  await Doctor.findByIdAndUpdate(req.doctor._id, {
    $unset: { refreshToken: 1 }
  });

  return res.status(200).json(
    new ApiResponse(200, {}, "Logged out successfully")
  );
});

/* ======================================================
   REFRESH TOKEN
====================================================== */
const refreshDoctorAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized");
  }

  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const doctor = await Doctor.findById(decoded._id).select("+refreshToken");

  if (!doctor || doctor.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const { accessToken, refreshToken } = await generateDoctorTokens(doctor._id);

  return res.status(200).json(
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
const changeDoctorPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and new passwords are required");
  }

  const doctor = await Doctor.findById(req.doctor._id).select("+password");

  const isMatch = await doctor.isPasswordCorrect(oldPassword);
  if (!isMatch) {
    throw new ApiError(400, "Old password incorrect");
  }

  doctor.password = newPassword;
  await doctor.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(200, {}, "Password changed successfully")
  );
});

/* ======================================================
   GET CURRENT DOCTOR
====================================================== */
const getCurrentDoctor = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, req.doctor, "Doctor fetched successfully")
  );
});

/* ======================================================
   UPDATE PROFILE
====================================================== */
const updateDoctorDetails = asyncHandler(async (req, res) => {
  const updateData = req.body;

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(400, "No fields provided for update");
  }

  const updatedDoctor = await Doctor.findByIdAndUpdate(
    req.doctor._id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  return res.status(200).json(
    new ApiResponse(200, updatedDoctor, "Doctor updated successfully")
  );
});

/* ======================================================
   UPDATE AVATAR
====================================================== */
const updateDoctorAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const updatedDoctor = await Doctor.findByIdAndUpdate(
    req.doctor._id,
    { avatar: avatar.url },
    { new: true }
  ).select("-password -refreshToken");

  return res.status(200).json(
    new ApiResponse(200, updatedDoctor, "Avatar updated successfully")
  );
});

/* ======================================================
   EXPORTS
====================================================== */
export {
  generateDoctorTokens,
  registerDoctorBasic,
  registerDoctor,
  loginDoctor,
  logoutDoctor,
  refreshDoctorAccessToken,
  changeDoctorPassword,
  getCurrentDoctor,
  updateDoctorDetails,
  updateDoctorAvatar
};