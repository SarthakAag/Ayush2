import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const doctorSchema = new Schema(
  {
    /* ================= BASIC ACCOUNT ================= */
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address"
      ]
    },

    password: {
      type: String,
      required: true,
      select: false,
      minlength: 6 // ✅ allow basic signup
    },

    role: {
      type: String,
      default: "doctor"
    },

    refreshToken: {
      type: String,
      select: false
    },

    /* ================= PROFILE (OPTIONAL INITIALLY) ================= */
    name: { type: String, trim: true },

    qualification: {
      type: [String],
      default: []
    },

    specializations: {
      type: [String],
      default: []
    },

    location: { type: String, trim: true },

    areaOfExpertise: {
      type: [String],
      default: []
    },

    rating: { type: Number, default: 0, min: 0, max: 5 },

    docId: { type: String, unique: true, sparse: true },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^[0-9]{10,15}$/, "Phone number must be 10–15 digits"]
    },

    avatar: { type: String },

    url: [
      {
        type: String,
        trim: true
      }
    ],

    appointments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Appointment"
      }
    ],

    patients: [
      {
        type: Schema.Types.ObjectId,
        ref: "Patient"
      }
    ]
  },
  { timestamps: true }
);

/* ================= HOOKS ================= */
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* ================= METHODS ================= */
doctorSchema.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};

doctorSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

doctorSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const Doctor = mongoose.model("Doctor", doctorSchema);
