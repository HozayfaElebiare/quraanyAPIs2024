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

}, { _id: false })


var chapterSchema = new mongoose.Schema({
    transliteration: { type: String },
    type: { type: String },
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
    }

}, { _id: false })

var quraanSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    name: {
        type: String,
    },
    transliteration: {
        type: String,
    },
    type: {
        type: String,
    },
    total_verses: {
        type: Number,
    },
    verses: {
        type: [{
            id: { type: Number },
            text: { type: String },

            details: { type: verseSchema }


        }]
    },
    start_vers: {
        type: Number
    },
    chapter: {
        type: chapterSchema
    }


}, { timestamps: true })

module.exports = mongoose.model('quran', quraanSchema)