const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const KeyvalSchema = new Schema({

    area: {
        type: String,
        default: ''
    },
    Key: {
        type: String,
        default: ''
    },
    valEn: {
        type: String,
        default: ''
    },
    valAr: {
        type: String,
        default: ''
    }

}, {
    timestamps: true
})


module.exports.Schema = KeyvalSchema
module.exports.Model = mongoose.model('keyval', KeyvalSchema)