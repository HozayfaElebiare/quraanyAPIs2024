var mongoose = require("mongoose");


var StudentSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'user' },
    Profiles: { type: [mongoose.Types.ObjectId], ref: 'profile' },
    subscriptionHistory: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "subscriptions"
    },
    currentSubscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subscriptions"
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    sessions:{type:Number, default:1}




}, { timestamps: true });

// Virtual for user's full name
// StudentSchema.virtual("fullName").get(function() {
//     return this.firstName + " " + this.lastName;
// });


StudentSchema.pre('find', function() {
    this.populate('Profiles');
    this.populate('subscriptionHistory');
    this.populate('currentSubscription');
})

StudentSchema.pre('findById', function() {
    this.populate('Profiles');
    this.populate('subscriptionHistory');
    this.populate('currentSubscription');
})

StudentSchema.pre('findOne', function() {
    this.populate('Profiles');
    this.populate('subscriptionHistory');
    this.populate('currentSubscription');
})
StudentSchema.pre('findOneAndUpdate', function() {
    this.populate('Profiles');
    this.populate('subscriptionHistory');
    this.populate('currentSubscription');
})

StudentSchema.pre('findByIdAndUpdate', function() {
    this.populate('Profiles');
    this.populate('subscriptionHistory');
    this.populate('currentSubscription');
})

module.exports = mongoose.model("profile_student", StudentSchema);