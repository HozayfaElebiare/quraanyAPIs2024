var mongoose = require("mongoose");


var SessionSchema = new mongoose.Schema({
    // Student ID
    studentId: { type: mongoose.Types.ObjectId, ref: 'user' },
    StudentName: { type: String, required: true },
    StudentImg: { type: String, default: "" },

    // Tutor ID
    tutorId: { type: mongoose.Types.ObjectId, ref: 'user' },
    TutorName: { type: String, required: true },
    TutorImg: { type: String, default: "" },

    // Profile ID
    profileId: { type: mongoose.Types.ObjectId, ref: 'profile' },
    profileName: { type: String, required: true },
    profileImg: { type: String, default: "" },
    profileCountry: { type: String, default: "" },


    // Session Details
    // id: { type: Number, required: true, unique: true, index: true },
    id: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    dayName: { type: String, required: true },
    index: { type: Number, required: true },
    timezone: { type: String, required: true },
    isAvailable: { type: Boolean, required: true },
    status: { type: String, required: true, enum: ['available', 'unavailable', 'reserved', 'canceled', 'skipped', 'rescheduled'], default: 'reserved' },
    studentDuration: { type: Number, required: true },




    // Session Logger
    log: { type: [{ String, Date }], default: [] },











}, { timestamps: true });



module.exports = mongoose.model("session", SessionSchema);