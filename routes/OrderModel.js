const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let orderSchema = Schema({
	// Strings for restaurantName and buyer
	// order is Javascript Object type
	// remaining keys are all Number types
	// set all to required since data sent onclick submit is non void
	restaurantName: {
		type: String, 
		required: true
	},
	order: {
		type: Object,
		required: true
	},
	buyer: {
		type: String,
		required: true
	},
	subtotal:{
		type: Number,
		required: true
	},
	tax:{
		type: Number,
		required: true
	},
	fee:{
		type: Number,
		required: true
	},
	total:{
		type: Number,
		required: true
	}
});

module.exports = mongoose.model("Order", orderSchema);
