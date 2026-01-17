import mongoose, {Schema} from "mongoose"

const appointmentSchema = new Schema({
    patientName: {
        type: Schema.Types.ObjectId, // one who is subscribing
        ref: "Patient"
    },
    DoctorName: {
        type: Schema.Types.ObjectId, // one to whom 'subscriber' is subscribing
        ref: "Doctor"
    },
    timeslot: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: [
        "pending",    // patient sent request
        "accepted",   // doctor accepted
        "rejected",   // doctor rejected
        "completed",  // diagnosis done
        "cancelled"   // patient cancelled
      ],
        default: "scheduled"
    }

}, {timestamps: true})



const Appointment = mongoose.model("Appointment", appointmentSchema)

export { Appointment }