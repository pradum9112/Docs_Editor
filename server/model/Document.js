const mongoose = require("mongoose");

const document = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

const Document = mongoose.model("Document", document);
module.exports = Document;
