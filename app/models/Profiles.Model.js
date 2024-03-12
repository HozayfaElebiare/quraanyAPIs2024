const mongoose = require('mongoose')
    // const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;



var soraStatus = new mongoose.Schema({
        soraId: {
            type: Number,
            default: 0
        },
        from: {
            type: Number,
            default: 0
        },
        to: {
            type: Number,
            default: 0
        },
        level: {
            type: Number,
            default: 0
        },
        totalSavedVerses: {
            type: Number,
            default: 0
        },
        isFullySaved: {
            type: Boolean,
            default: false
        },

    }, {
        timestamps: true,
        _id: false
    })
    // تفاصيل اشتراك الطالب بالموقع
var studentProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    fullName: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
        required: true
    },
    defaultLanguage: {
        type: String,
        required: true
    },
    quraanStatus: {
        type: [soraStatus],
        default: []
    },
    totalSavedSora: {
        type: Number,
        default: 0
    },
    totalSavedVerses: {
        type: Number,
        default: 0
    },
    // SessionsActivities: {
    //     type: mongoose.Types.ObjectId, ref: 'sessionsActivities' 
    // },
    // to select tutor from the list by gender ----> if >14 || <14
    age: {
        type: Number,
        required: true
    },
    sesstionMeetingType: {
        type: String,
        enum: ['audio', 'video'],
        default: 'video'
    }
}, {
    timestamps: true
})


module.exports.Schema = studentProfileSchema
module.exports.Model = mongoose.models.profile || mongoose.model('profile', studentProfileSchema)