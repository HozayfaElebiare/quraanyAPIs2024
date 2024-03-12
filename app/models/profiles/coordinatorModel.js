var mongoose = require("mongoose");

var CoordinatorSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'user' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },



}, { timestamps: true });

// Virtual for user's full name
CoordinatorSchema.virtual("fullName").get(function() {
    return this.firstName + " " + this.lastName;
});

module.exports = mongoose.model("profile_coordinator", CoordinatorSchema);