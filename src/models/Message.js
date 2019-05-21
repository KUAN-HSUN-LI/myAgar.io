const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	name: {
		type: String,
	},
	message: {
		type: String,
	},
});

const Message = mongoose.model("message", MessageSchema);

module.exports = Message;
