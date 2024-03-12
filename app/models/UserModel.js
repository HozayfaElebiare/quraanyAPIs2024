var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isConfirmed: { type: Boolean, required: true, default: 0 },
    isMobile: { type: Boolean, required: true, default: 0 },
    confirmOTP: { type: String, required: false },
    otpTries: { type: Number, required: false, default: 0 },
    status: { type: Boolean, required: true, default: true },
    mobile: { type: String, default: '' },
    type: {
        type: String,
        required: true,
        enum: ["profile_admin", "profile_student", "profile_tutor", "profile_coordinator", "profile_publisher"],
        default: "profile_student",
    },
    profile: { type: mongoose.Types.ObjectId, refPath: 'type' },
    accountFinalConfirmation: { type: Boolean, default: false },
    lang: { type: String, default: 'ar' },
    currency: { type: String, default: 'EGP' },
    country: { type: String, default: 'EG' },

    // OAuth
    registrationType: { type: String, default: '' }, //enum('form','oauth')
    authToken: { type: String, default: '' },
    authId: { type: String, default: '' },
    photoUrl: { type: String, default: '' },
    provider: { type: String, default: '' },






}, { timestamps: true });


UserSchema.pre('find', function() {
    this.populate('profile');
})

UserSchema.pre('findById', function() {
    this.populate('profile');
})

UserSchema.pre('findOne', function() {
    this.populate('profile');
})
UserSchema.pre('findOneAndUpdate', function() {
    this.populate('profile');
})

UserSchema.pre('findByIdAndUpdate', function() {
    this.populate('profile');
})

module.exports = mongoose.model("user", UserSchema);