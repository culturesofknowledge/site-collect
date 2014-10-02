// create our router
var express = require('express');
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening method[%s] url[%s] path[%s] ', req.method, req.url, req.path);
  console.log("Request data: ==> ", req.query,"params => ", req.params,"body => ", req.body);
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  //res.json({ message: 'hooray! welcome to our api!' }); 
  res.render('admin/user', { 
    thesession : req.session,
    title: 'User Administration' 
  });
});

// on routes that end in /users
// ----------------------------------------------------
router.route('/users')

// create a user (accessed at POST http://localhost:8080/users)
.post(function(req, res) {
  console.log('admin_user_post body:', req.body);
  
  var user = new User(req.body.data);    // create a new instance of the User model

  user.save(function(err) {
    if (err)
      res.send(err);
    
    res.json({ message: 'User created!' });
  });
  
  
})

// get all the users (accessed at GET http://localhost:8080/api/users)
.get(function(req, res) {
  console.log("Get(1) Request for Data Table made with data: ", req.query);

  User.find(function(err, users) {
    if (err)
      res.send(err);
    
    res.json({ data :users});
  });
  /*  */
});

// on routes that end in /users/:user_id
// ----------------------------------------------------
router.route('/users/:user_id')

// get the user with that id
.get(function(req, res) {
  console.log("Get(2) Request for Data Table made with data: ", req.query);
  User.findById(req.params.user_id, function(err, user) {
    if (err)
      res.send(err);
    res.json(user);
  });
})

// update the user with this id
.put(function(req, res) {
  console.log("Put(3) Request for Data Table made with data: ", req.params, req.body);
  var obj = req.body.data;
  obj.updated = new Date();
  delete obj._id;
  User.findByIdAndUpdate(
    req.params.user_id, 
    { $set: obj },
    { new: true },
    function(err, obj) {
      if (err) next(err);
      res.json({ "message": 'User updated!', "result" :200, "row" : obj});
    }
  );
})

// delete the user with this id
.delete(function(req, res) {
  User.remove({
    _id: req.params.user_id
  }, function(err, user) {
    if (err)
      res.send(err);
    
    res.json({ message: 'Successfully deleted' });
  });
});

module.exports = router;