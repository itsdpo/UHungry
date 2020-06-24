var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
const mongoose = require('mongoose');
const User = require('./routes/UserModel');

// set up sessions database
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/a4',
  collection: 'sessions'
});
app.use(session({ secret: 'MonKey', store: store }))

let userRouter = require('./routes/users');
let orderRouter = require('./routes/orders');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', loadHome);

// relevant routes for all our get/post requests
app.get('/register', loadRegister);
app.post('/login', login);
app.get('/logout', logout);
app.get('/orderform', auth, loadOrderForm);

app.use('/users', userRouter);
app.use('/orders', orderRouter); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).send("error");
});

//Checks if a session exists (logged in == true) -> used to authorize
//a user access to the order form page
function auth(req, res, next) {
	if(!req.session.loggedin){
		res.status(401).send("Unauthorized");
		return;
	}
	next();
};

// simple function to render the homepage (pass relevant values to pug dynamically load page)
function loadHome(req, res, next) {
  res.render('index', {username: req.session.username, logged: req.session.loggedin, id : req.session.UserID});
}

// simple function to render the order form page (pass relevant values to pug dynamically load page)
function loadOrderForm(req, res, next) {
  res.render('orderform', {username: req.session.username, logged: req.session.loggedin, id: req.session.UserID});
}

// simple function to render the register page (pass relevant values to pug dynamically load page)
function loadRegister(req, res, next) {
  res.render('register', {username: req.session.username, logged: req.session.loggedin});
}

// function to create session and redirect to users/:uid page after login
function login(req, res, next){
	if(req.session.loggedin){
    res.status(200).send("Already logged in.");
    return;
	}
	let username = req.body.username;
	let password = req.body.password;
	mongoose.connection.db.collection("users").findOne({username: username}, function(err, result){
		if(err)throw err;
		
		if(result){
			if(result.password === password){
				req.session.loggedin = true;
				req.session.username = username;
				req.session.password = password;
				req.session.UserID = result._id;
        res.redirect("/users/" + result._id.toString());
			}else{
				res.status(401).send("Not authorized. Invalid password.");
			}
		}else{
			res.status(401).send("Not authorized. Invalid username.");
			return;
		}
	});
}

// function to logout and destroy session
function logout(req, res, next){
	if(req.session.loggedin){
		req.session.destroy();
		res.redirect("/");
	}else{
		res.status(200).send("You cannot log out because you aren't logged in.");
	}
}

mongoose.connect('mongodb://localhost:27017/a4', {useNewUrlParser: true});

module.exports = app;
