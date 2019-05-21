const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VirusSchema = new Schema({
	x: {
		type: String,
	},
	y: {
		type: String,
	},
	mass: {
		type: String,
	},
	color: {
		type: String,
	},
});

const Virus = mongoose.model("virus", VirusSchema);

module.exports = Virus;
