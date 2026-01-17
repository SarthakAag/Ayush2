import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Appointment } from "../models/appointment.model.js";
import { Patient } from "../models/patient.model.js";
import { Doctor } from "../models/doctor.model.js";
import mongoose from "mongoose";

/**
 * 1️⃣ Patient requests an appointment with a doctor
 */
const requestAppointment = asyncHandler(async (req, res) => {
  const { doctorId, requestedSlot } = req.body;

  if (!doctorId || !requestedSlot) {
    throw new ApiError(400, "doctorId and requestedSlot are required");
  }

  // Validate doctor
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new ApiError(404, "Doctor not found");

  // Prevent duplicate pending requests
  const existingRequest = await Appointment.findOne({
    patient: req.patient._id,
    doctor: doctorId,
    status: "pending",
  });

  if (existingRequest) {
    throw new ApiError(409, "You already have a pending request with this doctor");
  }

  const appointment = await Appointment.create({
    patient: req.patient._id,
    doctor: doctorId,
    requestedSlot: new Date(requestedSlot),
    status: "pending",
  });

  return res.status(201).json(
    new ApiResponse(201, appointment, "Appointment request sent successfully")
  );
});


/**
 * 2️⃣ Doctor can view all appointment requests
 */
const getAppointmentsForDoctor = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({
    doctor: req.doctor._id,
    status: "pending",
  })
    .populate("patient", "fullName email phone avatar abha_id")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, appointments, "Appointment requests fetched")
  );
});

/**
 * 3️⃣ Doctor accepts or rejects an appointment
 */
const respondToAppointment = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { action, rejectionReason } = req.body; // accept | reject

  if (!["accept", "reject"].includes(action)) {
    throw new ApiError(400, "Action must be 'accept' or 'reject'");
  }

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    doctor: req.doctor._id,
    status: "pending", // ❗ only pending can be responded to
  });

  if (!appointment) {
    throw new ApiError(404, "Appointment request not found or already processed");
  }

  appointment.status = action === "accept" ? "accepted" : "rejected";
  appointment.doctorResponseAt = new Date();

  if (action === "reject") {
    appointment.rejectionReason = rejectionReason || "Doctor unavailable";
  }

  await appointment.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      appointment,
      `Appointment ${action === "accept" ? "accepted" : "rejected"}`
    )
  );
});


/**
 * 4️⃣ Patient views their appointments
 */
const getAppointmentsForPatient = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({
    patient: req.patient._id,
  })
    .populate("doctor", "name email avatar docId specializations")
    .sort({ requestedSlot: 1 });

  return res.status(200).json(
    new ApiResponse(200, appointments, "Your appointments fetched successfully")
  );
});


export {
    requestAppointment,
    getAppointmentsForDoctor,
    respondToAppointment,
    getAppointmentsForPatient
}