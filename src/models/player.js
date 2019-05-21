const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CellSchema = new Schema({
	username: {
		type: String,
		required: [true, "Name field is required."],
	},
	uid: {
		type: String,
		required: [true, "Uid field is required."],
	},
	x: {
		type: Number,
	},
	y: {
		type: Number,
	},
	mass: {
		type: Number,
	},
	color: {
		type: String,
	},
});

const Cell = mongoose.model("cell", CellSchema);

module.exports = Cell;
