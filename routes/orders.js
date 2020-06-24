var express = require('express');
var router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const User = require("./UserModel");
const Order = require("./OrderModel");
const mongoose = require('mongoose');

router.post("/", express.json(), createOrder);
router.get("/:uid", sendSingleOrder);

//Creates a new order
function createOrder(req, res, next){
	//Create the order
	let u = new Order();
	u.restaurantName = req.body.restaurantName;
	u.buyer = req.session.username;
	u.subtotal = req.body.subtotal;
	u.total = req.body.total;
	u.fee = req.body.fee;
	u.tax = req.body.tax;
	u.order = req.body.order;

	u.save(function(err, result){
		if(err){
			res.status(500).send("Error saving your order");
			console.log(err);
			return;
		}
		
		User.findOneAndUpdate({username: u.buyer}, {$push: {"orders":result.id}}, {useFindAndModify:false},function(err, result){
			if(err){
				res.status(500).send("Error retreiving the username.");
				return;
			}
			res.send();
		});
	});
}

////Load a user based on uid parameter
router.param("uid", function(req, res, next, value){
	let oid;
	try{
		oid = new ObjectId(value);
	}catch(err){
		res.status(404).send("Order ID " + value + " does not exist.");
		return;
	}
	//Finds an order by the passed in uid
	Order.findById(value, function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading order.");
			return;
		}
		
		if(!result){
			res.status(404).send("Order ID " + value + " does not exist.");
			return;
		}
		req.order = result;
		//finds the User associated with that order
		User.findOne()
		.where("username").equals(req.order.buyer)
		.exec(function(err, results){
			if(err){
				console.log(err);
				res.status(500).send("Error reading user.");
				return;
			}
			req.user = results
			if(req.session.loggedin && req.session.username === req.user.username){
				req.user.ownprofile = true;
			}
			next();	
		});
	});
});

//Send the representation of a single order that is a property of the request object
//Send 404 if someone is trying to access a private User's order and if that person is not the same person 
//that's logged in
function sendSingleOrder(req, res, next){
	if ((req.user.privacy == true) && (req.session.username != req.user.username)){
		res.status(404).send("Order ID does not exist.");
	}
	else{
		res.format({
			"text/html": () => { res.render("order", {username: req.session.username, logged: req.session.loggedin, order: req.order, id : req.session.UserID}); }
		});
	}
}

let mongoDB = 'mongodb://localhost:27017/a4';
mongoose.connect(mongoDB, {useNewUrlParser: true});

module.exports = router;