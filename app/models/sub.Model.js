const mongoose = require('mongoose')
const Schema = mongoose.Schema;


// تفاصيل اشتراك الطالب بالموقع
var subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    PkgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "pkg"
    },
    pkgType: {
        type: String,
        enum: ["w4", "w12", "w24"],
        default: "w4"
    },
    weeks: {
        type: Number,
        default: 0
    },
    sessions: {
        type: Number,
        default: 0
    },
    totalSessionCount: {
        type: Number,
        default: 0
    },
    avillableSessions: {
        type: Number,
        default: 0
    },
    pricePerSession: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,

        default: Date.now
    },

    status: {
        type: String,
        enum: ["active", "inactive", "unpaid", "expired", "canceled", "ended"],
        default: "unpaid"
    },
    pkgDetails: {
        type: Object,
        default: {}
    },
    clientSecret: {
        type: String,
        unique: true,
        required: true
    },
    paymentIntentId: {
        type: String,
        unique: true,
        required: true
    },
    intentCreatorObject: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
})


module.exports.Schema = subscriptionSchema
module.exports.Model = mongoose.model('subscriptions', subscriptionSchema)