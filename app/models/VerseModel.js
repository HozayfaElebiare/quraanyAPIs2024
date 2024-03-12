var mongoose = require('mongoose')


var verseSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    number: {
        type: Number,
    },
    text: {
        type: String,
    },
    translations: {
        type: {
            en: { type: String },
            es: { type: String },
            fr: { type: String },
            id: { type: String },
            ru: { type: String },
            sv: { type: String },
            tr: { type: String },
            ur: { type: String },
            zh: { type: String }
        }
    },
    transliteration: {
        type: String,
    },
    chapter: {
        type: Object,
        default: {}
    }
}, { timestamps: true })

module.exports = mongoose.model('quranverse', verseSchema)