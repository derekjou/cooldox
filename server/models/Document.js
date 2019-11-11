const mongoose = require("mongoose");
const connect = process.env.MONGODB_URI;

const User = require("./User");

mongoose.connect(connect);

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ""
  },
  collaborators: [
    {
      type: mongoose.Schema.ObjectId,
      ref: User
    }
  ],
  history: [
    {
      content: {
        type: String,
        required: true
      },
      modifiedAt: {
        type: String,
        required: true
      }
    }
  ]
});

let Document = mongoose.model("Document", documentSchema);
module.exports = Document;
