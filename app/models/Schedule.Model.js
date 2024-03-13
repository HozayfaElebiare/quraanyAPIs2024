var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CustomrSchema = new Schema({
    // Stage 1


}, { timestamps: true });


module.exports.Schema = CustomrSchema;
module.exports.Model = mongoose.model("Customr", CustomrSchema);