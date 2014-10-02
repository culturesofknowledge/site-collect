var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );

var clearSession = function(session, callback){
  session.destroy();
  callback();
};

/* USER ROUTES
user.index);           // Current user profile
user.create);      // Create new user form
user.doCreate);   // Create new user action
user.edit);       // Edit current user form
user.doEdit);    // Edit current user action
user.confirmDelete);       // delete current user form
user.doDelete);    // Delete current user action
user.doLogout);          // Logout current user
user.login);          // Edit current user form
user.doLogin);       // Edit current user action
*/

// route middleware that will happen on every request
router.use(function(req, res, next) {
  
  // log each request to the console
  console.log('log: user middleware:',req.method, req.url,'session:',req.session);
  
  // continue doing what we were doing and go to the route
  next(); 
});

// GET login page
router.get('/login', function (req, res) {
  console.log('log: router: get /login :', req.body);
  console.log('log: router: get /login session:', req.session);
  //req.session.loggedIn = false;
  res.render('login-form', {
    thesession : req.session,
    loggedIn : false,
    title: 'Log in'
  });
});

// POST login page
router.post('/login', function (req, res) {
  console.log('log: router: post attempting to login :', req.body);
  if (req.body.username) {
    User.findOne(
      {
        'username': req.body.username,
        'password': req.body.password 
      }, 
      '_id name email username password modifiedOn', 
      function(err, user) {
        if (!err) {
          if (!user){
            res.redirect('/user/login?404=user');
          }else{
//          req.session.user = { "name" : user.name, "email": user.email, "_id": user._id };
            console.log(user);
            req.session.user = { 
              "name" : user.name, 
              "email": user.email, 
              "username" : user.username, 
              "password": user.password, 
              "_id": user._id 
            };
            req.session.loggedIn = true;
            console.log('log: Logged in user: ' + user);
            User.update(
              {_id:user._id},
              { $set: {lastLogin: Date.now()} },
              function(){
                res.redirect( '/user/' );
            });
          }
        } else {
          res.redirect('/user/login?404=error');
        }
      });
  } else {
    res.redirect('/user/login?404=error');
  }
});

// GET logged in user page
router.get('/', function (req, res) {
  console.log('log: router: get / :', req.body);
  console.log('log: router: get / session:', req.session);
  if(req.session.loggedIn === true){
    res.render('user-page', {
      thesession : req.session,
      title: "Datasets [" + req.session.user.name + ']',
      loggedIn : true,
      name: req.session.user.name,
      email: req.session.user.email,
      username: req.session.user.username,
      password: req.session.user.password,
      userID: req.session.user._id
    });
  }else{
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
      arrErrors.push('Please enter a valid name, minimun 5 characters');
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
    errors: arrErrors
 });
});

// POST new user creation form
router.post('/new', function(req, res){
  User.create({
    username: req.body.username,
    password: req.body.password,
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
        "password": req.body.password,
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
        "password": user.password, 
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
        arrErrors.push('Please enter a valid name, minimun 5 characters');
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
      password: req.session.user.password,
      buttonText: "Save",
      errors: arrErrors
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

var doEditSave = function(req, res, err, user) {
  if(err){
    console.log(err);
    res.redirect( '/user/?error=finding');
  } else {
    user.name = req.body.FullName;
    user.email = req.body.Email;
    user.username = req.body.username;
    user.password = req.body.password;
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
  console.log('log: destroy session ',req.session);
  // below doesn't work with express4 and mongostore
  clearSession(req.session, function () {
    res.redirect('/');
  });
});

module.exports = router;