const mongoose = require("mongoose");
const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  size: Number,
  localPath: String,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  public_id: String,
});

const File = mongoose.model("File", fileSchema);
module.exports = File;
