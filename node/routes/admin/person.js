// create our router
var express = require('express');
var router = express.Router();

var LIMIT = 10;
var SKIP = 0;
var PAGE = 1;

// middleware to use for all requests
router.use(function(req, res, next) {
  // do logging
  console.log('Something is happening method[%s] url[%s] path[%s] ', req.method, req.url, req.path);
  console.log("Request data: ==> ", req.query,"params => ", req.params,"body => ", req.body);
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
  res.render('admin/person', { 
    thesession : req.session,
    title: 'Person Administration' });
});

// on routes that end in /persons
// ----------------------------------------------------
router.route('/persons')

// create a upload (accessed at POST http://localhost:8080/app_xxxs)
.post(function(req, res) {
  console.log('admin_person_post body:', req.body);
  var obj = req.body.data;
  console.log('admin_person_post obj:', obj);
  delete obj._id;
  delete obj.iperson_id;
  console.log('admin_person_post obj-delid:', obj);
  var data = new Person();    // create a new instance of the Person model
  console.log('admin_person_post data:', data);
  data.set(obj);
  console.log('admin_person_post data+obj:', data);
  data.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.json({ message : 'Person created!',
                    data : data });
    }
  });
})

// get all the datas (accessed at GET http://localhost:8080/admin/app_xxx)
.get(function(req, res) {
  console.log("Get(1) Request for Data Table made with data: ", req.query);
  /* */
  var q = {'upload_id': 'deGroot_01'};
  var limit = req.query.length || LIMIT;
  var skip = req.query.start || SKIP;
  //var fields = 'iperson_id  union_iperson_id  primary_name  alternative_names roles_or_titles gender  is_organisation organisation_type date_of_birth_year  date_of_birth_month date_of_birth_day date_of_birth_is_range  date_of_birth2_year date_of_birth2_month  date_of_birth2_day  date_of_birth_inferred  date_of_birth_uncertain date_of_birth_approx  date_of_death_year  date_of_death_month date_of_death_day date_of_death_is_range  date_of_death2_year date_of_death2_month  date_of_death2_day  date_of_death_inferred  date_of_death_uncertain date_of_death_approx  flourished_year flourished_month  flourished_day  flourished_is_range flourished2_year flourished2_month flourished2_day notes_on_person editors_notes';
  //Processing...without datatables plugin
  Person.find(q)
    .limit(limit)
    .skip(skip)
    .exec(function(err, data) {
      if (err) {
        res.send(err);
      } else {
        Person.count(q,function(err, count) {
          if (err) {
            res.send(err);
          } else {
            res.json({
              draw            : req.query.draw,
              recordsTotal    : 438,
              recordsFiltered : count,
              data : data
            });
          }
        });
      }
    });  
});

// on routes that end in /persontables
// ----------------------------------------------------
router.route('/persontables')

// create a upload (accessed at POST http://localhost:8080/app_xxxs)
.post(function(req, res) {
  console.log('admin_persontables_post body:', req.body);
  var data = new Person(req.body.data);    // create a new instance of the Person model
  console.log('admin_persontables_post data:', data);
  data.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.json({ message : 'Person created!',
                    data : data });
    }
  });
})

// get all the datas (accessed at GET http://localhost:8080/admin/app_xxx)
.get(function(req, res) {
  console.log("Get(Table) Request for Data Table made with data: ", req.query);
  /* *
   var fields = 'iperson_id  union_iperson_id  primary_name  alternative_names roles_or_titles gender  is_organisation organisation_type date_of_birth_year  date_of_birth_month date_of_birth_day date_of_birth_is_range  date_of_birth2_year date_of_birth2_month  date_of_birth2_day  date_of_birth_inferred  date_of_birth_uncertain date_of_birth_approx  date_of_death_year  date_of_death_month date_of_death_day date_of_death_is_range  date_of_death2_year date_of_death2_month  date_of_death2_day  date_of_death_inferred  date_of_death_uncertain date_of_death_approx  flourished_year flourished_month  flourished_day  flourished_is_range flourished2_year flourished2_month flourished2_day notes_on_person editors_notes';
   //Processing...without datatables plugin
   Person.find(
     { 'upload_id': 'deGroot_01'},
     null,
     function(err, data) {
     if (err)
   res.send(err);
   res.json({ data :data});
     }
   );
   * */
  //Processing...with pagination
  var limit = req.query.length || LIMIT;
  var skip = req.query.start || SKIP;
  var page = PAGE + ( skip / limit);  // paginate function likes pages
  var q = {'upload_id': 'deGroot_01'};
  console.log(  "q: ",  q,
                "page: ",  page,
                "limit: ",  limit);
  Person.paginate(
    q,
    page,
    limit,
//    { columns: 'title', { populate: 'some_ref' }, sortBy : { title : -1 } },
    function(error, pageCount, paginatedResults, itemCount) {
      if (error) {
        console.log(error);
        res.json({error : error });
      } else {
        console.log('Pages:', pageCount);
        console.log(paginatedResults);
        res.json({
          draw            : req.query.draw,
          recordsTotal    : pageCount * limit,
          recordsFiltered : itemCount,
          data : paginatedResults
        });
      }
    }
  );
  /* *
  //Processing...with datatables plugin
  Person.dataTable(
    req.query,
    { select : { 'upload_id': 'deGroot_01'} },
    function(err, data) {
      if (err) {
        console.log("error with data -err",err," -data ",data);
        res.send(err);
      }
      
      console.log("if error fire up",data);
      res.json(data);
    }
  );
  * */
  
});

// on routes that end in /app_xxxs/:id
// ----------------------------------------------------
router.route('/persons/:id')

// get the upload with that id
.get(function(req, res) {
  console.log("Get(2) Request for Data Table made with data: ", req.params);
  Person.findById(
    req.params.id,
    function(err, data) {
      if (err) {
        res.json({ "status": 'Error', "result" :401, "error" :err });
      } else {
        if(data) {
          delete data._v;
          res.json({ "status": 'Found', "result" :200, "data" :data });
        } else {
          res.json({ "status": 'Not Found', "result" :401, "data" :data });
        }
      }
    }
  );
})

// update the data with this id
.put(function(req, res, next) {
  console.log("Put(3) Request for Data Table made with data: ", req.params, req.body);
  var obj = req.body.data;
  obj.updated = new Date();
  delete obj._id;
  Person.findByIdAndUpdate(
    req.params.id, 
    { $set: obj },
    { new: true },
    function(err, obj) {
      if (err) next(err);
      res.json({ "message": 'Person updated!', "result" :200, "data" : obj});
    }
  );
})

// delete the upload with this id
.delete(function(req, res) {
  Person.remove(
    { _id: req.params.id },
    function(err /*, data*/) {
      if (err)
        res.send(err);    
      res.json({ message: 'Successfully deleted' });
    }
  );
});

module.exports = router;