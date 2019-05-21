const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RecordSchema = new Schema({
	name: {
		type: String,
	},
	score: {
		type: Number,
	},
});

const Record = mongoose.model("record", RecordSchema);

module.exports = Record;
