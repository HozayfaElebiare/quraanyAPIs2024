const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const newsletterSchema = new Schema({

    email: {
        type: String,
        default: ''
    },
    key: {
        type: String,
        default: ''
    }

}, {
    timestamps: true
})


module.exports.Schema = newsletterSchema
module.exports.Model = mongoose.model('newsletter', newsletterSchema)