var mongoose = require("mongoose");

var dayDefault = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var ScheduledSchema = new mongoose.Schema({
    // sat
    sat: {
        type: [Boolean],
        default: dayDefault
    },
    // sun
    sun: {
        type: [Boolean],
        default: dayDefault
    },
    // mon
    mon: {
        type: [Boolean],
        default: dayDefault
    },
    // tue
    tue: {
        type: [Boolean],
        default: dayDefault
    },
    // wed
    wed: {
        type: [Boolean],
        default: dayDefault
    },
    // thu
    thu: {
        type: [Boolean],
        default: dayDefault
    },
    // fri
    fri: {
        type: [Boolean],
        default: dayDefault
    }
}, { timestamps: true });


var TutorSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'user' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    // job
    fullName: { type: String, default: '' },
    college: { type: String, default: '' },
    age: { type: String, default: '' },
    gender: { type: String, enum: ['male', 'female'] },
    currentStdy: { type: String, default: '' },
    // Contact
    mobile: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    forignAddress: { type: String, default: '' },
    // How is
    savedQuraan: { type: Number, default: 0 },
    technical: { type: String, default: '' },
    freeTimePerDay: { type: String, default: '' },
    hourFee: { type: Number, default: 0 },
    hourFeeForeign: { type: Number, default: 0 },
    teachForeign: { type: Boolean, default: false },
    laptop: { type: String, default: '' },
    internet: { type: String, default: '' },
    // Language
    englishLevel: { type: String, default: '' },
    otherLanguages: { type: String, default: '' },
    // computer
    computerLevel: { type: String, default: '' },
    // AdditionalNote
    otherNotes: { type: String, default: '' },
    loveVolinteer: { type: String, default: '' },
    // Skills To Teach
    skilsAbleToTeach: { type: String, default: '' },
    // Verifications
    imgUrl: { type: String, default: '' },
    IDUrl: { type: String, default: '' },
    billingContact: { type: String, default: '' },
    // Local

    // Complete data
    isProfileCompleted: { type: Boolean, default: false }, //
    profileSubmit: { type: Boolean, default: false }, // 

    // Admin Area
    adminNotes: { type: String },
    accountFinalConfirmation: { type: Boolean, default: false },
    Scheduled: {
        type: ScheduledSchema,
        default: {
            sat: dayDefault,
            sun: dayDefault,
            mon: dayDefault,
            tue: dayDefault,
            wed: dayDefault,
            thu: dayDefault,
            fri: dayDefault
        }
    },
    ScheduleSession: { type: Object, default: {} },

    // Show For Students ?
    accountVisibility: { type: Boolean, default: false },


    // added data
    maritalStatus: { type: String, default: ''},//,enum:['single','married'] 
    previousExperience: { type: String, default: '' },
    teachingVideo: { type: String, default: '' },
    


}, { timestamps: true });



module.exports = mongoose.model("profile_tutor", TutorSchema);