import mongoose, { Schema } from "mongoose";


const diagnosisSchema = new Schema(
  {
    diseaseTraditional: {
      type: String,
      required: true,
      trim: true,
        },
    diseaseModern: {
      type: String,
      required: true,
      trim: true,
        },
    NamasteCode: {
      type: String,
      required: true,
      trim: true,
        },
    icd10Code: {
      type: String,
      required: true,
      trim: true,
        },
    height: {
      type: Number, // in centimeters
      required: true,
    },
    weight: {
      type: Number, // in kilograms
      required: true,
        },
    bloodPressure: {
        type: String, // e.g., "120/80"
        required: false,
        },
        bloodSugar: {
            type: Number, // in mg/dL
            required: false,
        },
    diagnosisDate: {
      type: Date,
      required: true,
    },
    prescribedBy: {
        type: Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    notes: {
      type: String,
      trim: true,
        },
    files: [{
        type: String, // Cloudinary URLs
        required: false
        }],
    numberOfDayRestNeeded: {
      type: Number,
      required: false,
        },
    NextReviewDate: {
      type: Date,
      required: false,},
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    }
  },
  { timestamps: true }
);


const Diagnosis = mongoose.model("Diagnosis", diagnosisSchema);

export { Diagnosis };