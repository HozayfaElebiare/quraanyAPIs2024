var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CustomrSchema = new Schema({
    // Stage 1


}, { timestamps: true });

module.exports = mongoose.model("Customr", CustomrSchema);