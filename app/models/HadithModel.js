var mongoose = require('mongoose')



var HadithSchema = new mongoose.Schema({
    number: {
        type: Number,
    },
    id: {
        type: String,
    },
    arab: {
        type: String,
    }


}, { timestamps: true })


module.exports = {
    abudaud: mongoose.model('z_hadith_abudauds', HadithSchema),
    ahmad: mongoose.model('z_hadith_ahmads', HadithSchema),
    bukhari: mongoose.model('z_hadith_bukharis', HadithSchema),
    darimi: mongoose.model('z_hadith_darimis', HadithSchema),
    ibnumajah: mongoose.model('z_hadith_ibnumajahs', HadithSchema),
    malik: mongoose.model('z_hadith_maliks', HadithSchema),
    muslim: mongoose.model('z_hadith_muslims', HadithSchema),
    nasai: mongoose.model('z_hadith_nasais', HadithSchema),
    tirmidzi: mongoose.model('z_hadith_tirmidzis', HadithSchema)
}