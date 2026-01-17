import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const patientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },

    abha_id: {
      type: String,
      required: true,
      unique: true
    },

    age: {
      type: Number,
      required: true
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"], // ✅ MATCH FRONTEND
      required: true
    },

    blood: {
      type: String,
      required: true
    },

    address: {
      type: String,
      required: true
    },

    avatar: {
      type: String,
      default: ""
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    refreshToken: {
      type: String,
      select: false
    },

    diagnosisHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Diagnosis"
      }
    ]
  },
  { timestamps: true }
);

/* ===========================
   PASSWORD HASH
=========================== */
patientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* ===========================
   METHODS
=========================== */
patientSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

patientSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
};

patientSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

export const Patient = mongoose.model("Patient", patientSchema);
