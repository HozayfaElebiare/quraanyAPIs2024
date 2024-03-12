const mongoose = require('mongoose')
const Schema = mongoose.Schema;


var LangsSchema = new Schema({
    en: {
        type: String,
        default: '',

    },
    ar: {
        type: String,
        default: '',

    },
    fr: {
        type: String,
        default: '',

    },
    de: {
        type: String,
        default: '',

    },
    es: {
        type: String,
        default: '',

    },
    it: {
        type: String,
        default: '',

    },
    pt: {
        type: String,
        default: '',

    },
    ru: {
        type: String,
        default: '',

    },
    zh: {
        type: String,
        default: '',

    },

}, {
    timestamps: false,
    _id: false,
});



var PriceListSchema = new Schema({
    EGP: {
        type: [Number],
        default: [0, 0, 0, 0, 0, 0, 0],
    },
    USD: {
        type: [Number],
        default: [0, 0, 0, 0, 0, 0, 0],
    },
    EUR: {
        type: [Number],
        default: [0, 0, 0, 0, 0, 0, 0],
    },
    GBP: {
        type: [Number],
        default: [0, 0, 0, 0, 0, 0, 0],
    },

}, {
    timestamps: false,
    _id: false,
});

var pkgsSchema = new mongoose.Schema({
    PkgName: {
        type: LangsSchema,
        default: { en: '', ar: '', fr: '', de: '', es: '', it: '', pt: '', ru: '', zh: '' }
    },
    pkgType: {
        type: String,
        enum: ["single", "multi"],
        default: "single"
    },
    pkgTypeName: {
        type: LangsSchema,
        default: { en: '', ar: '', fr: '', de: '', es: '', it: '', pt: '', ru: '', zh: '' }
    },
    weeks: {
        type: Number,
        default: 0
    },
    w4: {
        type: PriceListSchema,
        default: { EGP: [0, 0, 0, 0, 0, 0, 0], USD: [0, 0, 0, 0, 0, 0, 0], EUR: [0, 0, 0, 0, 0, 0, 0], GBP: [0, 0, 0, 0, 0, 0, 0] }

    },
    w12: {
        type: PriceListSchema,
        default: { EGP: [0, 0, 0, 0, 0, 0, 0], USD: [0, 0, 0, 0, 0, 0, 0], EUR: [0, 0, 0, 0, 0, 0, 0], GBP: [0, 0, 0, 0, 0, 0, 0] }
    },
    w24: {
        type: PriceListSchema,
        default: { EGP: [0, 0, 0, 0, 0, 0, 0], USD: [0, 0, 0, 0, 0, 0, 0], EUR: [0, 0, 0, 0, 0, 0, 0], GBP: [0, 0, 0, 0, 0, 0, 0] }
    },
    pkgDetails: {
        type: Object,
        default: {}
    }
}, {
    timestamps: true
})

module.exports.Schema = pkgsSchema
module.exports.Model = mongoose.model('pkg', pkgsSchema)