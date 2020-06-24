var express = require('express');
var router = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const User = require("./UserModel");

const mongoose = require('mongoose');

router.get("/", queryParser, loadUsers, respondUsers);
router.post("/", createUser, login);

router.get("/:uid", sendSingleUser);
router.post("/:uid", saveUser);

//Load a user based on uid parameter
router.param("uid", function(req, res, next, value){
	let oid;
	try{
		oid = new ObjectId(value);
	}catch(err){
		res.status(404).send("User ID " + value + " does not exist.");
		return;
	}
	
	User.findById(value, function(err, result){
		if(err){
			console.log(err);
			res.status(500).send("Error reading user.");
			return;
		}
		
		if(!result){
			res.status(404).send("User ID " + value + " does not exist.");
			return;
		}
		
		req.user = result;
		result.findOrders(function(err, result){
			if(err){
				console.log(err);
				//we will assume we can go on from here since we load the page
				//even if the user does not have orders
				//we loaded the user information successfully
				next();
				return;
			}

			req.user.orders = result;
			next();
		})
		
		if(req.session.loggedin && req.session.username == req.user.username){
			req.user.ownprofile = true;
		}
	});
});

//Send the representation of a single user that is a property of the request object
//Send 404 if someone is trying to access a private User and if that person is not the same person 
//that's logged in
function sendSingleUser(req, res, next){
	if (req.session.username != req.user.username && req.user.privacy == true){
		res.status(404).send("Order ID does not exist.");
	}
	else{
		res.format({
			"text/html": () => { res.render("user", {user: req.user.username, privacy: req.user.privacy, username: req.session.username, logged: req.session.loggedin, ownprofile: req.user.ownprofile, orders: req.user.orders, id : req.session.UserID}); }
		});
	}
}

//Save te privacy setting that are updated on the user page
function saveUser(req, res, next){
	let k
	if (req.body.privacy === "true"){
		k = true;
	}
	if (req.body.privacy === "false"){
		k = false;
	}
	User.findOneAndUpdate({username: req.session.username}, {$set: {privacy:k}}, {useFindAndModify:false}, function(err, result){
		if(err){
			res.status(500).send("Error retreiving the username.");
			return;
		}
		res.redirect("/users/" + req.session.UserID);
	});
}


function queryParser(req, res, next){	
	//build a query string to parse incoming url
	let params = [];
	for(prop in req.query){
		if(prop == "page"){
			continue;
		}
		params.push(prop + "=" + req.query[prop]);
	}
	req.qstring = params.join("&");
	
	if(!req.query.username){
		req.query.username = "?";
	}
	next();
}

//Loads the correct set of users based on the query parameters
//Adds a users property to the response object
//This property is used later to send the response
function loadUsers(req, res, next){
	User.find()
	.where("username").regex(new RegExp(".*" + req.query.username + ".*", "i"))
	.where("privacy").equals(false)
	.exec(function(err, results){
		if(err){
			res.status(500).send("Error reading users.");
			console.log(err);
			return;
		}
		res.users = results;
		next();
		return;
	});
}

//Uses the res.users property to send a response
function respondUsers(req, res, next){
	res.format({
		"text/html": () => {res.render("users", {users: res.users, username: req.session.username, logged: req.session.loggedin, id : req.session.UserID} )},
	});
}

//Creates a new user  on registration after checking
//if that username is already taken
function createUser(req, res, next){
	//Create the user
	let u = new User();
	u.username = req.body.username;
	u.password = req.body.password;
	u.privacy = false;
	u.orders = {};
	
	User.find()
	.where("username").equals(req.body.username)
	.exec(function(err, results){
		if(err){
			res.status(500).send("Error reading users.");
			console.log(err);
			return;
		}
		if (results.length == 0){
			u.save(function(err, result){
				if(err){
					console.log(err);
					res.status(500).send("Error creating user.");
					return;
				}
				req.username = u.username;
				req.password = u.password;
				next();
			})
		}
		else{
			res.status(404).send("A user with that name already exists. Go back and try again.");
		}
	});
}

//Logs in a newly created user and redirects to their profile page
function login(req, res, next){
	if(req.session.loggedin){
    res.status(200).send("Already logged in.");
    return;
	}
	let username = req.username;
	let password = req.password;
	mongoose.connection.db.collection("users").findOne({username: username}, function(err, result){
		if(err)throw err;
		
		if(result){
			req.session.loggedin = true;
			req.session.username = username;
			req.session.password = password;  
			res.redirect("/users/" + result._id.toString());
		}else{
			res.status(401).send("Not authorized. Invalid username.");
			return;
		}
	});
}

let mongoDB = 'mongodb://localhost:27017/a4';
mongoose.connect(mongoDB, {useNewUrlParser: true});

module.exports = router;