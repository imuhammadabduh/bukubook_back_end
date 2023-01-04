const mongoose = require("mongoose");

const FeedSchema = new mongoose.Schema(
  {
    user_nama: String,
    user_id: String,
    user_content: String,
  },
  { timestamps: true }
);

const Feed = mongoose.model("feed", FeedSchema);

module.exports = Feed;
