const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Order = require("./OrderModel")

let userSchema = Schema({
	//Names will be Strings
	//Privacy is true or false
	//All required elements of a User
	username: {
		type: String, 
		required: true
	},
	password: {
		type: String, 
		required: true
	},
	privacy: {
		type: Boolean,
		required:true
	}
});

//Instance method finds orders of a user
userSchema.methods.findOrders = function(callback){
	this.model("Order").find()
	.where("buyer").equals(this.username)
	.populate("orders")
	.exec(callback);
};

module.exports = mongoose.model("User", userSchema);
