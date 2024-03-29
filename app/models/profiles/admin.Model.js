var mongoose = require("mongoose");

var AdminSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'user' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },



}, { timestamps: true });

// Virtual for user's full name
AdminSchema.virtual("fullName").get(function() {
    return this.firstName + " " + this.lastName;
});

// module.exports = mongoose.model("profile_admin", AdminSchema);
module.exports.Schema = AdminSchema;
module.exports.Model = mongoose.model("profile_admin", AdminSchema);
