var mongoose = require("mongoose");

var PublisherSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'user' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },



}, { timestamps: true });

// Virtual for user's full name
PublisherSchema.virtual("fullName").get(function() {
    return this.firstName + " " + this.lastName;
});

// module.exports = mongoose.model("profile_publisher", PublisherSchema);
module.exports.Schema = PublisherSchema;
module.exports.Model = mongoose.model("profile_publisher", PublisherSchema);