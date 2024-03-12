const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    rate: {
        type: Number,
        default: 0,
    },
    comment: {
        type: String,
        default: 0,
    },
}, {
    timestamps: true,
    _id: false,
});

const BlogSchema = new Schema({
    id: {
        type: String,
        default: "",
    },
    type: {
        type: String,
        enum: ["audio", "video", "image", "article"],
        default: "",
    },
    articleTitle: {
        type: String,
        default: "",
    },
    articleBody: {
        type: String,
    },
    pubLink: {
        type: String,
        default: "",
    },
    reate: {
        type: Number,
        default: 0,
    },
    keywords: {
        type: [String],
    },
    refTitle: {
        type: String,
        default: "",
    },
    refLink: {
        type: String,
        default: "",
    },
    imgLinks: {
        type: [String],
    },

    videoLink: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    comments: [CommentSchema],
    isLiked: {
        type: Boolean,
        default: false,
    },
    category: [{
        type: mongoose.Types.ObjectId,
        ref: "blogcat",
    }, ],
}, {
    timestamps: true,
});

BlogSchema.pre("find", function() {
    this.populate("category");
});

module.exports.CommentSchema = CommentSchema;

module.exports.Schema = BlogSchema;
module.exports.Model = mongoose.model("blog", BlogSchema);