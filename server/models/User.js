const mongoose = require("mongoose");
const connect = process.env.MONGODB_URI;

mongoose.connect(connect);

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	}
});

let User = mongoose.model("User", userSchema);
module.exports = User;
