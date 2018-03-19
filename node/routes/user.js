var express = require('express');
var mongoose = require( 'mongoose' );
var bcrypt = require( 'bcryptjs' );

var userHelper = require('../lib/user-helper');

var router = express.Router();
var User = mongoose.model( 'User' );

// route middleware that will happen on every request
router.use(function(req, res, next) {
  
  // log each request to the console
  console.log('log: user middleware:',req.method, req.url);
  
  // continue doing what we were doing and go to the route
  next(); 
});

// GET login page
router.get('/login', function (req, res) {

  if( userHelper.loggedIn( req.session ) ) {
    res.redirect( '/user/' );
  }

  //req.session.loggedIn = false;
  res.render('login-form', {
    thesession : req.session,
    loggedIn : false,
    title: 'Log in'
  });
});

// POST login page
router.post('/login', function (req, res) {
  if (!req.body.username || !req.body.password ) {
      // try again
	  return res.redirect('/user/login?nousername');
  }

  User.findOne( { 'username': req.body.username }, '_id name email username roles hash password',
      function(err, user) {

        if( err ) {
            // o'oh;
            console.error(err);
            return res.redirect('/user/login?404=error');
        }

        if (!user) {
          // No user with username found
          return res.redirect('/user/login?nouser');
        }

        console.log(req.body.password, user.hash, user.password);
        if( !bcrypt.compareSync( req.body.password, user.hash ) ) {
          // Incorrect password
	        return res.redirect('/user/login?nopass');
        }

        // Create session

          req.session.user = {
            "name" : user.name,
            "email": user.email,
            "username" : user.username,
            "_id": user._id,
            "roles" : user.roles
          };

          req.session.loggedIn = true;

          User.update(  {_id:user._id},  { $set: {lastLogin: Date.now() } },
            function() {
              res.redirect( '/user/' );
            });
      });
});

// GET logged in user page
router.get('/', function (req, res) {

	if( userHelper.loggedIn(req.session) ) {
		res.render('user-page', {
			thesession : req.session,
			title: "Datasets for " + req.session.user.name,
			loggedIn : true,
			name: req.session.user.name,
			email: req.session.user.email,
			username: req.session.user.username,
			//password: req.session.user.password,
			userID: req.session.user._id,
			roles: req.session.user.roles,
			datasetsPage: true
		} );
    }
	else {
		res.redirect('/user/login');
	}
});

// GET user creation form
router.get('/new', function(req, res){
  var strName = '',
      strEmail = '',
      arrErrors = [];
  if (req.session.tmpUser) {
    strName = req.session.tmpUser.name;
    strEmail = req.session.tmpUser.email;
  }
  if (req.query){
    if (req.query.name === 'invalid'){
      arrErrors.push('Please enter a valid name, minimum 5 characters');
    }
    if (req.query.email === 'invalid'){
      arrErrors.push('Please enter a valid email address');
    }
  }
  res.render('user-form', {    
    thesession : req.session,
    title: 'Create user',
    _id: "",
    name: strName,
    email: strEmail,
    username: "",
    password: "",
    buttonText: "Join!",
    errors: arrErrors,
	  loggedIn : req.session.loggedIn,
	  roles: req.session.user.roles
 });
});

// POST new user creation form
router.post('/new', function(req, res){
  User.create({
    username: req.body.username,
    //password: req.body.password,
      hash: bcrypt.bcrypt.hashSync( req.body.password, 12 ), // todo, none sync version.
    name: req.body.FullName,
    email: req.body.Email,
    modifiedOn : Date.now(),
    lastLogin : Date.now()
  }, function( err, user ){
    var qstring = '';
    if(err){
      console.log(err);
      if(err.code===11000){
        qstring = 'exists=true';
      } else if (err.name === "ValidationError") {
        for (var input in err.errors) {
          qstring += input + '=invalid&';
          console.log(err.errors[input].message);
        }
      }else{
        res.redirect('/?error=true');
      }
//    req.session.tmpUser = {"name" : req.body.FullName, "email": req.body.Email};
      req.session.tmpUser = {
        "username": req.body.username,
        //"password": req.body.password,
        "name" : req.body.FullName, 
        "email": req.body.Email
      };
      res.redirect( '/user/new?' + qstring);
    }else{
      // Success
      console.log("log: User created and saved: " + user);
//    req.session.user = { "name" : user.name, "email": user.email, "_id": user._id };
      req.session.user = { 
        "name" : user.name, 
        "email": user.email, 
        "username" : user.username, 
        //"password": user.password,
        "_id": user._id 
      };
      req.session.loggedIn = true;
      res.redirect( '/user/' );
    }
  });
});

// GET user edit form
router.get('/edit', function(req, res){
  if (req.session.loggedIn){
    var strName = '',
    strEmail = '',
    arrErrors = [];
    if (req.session.tmpUser) {
      strName = req.session.tmpUser.name;
      strEmail = req.session.tmpUser.email;
      req.session.tmpUser = '';
    }else{
      strName = req.session.user.name;
      strEmail = req.session.user.email;
    }
    if (req.query){
      if (req.query.name === 'invalid'){
        arrErrors.push('Please enter a valid name, minimum 5 characters');
      }
      if (req.query.email === 'invalid'){
        arrErrors.push('Please enter a valid email address');
      }
    }
    res.render('user-form', {
      thesession : req.session,
      title: 'Edit profile - ' + req.session.user.username,
      _id: req.session.user._id,
      name: req.session.user.name,
      email: req.session.user.email,
      username: req.session.user.username,
      //password: req.session.user.password,
      buttonText: "Save",
      errors: arrErrors,
	    loggedIn : req.session.loggedIn,
	    roles: req.session.user.roles
    });
  } else {
    res.redirect( '/login');
  }
});

// POST user edit form
router.post('/edit', function(req, res) {
  if (req.session.user._id) {
    User.findById( req.session.user._id,
      function (err, user) {
        doEditSave (req, res, err, user);
      }
    );
  }
});


// GET user delete confirmation form
router.get('/delete', function(req, res){
  res.render('user-delete-form', {
    thesession : req.session,
    title: 'Delete account',
    _id: req.session.user._id,
    name: req.session.user.name,
    email: req.session.user.email
  });
});

// POST user delete form
router.post('/delete', function(req, res) {
  if (req.body._id) {
    User.findByIdAndRemove(
        req.body._id,
        function (err, user) {
          if(err){
            console.log(err);
          }else{
            console.log("log: User deleted:", user);
            clearSession(req.session, function () {
              res.redirect('/');
            });
          }
        }
    );
  }
});

// GET user logout
router.get('/logout', function(req, res) {
  // below doesn't work with express4 and mongostore
  clearSession(req.session, function () {
    res.redirect('/');
  });
});


var doEditSave = function(req, res, err, user) {
  if(err){
    console.log(err);
    res.redirect( '/user/?error=finding');
  } else {
    user.name = req.body.FullName;
    user.email = req.body.Email;
    user.username = req.body.username;
    if( req.body.password ) {
	    user.hash = bcrypt.hashSync( req.body.password, 12 ); // todo, none sync version.
    }
    user.modifiedOn = Date.now();
    user.save(
      function (err, user) {
        onEditSave (req, res, err, user);
      }
    );
  }
};

var onEditSave = function (req, res, err, user) {
  var qstring = '';
  if(err){
    console.log(err);
    if (err.name === "ValidationError") {
      for (var input in err.errors) {
        qstring += input + '=invalid&';
        console.log(err.errors[input].message);
      }
    }else{
      res.redirect('/?error=true');
    }
    req.session.tmpUser = {"name" : req.body.FullName, "email": req.body.Email};
    res.redirect( '/user/edit?' + qstring);
  } else {
    console.log('log: User updated: ' + req.body.FullName);
    req.session.user.name = req.body.FullName;
    req.session.user.email = req.body.Email;
    req.session.user.username = req.body.username;
    req.session.user.password = req.body.password;
    res.redirect( '/user/' );
  }

};

var clearSession = function(session, callback){
  session.destroy();
  callback();
};

module.exports = router;