const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const BlogCatSchema = new Schema({
    categoryEn: {
        type: String,
        default: "",
    },
    categoryAr: {
        type: String,
        default: "",
    },
    categoryBaseUrl: {
        type: String,
    },
    articlesCount: {
        type: Number,
        default: 0,
        require: true
    }

}, {
    timestamps: true,
});




module.exports.Schema = BlogCatSchema;
module.exports.Model = mongoose.model("blogcat", BlogCatSchema);