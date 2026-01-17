import { asyncHandler } from "../utils/asyncHandler.js";
import { Diagnosis } from "../models/diagnosis.model.js";
import { Appointment } from "../models/appointment.model.js";

const createDiagnosis = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    doctor: req.doctor._id,
    status: "accepted"
  });

  if (!appointment) {
    throw new ApiError(
      403,
      "Diagnosis can only be written for accepted appointments"
    );
  }

  const diagnosis = await Diagnosis.create({
    ...req.body,
    prescribedBy: req.doctor._id,
    owner: appointment.patient
  });

  // Mark appointment completed
  appointment.status = "completed";
  await appointment.save();

  return res.status(201).json(
    new ApiResponse(201, diagnosis, "Diagnosis created successfully")
  );
});

export { createDiagnosis }
