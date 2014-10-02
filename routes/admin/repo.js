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
router.route('/byupload/:upload') 
.get(function(req, res) {
  //res.json({ message: 'hooray! welcome to our api!' }); 
  res.render('admin/repo', { 
    loggedIn : req.session.loggedIn,
    title: 'Institution Administration', 
    uploadName :  req.params.upload,
    name:       req.session.user.name,
    email:      req.session.user.email,
    username:   req.session.user.username,
    userID:     req.session.user._id
  });
});

// on routes that end in /repos
// ----------------------------------------------------
router.route('/repos')

// create a repo (accessed at POST http://localhost:8080/repos)
.post(function(req, res) {
  console.log('admin_repo_post body:', req.body);
  var obj = req.body.data;
  console.log('admin_repo_post obj:', obj);
  delete obj._id;
  delete obj.institution_id;
  console.log('admin_repo_post obj-delid:', obj);
  var data = new Institution();    // create a new instance of the Person model
  console.log('admin_repo_post data:', data);
  data.set(obj);
  console.log('admin_repo_post data+obj:', data);
  
  data.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.json({ 
        message : 'Success created!',
        data    : data 
      });
    }
  });
})

// get all the repos (accessed at GET http://localhost:8080/api/repos)
.get(function(req, res) {
  console.log("Get(1) Request for Data Table made with data: ", req.query);

  Institution.find(function(err, repos) {
    if (err) {
      res.send(err);
    } else {
      res.json({ data :repos});
    }
  });
  /*  */
});

// on routes that end in /repos/:repo_id
// ----------------------------------------------------
router.route('/forupload/:upload')
.get(function (req, res) {
  console.log("Getting repository by uploads");
  if (req.params.upload){
    Institution.findByuploadName(
      req.params.upload,
      function (err, data) {
        if(!err){
          console.log(data);
          res.json({
            draw            : req.query.draw,
            recordsTotal    : data.length,
            recordsFiltered : data.length,
            data : data
          });
        }else{
          console.log(err);
          res.json({"status":"error", "error":"Error finding data"});
        }
      }
    );
  }else{
    console.log("No uploadName  supplied");
    res.json({"status":"error", "error":"No uploadName supplied"});
  }
});

// on routes that end in /repos/:repo_id
// ----------------------------------------------------
router.route('/repos/:repo_id')

// get the repo with that id
.get(function(req, res) {
  console.log("Get(2) Request for Data Table made with data: ", req.query);
  Institution.findById(req.params.repo_id, function(err, repo) {
    if (err) {
      res.send(err);
    } else {
      res.json(repo);
    }
  });
})

// update the repo with this id
.put(function(req, res) {
  console.log("Put(3) Request for Data Table made with data: ", req.params, req.body);
  var obj = req.body.data;
  obj.updated = new Date();
  delete obj._id;
  Institution.findByIdAndUpdate(
    req.params.repo_id, 
    { $set: obj },
    { new: true },
    function(err, obj) {
      if (err) {
        next(err);
      } else {
        res.json({ "message": 'Success updated!', "result" :200, "row" : obj});
      }
    }
  );
})

// delete the repo with this id
.delete(function(req, res) {
  Institution.remove({
    _id: req.params.repo_id
  }, function(err, repo) {
    if (err) {
      res.send(err);
    } else {
    res.json({ message: 'Success deleted!' });
    }
  });
});

module.exports = router;