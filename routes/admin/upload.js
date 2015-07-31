// create our router
var express = require('express');
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('log: Some(upload) is happening method[%s] url[%s] path[%s] ', req.method, req.url, req.path);
  console.log("log: Request session: ==> ", req.session," route => ", req.route);
  console.log("log: Request data: ==> ", req.query,"params => ", req.params,"body => ", req.body);
  next();
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.render('admin/upload', {  
    thesession : req.session,
    title: 'Upload Administration' });
});


// on routes that end in /uploads
// ----------------------------------------------------
router.route('/uploads')

// create a upload (accessed at POST http://localhost:8080/uploads)
.post(function(req, res) {
  console.log('log: admin_upload_post body:', req.body);
  var upload = new Upload(req.body.data);    // create a new instance of the Upload model
  console.log('log: admin_upload_post upload:', upload);
  // upload.name = req.body.name;  // set the uploads name (comes from the request)
  upload.save(function(err, upload) {
    if (err) {
      res.send(err); 
    } else {
      res.json({ message: 'Upload created!', row: upload } );
    }
  });
})

// get all the uploads (accessed at GET http://localhost:8080/api/uploads)
.get(function(req, res) {
  console.log("log: Get(1) Request for Data Table made with data: ", req.query);
  //upload_name upload_username upload_status total_works works_accepted  works_rejected  uploader_email  upload_description  upload_timestamp
  Upload.find(
    {},
    'upload_name upload_username upload_status total_works works_accepted works_rejected uploader_email upload_description upload_timestamp',    
    function(err, uploads) {
      if (err)
        res.send(err);
      res.json({ data :uploads});
    }
  );
});


// on routes that end in /uploads/:upload_name
// ----------------------------------------------------
router.route('/uploads/:upload_name')

// get the upload with that id
.get(function(req, res) {
  console.log("log: Get(2) Request for Data Table made with data: ", req.query);
  Upload.findById(
    req.params.upload_name,
    function(err, upload) {
      if (err)
        res.send(err);
      res.json(upload);
    }
  );
})

// update the upload with this id
.put(function(req, res) {
  console.log("log: Put(3) Request for Data Table made with data: ", req.params, req.body);
  var obj = req.body.data;
  obj.updated = new Date();
  delete obj._id;
  Upload.findByIdAndUpdate(
    req.params.upload_name, 
    { $set: obj },
    { new: true },
    function(err, obj) {
      if (err) next(err);
      res.json({ "message": 'Upload updated!', "result" :200, "row" : obj});
    }
  );
})

// delete the upload with this id
.delete(function(req, res) {
    var ids = req.params.upload_name.split(",");
    Upload.remove(
        { _id: { "$in" : ids } },
        function(err, upload) {
            if (err) {
                res.send(err);
                res.json({ error: err });
            }
            else
                res.json({ message: 'Successfully deleted' });
        }
    );
});

// GET Uploads by UserID
// on routes that end in /uploads/:upload_name
// ----------------------------------------------------
router.route('/uploads/byuser/:username')
.get(function (req, res) {
  console.log("log: Getting user uploads");
  if (req.params.username){
    Upload.findByUsername(
      req.params.username,
      function (err, uploads) {
        if(!err){
          //console.log(uploads);
          res.json({
            draw            : req.query.draw,
            recordsTotal    : uploads.length,
            recordsFiltered : uploads.length,
            data : uploads
          });
          //res.json(uploads);
        }else{
          console.log(err);
          res.json({"status":"error", "error":"Error finding uploads"});
        }
      }
    );
  }else{
    console.log("log: No user name supplied");
    res.json({"status":"error", "error":"No user name supplied"});
  }
});

module.exports = router;