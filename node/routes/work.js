// create our router
var express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var async   = require('async');

var userHelper = require('../lib/user-helper');

// middleware to use for all requests
router.use(function(req, res, next) {
  console.log('log: Work.js. method[%s] url[%s] path[%s] ', req.method, req.url, req.path);

  next();
});

// works routes
router.route('/byupload/:upload_uuid/:uploadName')
	.get(function (req, res) {

	if( !userHelper.loggedIn( req.session ) ) {
		res.redirect( '/login' );
	}

	  res.render('upload-page', {
	    loggedIn : req.session.loggedIn,
	    title:      "Dataset",
	    uploadName :  req.params.uploadName,
	    uploadUuid :  req.params.upload_uuid,
	    name:       req.session.user.name,
	    email:      req.session.user.email,
	    username:   req.session.user.username,
	    userID:     req.session.user._id,
		  roles: req.session.user.roles
	  });
	});

router.route('/byupload/:upload_uuid/:uploadName/details')
    .get(function (req, res) {
      console.log("router.route('/byupload/:upload_uuid/:uploadName/details')");
      res.render('upload-page-details', {
        loggedIn : req.session.loggedIn,
        title:      req.params.uploadName + " Dataset",
        uploadName :  req.params.uploadName,
        uploadUuid :  req.params.upload_uuid,
        name:       req.session.user.name,
        email:      req.session.user.email,
        username:   req.session.user.username,
        userID:     req.session.user._id,
	      roles: req.session.user.roles
      });
    });

router.route('/byupload/:upload_uuid/:uploadName/print')
    .get(function (req, res) {
      console.log("router.route('/byupload/:upload_uuid/:uploadName/print')");
      res.render('upload-page-print', {
        loggedIn : req.session.loggedIn,
        title:      req.params.uploadName + " Dataset",
        uploadName :  req.params.uploadName,
        uploadUuid :  req.params.upload_uuid,
        name:       req.session.user.name,
        email:      req.session.user.email,
        username:   req.session.user.username,
        userID:     req.session.user._id,
	      roles: req.session.user.roles
      });
    });

router.route('/byupload/:upload_uuid/:uploadName/manifestations')
    .get(function (req, res) {
      console.log("router.route('/byupload/:upload_uuid/:uploadName/manifestations')");
      res.render('upload-page-manifestations', {
        loggedIn : req.session.loggedIn,
        title:      req.params.uploadName + " Dataset",
        uploadName :  req.params.uploadName,
        uploadUuid :  req.params.upload_uuid,
        name:       req.session.user.name,
        email:      req.session.user.email,
        username:   req.session.user.username,
        userID:     req.session.user._id,
	      roles: req.session.user.roles
      });
    });

// GET Works by uploadName
// on routes that end in /works/:upload_name
// ----------------------------------------------------
router.route('/forupload/:upload_uuid')
.get(function (req, res) {
  console.log("log: Getting work by uploads");
  if (req.params.upload_uuid){
    Work.findByUploadUuidWithAllPopulated(
      req.params.upload_uuid,
      function (err, works) {
        if(!err){
	        console.log("Work count:", (works) ? works.length : 0 );
          res.json({
            draw            : req.query.draw,
            recordsTotal    : works.length,
            recordsFiltered : works.length,
            data : works
          });
        }else{
          console.log(err);
          res.json({"status":"error", "error":"Error finding works"});
        }
      }
    );
  }else{
    console.log("log: No uploadName  supplied");
    res.json({"status":"error", "error":"No uploadName supplied"});
  }
});








// on routes that end in /work
// ----------------------------------------------------
router.route('/work')

// create a work (accessed at POST http://localhost:8080/works)
.post(function(req, res) {
  console.log('log: work_post body:', req.body);
  var obj = req.body.data;
  console.log('log: work_post obj:', obj);
  delete obj.iwork_id;
  console.log('log: work_post obj-delid:', obj);
  var work = new Work();    // create a new instance of the Person model
  console.log('log: work_post work:', work);
  work.set(obj);
  console.log('log: work_post work+obj:', work);
  work.save(function(err) {
    if (err){
      console.log("log: Work created error:", err);
      res.json({"status":"Work create/save error ", "error ": err, "data ":work});
    } else {
      //TODO  call edit work from here 
      console.log('log: /work/work/edit/'+work._id);
      //res.json({ message: 'Work created!' });
      Upload.update({ _id : work.upload_uuid},{ $inc:{total_works : 1} },  function (err, numberAffected, raw) {
        if (err) {
          console.log("log: Work created error:", err);
          res.json({"status":"Work create/save error ","error ": err, "data":work});
        } else {
          console.log('log: The number of updated documents was %d', numberAffected);
          console.log('log: The raw response from Mongo was ', raw);
          res.json({"status":"Work created "+work._id, "data":work, "item" : work._id, row : work });
        }
      });
    }
  });
})

// on routes that end in /work/:work_id
// ----------------------------------------------------
router.route('/work/:work_id')

// get the work with that id
.get(function(req, res) {
  console.log("log: Get(Work) Request for Data Table made with data: ", req.params);
  Work.findById(
    req.params.work_id,
    function(err, work) {
      if (err) {
        console.log("log: work get error:", err);
        res.send(err);
      } else{
        res.json(work);
      }
    }
  );
})

// update the work with this id via a put
.put(function(req, res) {
  console.log("log: Put(Work) Request for Data Table made with data: ", req.params, req.body);
  var obj = req.body.data;
  console.log("log: obj->",obj);
  obj.updated = new Date();
  delete obj._id;
  Work.findByIdAndUpdate(
    req.params.work_id, 
    { $set: obj },
    { new: true },
    function(err, obj) {
      if (err) {
        console.log("log: work update error:", err);
        res.send(err);
      } else {
      res.json({ "message": 'Work updated!', "result" :200, "row" : obj});
      }
    }
  );
})

// update the work with this id via a put
.post(function(req, res) {
  console.log("log: Post(Work) Request for Data Table made with data: ", req.params, req.body);
  var obj = req.body.data;
  console.log("log: obj->",obj);
  obj.updated = new Date();
  delete obj._id;
  doCheckBox(req, res, obj);
  Work.findByIdAndUpdate(
    req.params.work_id, 
    { $set: obj },
    { new: true },
    function(err, obj) {
      if (err) {
        console.log("log: Work post update error:", err);
        res.json({"message": 'Work post update error!', "status" : "failed", "error" : err});
      } else {
        res.json({ "message": 'Work post updated!', "result" :200, "row" : obj});
    }
}
  );
  })

// delete the work with this id
.delete(function(req, res) {

	Work.findById(
			req.params.work_id,
		function(err, work) {
			if (err) {
				console.log("log: work get error:", err);
				res.send(err);
			} else {
				// delete manifestations
				Manifestation.findByUploadWorkID( work.upload_uuid, work.iwork_id,
					function( error, mans ) {

						if( mans ) {
							async.each( mans , function(man) {
								Manifestation.remove(
									{_id: man._id},
									function (error, work) {
										if (error) {
											console.error("Manifestation not deleted");
										}
									} )
								},
								function () {
										// Done
								}
							);
						}
					}
				);

				// delete work
				Work.remove(
					{ _id: req.params.work_id },
					function(err, work) {
						if (err){
							res.json(err);
						} else {
							// res.json({ message: 'Successfully deleted' });
							Upload.update({ _id : work.upload_uuid},{ $inc:{total_works : -1} },  function (err, numberAffected, raw) {
								if (err) {
									console.log("log: Work created error:", err);
									res.json({"status":"Work create/save error ","error ": err, "data":work});
								} else {
									console.log('log: The number of updated documents was %d', numberAffected);
									console.log('log: The raw response from Mongo was ', raw);
									res.json({"status":"Work deleted "+work._id, "data":work, "item" : work._id });
								}
							});
						}
					}
				);

			}
		})


});

// on routes that end in /work/edit/:work_id
// ----------------------------------------------------
router.route('/work/edit/:work_id')

// get the work with that id
// GET work edit form
.get(function(req, res){
  console.log("log: Edit(Work) .get Request for Work Edit with params: ", req.params);
  var strWorkName = '',
  strManifestations = '',
  arrErrors = [];
  if (req.session.loggedIn !== true){
    res.redirect('/login');
  } else {
    if (req.params.work_id) {
      //Work.findById( req.params.id, function(err,work) {
      console.log("log: Edit(Work) .2 Request for Work Edit with params: ");
      Work
      .findById( req.params.work_id)
      .populate('createdBy', 'name email')
      .populate('contributors', 'name email')
      .populate('authors', 'primary_name iperson_id union_iperson_id _id')
      .populate('addressees', 'primary_name iperson_id union_iperson_id _id')
      .populate('people_mentioned', 'primary_name iperson_id union_iperson_id _id')
      .populate('origin_id', 'location_name location_id union_location_id _id')
      .populate('destination_id', 'location_name location_id union_location_id _id')
      .populate('place_mentioned', 'location_name location_id union_location_id _id')
      .populate('upload_uuid', 'upload_name _id')
      .exec(function(err,work) {
        console.log("log: Edit(Work) .3 exec for Work Edit with params: ");
        if (err){
          console.log(err);
          res.redirect( req.path + '?err=work404' );
        } else {
          if (req.session.tmpWork) {
            strWorkName = req.session.tmpWork.workName;
            req.session.tmpWork = '';
          } else {
            strWorkName = work.workName;
          }
          if (req.query){
            if (req.query.workName === 'invalid'){
              arrErrors.push('Please enter a valid work name, minimun 5 characters');
            }
          }
          
          console.log('log: Edit work',work);
          res.render('work-form', {            
            thesession  : req.session,
            loggedIn    : req.session.loggedIn,
            title       : 'Editing ' + work.iwork_id + " ",
            name:       req.session.user.name,
            email:      req.session.user.email,
            username:   req.session.user.username,
            userID:     req.session.user._id,
	          roles: req.session.user.roles,
            work:       work,
            uploadName: work.upload_uuid.upload_name,
            uploadUuid: work.upload_uuid._id,
            workID:     req.params.work_id,
            workName:   work.iwork_id,
            buttonText: 'Save work',
            errors: arrErrors
          });
        }
      });
    }else{
      res.redirect('/user?err=no-workID');
      //res.json('/user?err=no-workID');
    }
  }
});

// WORK PERSON =======================================
/**/
// Handle missing and/or deselected checkboxes as false

doCheckBox = function(req, res, obj) {
  console.log("log: process doCheckBox1 \n", obj);
  console.log("log: process doCheckBox2 \n", req.body.data);
  
  for (var i = 0; i < workCheckBox.length; i++) { 
    console.log("log: process doCheckBox3 \n", i , " --> ", workCheckBox[i], " --> " , req.body.data[workCheckBox[i]]);
    obj[workCheckBox[i]] = req.body.data[workCheckBox[i]] == undefined ? false : true;
  }
  console.log("log: process doCheckBox done\n", obj);
};


// Attach item person/addressee/mentioned
router.post('/:id/:item/new',   function(req, res) {
  console.log("log: post item to doAttach");
  doAttach(req, res);
});      

// POST work attach Person
doAttach = function(req, res) {
  console.log("log: Enter doAttach");
  console.log(req.body);
  if (req.body.workID && req.body.itemID) {
    var itemData = {
      "upload_uuid"   : req.body.upload_uuid,
      "name"  : req.body.itemName
    };
    
    req.body.itemData = itemData;
    
    if (req.body.itemType == "person" ) {
      itemData.primary_name = req.body.itemName;
      itemData.iperson_id   = req.body.itemID;
      itemData.union_iperson_id = req.body.emloID;
      doPersonSave (req, res);
    } else {
      itemData.location_name = req.body.itemName;
      itemData.location_id   = req.body.itemID;
      itemData.union_location_id = req.body.emloID;
      doPlaceSave (req, res);
    }
  } else {
    res.json({"status":"?error=no id", "data":"Doing Nothing"});
  }
};

// POST Person form
doPersonSave = function(req, res, again) {
  console.log("log: Enter doAttachPerson");
  console.log("log: Person ",req.body.itemID);
  console.log("log: Person ",req.body.itemData);
  //Person.findByIdAndUpdate( 
  //  req.body.itemID,
  var query = { iperson_id: req.body.itemID, upload_uuid : req.body.upload_uuid };
  Person.findOneAndUpdate(query,
    req.body.itemData,
    {upsert:true},
    function (err, item) {
        // Logic to try again if first attempt returns empty was put in
        if(item === null)   {
            if(!again)  {
                doPersonSave(req, res, true);
            }
            else {
                res.json({"status":"error", "data":"Couldn't find person with iperson id: " + req.body.itemID});
            }
        }
        else {
              onItemSave (req, res, err, item);
        }
    }
  );
};

// POST Place form
doPlaceSave = function(req, res, again) {
  console.log("log: Enter doAttachPlace");
  console.log("log: Place ",req.body.itemID);
  console.log("log: Place ",req.body.itemData);
  //Place.findByIdAndUpdate( 
  //req.body.itemID
  var query = { location_id: req.body.itemID , upload_uuid : req.body.upload_uuid  };
  Place.findOneAndUpdate(query,
    req.body.itemData,
    {upsert:true},
    function (err, item) {
        // Logic to try again if first attempt returns empty was put in
      if(item === null)   {
            if(!again)  {
                doPlaceSave(req, res, true);
            }
            else {
                res.json({"status":"error", "data":"Couldn't find place with location id: " + req.body.itemID});
            }
      }
      else {
        onItemSave (req, res, err, item);
      }
    }
  );
};

var onItemSave = function(req, res, err, item) {
  console.log("log: Enter onItemSave");
  //console.log(item);
  //console.log(req.body);
  var qstring = '';
  if(err){
    console.log(err);
    if (err.name === "ValidationError") {
      for (var input in err.errors) {
        qstring += input + '=invalid&';
        console.log(err.errors[input].message);
      }
    }else{
      res.json({"status":"?error=true", "data":"Doing Nothing"});
    }
    res.json({"status":"error valid", "data":"Doing Nothing"});
  } else {
    console.log('log: Item updated: ' + item);
    doWorkSave (req, res, err, item);
  }
};

var doWorkSave = function(req, res, err, item) {
  console.log("log: Enter doWorkSave");
  //console.log(item);
  //console.log(req.body);
  Work.findById( 
    req.body.workID,
    req.body.data,
    function (err, work) {
      console.log("log: Enter doAttach (work)");
      console.log(work);
      work[req.body.selector].push({
        _id    : item._id,
        itemID : item.itemID,
        name   : req.body.itemName
      });
      work.save(
        function (err, data) {
          if(err){
            console.log(err);
            res.json({"status":"error", "data":"Doing Nothing"});
          }
          console.log("log: data id " + data._id + " added");
          res.json({
            "status"  : "added",
            "data"    : data,
            "item"    : item,
            "itemType": req.body.itemType
          });
        });
    }
  );
};
      
// DELETE work remove Item
router.delete('/:workID/:itemSelector/:itemID/delete', function(req, res) {
	console.log("log: router.delete item");
	console.log("log: params",req.params);
	console.log("log: body",req.body);

	Work.findById(
		req.params.workID,
		function (err, work) {
		    console.log("log: Enter doRemove item from (work) array");
		    console.log(work);

			var theId = new ObjectId(req.params.itemID);

			work[req.params.itemSelector].pull({
				_id : theId
			});

			work.save( function (err, data) {
				if(err){
					console.log(err);
					res.json({"status":"error", "data": data});
				}

				// Find all other uses of this person, if none found, remove it.
				var	query = null,
					itemCollection = null;

				if( ["authors","addressees","people_mentioned"].indexOf( req.params.itemSelector) > -1) {
					query = { "$or" : [
						{ "authors" : theId},
						{"addressees" : theId },
						{"people_mentioned" : theId }
					]};
					itemCollection = Person;
				}
				else if( ["origin_id","destination_id","place_mentioned"].indexOf( req.params.itemSelector) > -1 ) {
					query = { "$or" : [
						{ "origin_id" : theId},
						{"destination_id" : theId },
						{"place_mentioned" : theId }
					]};
					itemCollection = Place;
				}

				query["upload_uuid"] = work._doc.upload_uuid;

				Work.find(
					query,
					function (err, works) {
						console.log(works);

						if (works.length === 0) {
							// Delete from main collection item

							itemCollection.remove(
								{
									"_id" : theId,
									"upload_uuid" : work._doc.upload_uuid
								},
								function( err ) {
									if( err ) {
										console.log("ERROR: Failed to remove leftover object")
									}
								}
							)
						}

						console.log("log: data now " + data + " delete saved");
						res.json({"status":"deleted", "data":data, "item" : theId });
					}
				)
			});

		}
  );
});
    
// POST work remove Person
router.post('/:id/person/delete', function(req, res) {
  console.log("log: Post delete manifestation");
  console.log(req.body);
  if (req.body.workID && req.body.personID) {
      Workreq.body.workID,
      req.body.selector,
      Work.save(
        function (err, data) {
          if(err){
            console.log(err);
            res.json({"status":"delete error", "data":"Doing Nothing"});
          }
          console.log("log: data id " + data._id + " deleted");
          res.json({"status":"deleted", "data":"Doing Nothing"});
        }
    );
  }
});

// POST work remove Item
router.post('/:id/item/delete', function(req, res) {
  console.log("log: Post delete item");
  console.log(req.body);
  if (req.body.workID && req.body.itemID) {
    Workreq.body.workID,
    req.body.selector,
    Work.save(
      function (err, data) {
        if(err){
          console.log(err);
          res.json({"status":"delete error", "data":data});
          }
          console.log("log: data id " + data._id + " deleted");
          res.json({"status":"deleted", "data":data});
        }
          );
      }
});

// GET Manifestations by upload and workID
// on routes that end in /manifestation/:work_id
// ----------------------------------------------------
router.route('/manifestation/:upload/:work_id')
.get(function (req, res) {
  console.log("log: Getting manifestations for work", req.params);
  if (req.params.upload && req.params.work_id){
    Manifestation.findByUploadWorkID(
      req.params.upload,
      req.params.work_id,
      function (err, manifestations) {
        if(!err){
          console.log(manifestations);
          res.json({
            draw            : req.query.draw,
            recordsTotal    : manifestations.length,
            recordsFiltered : manifestations.length,
            data : manifestations
          });
        }else{
          console.log(err);
          res.json({"status":"error", "error":"Error finding manifestations"});
        }
      }
    );
  }else{
    console.log("log: No uploadName and/or workId  supplied");
    res.json({"status":"error", "error":"No uploadName and/or workId supplied"});
  }
});

router.route('/manifestation/:upload')
	.get(function (req, res) {
		console.log("log: Getting manifestations for work", req.params);
		if (req.params.upload ){
			Manifestation.findByUploadID(
				req.params.upload,
				function (err, manifestations) {
					if(!err){
						console.log(manifestations);
						res.json({
							draw            : req.query.draw,
							recordsTotal    : manifestations.length,
							recordsFiltered : manifestations.length,
							data : manifestations
						});
					}else{
						console.log(err);
						res.json({"status":"error", "error":"Error finding manifestations"});
					}
				}
			);
		}else{
			console.log("log: No uploadName  supplied");
			res.json({"status":"error", "error":"No uploadName supplied"});
		}
	});

// on routes that end in /manifestation
// ----------------------------------------------------
router.route('/work/:work_id/manifestation')

// create a work (accessed at POST http://localhost:8080/works)
.post(function(req, res) {
  console.log('log: /manifestation/_post body:', req.body);
  var manifestation = new Manifestation(req.body.data);    // create a new instance of the Work model
  console.log('log: /manifestation/_post work:', manifestation);
  // work.name = req.body.name;  // set the works name (comes from the request)
  manifestation.save(function(err) {
    if (err){
      console.log("log: manifestation created error:", err);
      res.send(err);
    } else {
      //TODO  call edit work from here 
      console.log("log: repository add test 1",req.body.data.repository_id);
      if ( req.body.data.repository_id ) {
        console.log("log: repository add test 2",req.body.data.repository_id);
        doRepositorySave(req, res);
      }
      res.json({ message: 'manifestation created!' });
    }
  });
})

// POST Repository form
doRepositorySave = function(req, res) {
  console.log("log: Enter doRepositorySave");
  var theId = new ObjectId(req.body.data.upload_uuid);
  
  var itemData = {
    "upload_uuid"    : new ObjectId(req.body.data.upload_uuid),
    "institution_id" : req.body.data.repository_id,
    "union_institution_id" : req.body.data.repository_id
  };
  if ( req.body.data.repository_id >= 1000000) {
    console.log("log: repository check local",req.body.data.repository_id);
    itemData.union_institution_id = null;
  }
  req.body.itemData = itemData;
  //console.log("log: Institution ",req.body.itemID);
  console.log("log: Institution ",req.body.itemData);
  //Repository.findByIdAndUpdate( 
  //req.body.itemID
  var query = { institution_id: req.body.data.repository_id , upload_uuid : req.body.data.upload_uuid  };
  Institution.findOneAndUpdate(query,
    req.body.itemData,
    {upsert:true},
    function (err, item) {
      if (err) res.json({ message: 'manifestation repo error', data: err });
   
      console.log("log: repository save test 3",req.body.data.repository_id);
      return;
      res.json({ "message": "manifestation repo saved ", "data" : item });
    }
  );
  
  /*
  var query = { 
  repository_id: req.body.repository_id , 
  upload_uuid : req.body.upload_uuid  };
  Repository.findOneAndUpdate(query,
    req.body.itemData,
    {upsert:true},
    function (err, item) {
      onItemSave (req, res, err, item);
    }
  );
  */

};

checkRepositoryRemove = function( repository_id, upload_uuid, callback ) {

	Manifestation.findByUploadID(
		upload_uuid,
		function( error, mans ) {
			if( error ) {
				// something
			}
			else {

				for( var i=0; i<mans.length; i++ ) {
					if( mans[i].repository_id === repository_id ) {
						return callback(); // don't need to delete, it's still used in the upload.
					}
				}

				var query = { institution_id: repository_id , upload_uuid : upload_uuid  };
				Institution.remove(
					query,
					function( error ) {
						if( error ) {
							console.log("Error: Can't delete repository id:", repository_id);
							callback(error);
						}
						else {
							callback();
						}
					}
				)
			}
		}
	)

};



// on routes that end in /work/:work_id/manifestation/:man_id
// ----------------------------------------------------
router.route('/work/:work_id/manifestation/:man_id')

// get the work with that id
.get(function(req, res) {
  console.log('log: /manifestation/.get body:', req.body);
  Manifestation.findById(
    req.params.man_id,
    function(err, manifestation) {
      if (err) {
        console.log("log: manifestation get error:", err);
        res.send(err);
      } else{
        res.json(manifestation);
      }
    }
  );
})

// update the work with this id
.put(function(req, res) {
  console.log("log: /manifestation/.put: made with params: ", req.params,' body ', req.body);
  var obj = req.body.data;
  obj.updated = new Date();
  delete obj._id;
  Manifestation.findByIdAndUpdate(
    req.params.man_id, 
    { $set: obj },
    { new: true },
    function(err, obj) {
      if (err) {
        console.log("log: manifestation update error:", err);
        res.json({ "message": 'manifestation update error', "data": err });
      } else {
          console.log("log: repository save test 1",req.body.data.repository_id);
        if ( req.body.data.repository_id ) {
          console.log("log: repository save test 2",req.body.data.repository_id);
          doRepositorySave(req, res);
        }
        res.json({ "message": 'manifestation updated!', "result" :200, "row" : obj});
      }
    }
  );
})

	// delete the manifestation with this id
	.delete(function(req, res) {
		console.log('log: /manifestation/.delete:', req.params);

		removeManifestation( req, res );
	});


// Remove a manifestation
router.route('/manifestation/remove/:man_id')

	.delete(function(req, res) {
		console.log('log: /manifestation/.delete:', req.params);
		removeManifestation( req, res );
	});


function removeManifestation( req, res ) {
	Manifestation.findById(
		req.params.man_id,
		function(err, manifestation) {
			var repo_id = manifestation.repository_id,
				upload_uuid = manifestation.upload_uuid;
			if (err)  res.json({"message": 'manifestation find error.', "data" : err});

			Manifestation.remove(
				{ _id: req.params.man_id },
				function(err) {
					if (err)  {
						res.json({"message": 'manifestation error', "data" : err});
					}
					else {
						checkRepositoryRemove( repo_id, upload_uuid, function(error) {
							if( error ) {
								res.json({"message": 'Manifestation deletion error',data:error});
							}
							else {
								res.json({"message": 'Manifestation Deleted'});
							}
						} );
					}
				}
			);
		}
	);
}

// GET Work by  workID
// on routes that end in /language/:work_id
// ----------------------------------------------------
router.route('/language/:work_id')
.get(function (req, res) {
  console.log("log: Getting languages for work", req.params);
  if (req.params.work_id){
    console.log("log: Getting languages for work.1",req.params.work_id);
    Work.findById(
      req.params.work_id,
      'languages',
      function (err, work) {
        if(!err){
          console.log(work.languages);
          res.json({
            draw            : req.query.draw,
            recordsTotal    : work.languages.length,
            recordsFiltered : work.languages.length,
            data : work.languages
          });
        }else{
          console.log("log: Getting languages for work.2");
          console.log(err);
          res.json({"status":"error", "error":"Error finding languages"});
        }
      }
    );
  }else{
    console.log("log: No workId supplied");
    res.json({"status":"error", "error":"No workId supplied"});
  }
});

// on routes that end in /language
// ----------------------------------------------------
router.route('/work/:work_id/language')

// create a work (accessed at POST http://localhost:8080/works)
.post(function(req, res) {
  console.log('log: /language/_post body:', req.body);
  var obj = req.body.data;
  delete obj._id;
  Work.findByIdAndUpdate(
    req.params.work_id, 
    {$push: { "languages": obj }},
    { new: true , upsert : true },
    function(err, obj) {
      if (err) {
        console.log("log: language create error:", err);
        res.send(err);
      } else {
        res.json({ "message": 'language created!', "result" :200, "row" : obj});
      }
    }
  )
})

// on routes that end in /work/:work_id/language/:lang_id
// ----------------------------------------------------
router.route('/work/:work_id/language/:lang_id')

// get the work with that id
.get(function(req, res) {
  console.log('log: /language/.get body:', req.body);
  Work.findById(
    req.params.work_id,
    'languages',
    function(err, work) {
      if (err) {
        console.log("log: language get error:", err);
        res.send(err);
      } else{
        var thisLang = work.languages.id(req.params.lang_id);
        console.log("log: Individual language document",thisLang);
        res.json(thisLang);
      }
    }
  );
})

// update the work with this id
.put(function(req, res) {
  console.log("log: /language/.put: made with params: ", req.params,' body ', req.body);
  var obj = req.body.data;
  delete obj._id;
  Work.findById(
    req.params.work_id, 
    function(err, work) {
      if (err) {
        console.log("log: language update error:", err);
        res.send(err);
      } else {
        var thisLang = work.languages.id(req.params.lang_id);
        thisLang.language_code = obj.language_code;
        thisLang.language_name = obj.language_name;
        thisLang.language_note = obj.language_note;
        work.save(
          function (err, data) {
            if(err){
              console.log(err);
              res.json({"status":"error", "data": data});
            }
            console.log("log: data now " + data + " update saved");
            res.json({ "message": 'language updated!', "result" :200, "row" : thisLang });
          }
        );  
      }
    }
  );
})

// delete the language with this id
.delete(function(req, res) {
  console.log('log: /language/.delete:', req.params);
  console.log("log: params",req.params);
  console.log("log: body",req.body);
  Work.findById( 
    req.params.work_id,
    function (err, work) {
      console.log("log: Pull item from (work.language) array");
      console.log(work);
      var theId = new ObjectId(req.params.lang_id);
      work.languages.pull({ _id : theId  });
      work.save(
        function (err, data) {
          if(err){
            console.log(err);
            res.json({"status":"error", "data": data});
          }
          console.log("log: data now " + data + " delete saved");
          res.json({"status":"deleted", "data":data, "item" : theId });
        }
      );
    }
  );
});
    
// GET Work by  workID
// on routes that end in /resource/:work_id
// ----------------------------------------------------
router.route('/resource/:work_id')
.get(function (req, res) {
  console.log("log: Getting resources for work", req.params);
  if (req.params.work_id){
    console.log("log: Getting resources for work.1",req.params.work_id);
    Work.findById(
      req.params.work_id,
      'resources',
      function (err, work) {
        if(!err){
          console.log(work.resources);
          res.json({
            draw            : req.query.draw,
            recordsTotal    : work.resources.length,
            recordsFiltered : work.resources.length,
            data : work.resources
          });
        }else{
          console.log("log: Getting resources for work.2");
          console.log(err);
          res.json({"status":"error", "error":"Error finding resources"});
        }
      }
    );
  }else{
    console.log("log: No workId supplied");
    res.json({"status":"error", "error":"No workId supplied"});
  }
});

// on routes that end in /resource
// ----------------------------------------------------
router.route('/work/:work_id/resource')

// create a work (accessed at POST http://localhost:8080/works)
.post(function(req, res) {
  console.log('log: /resource/_post body:', req.body);
  var obj = req.body.data;
  delete obj._id;
  Work.findByIdAndUpdate(
    req.params.work_id, 
    {$push: { "resources": obj }},
    { new: true , upsert : true },
    function(err, obj) {
      if (err) {
        console.log("log: resource create error:", err);
        res.send(err);
      } else {
        res.json({ "message": 'resource created!', "result" :200, "row" : obj});
      }
    }
  )
})

// on routes that end in /work/:work_id/resource/:resource_id
// ----------------------------------------------------
router.route('/work/:work_id/resource/:resource_id')

// get the work with that id
.get(function(req, res) {
  console.log('log: /resource/.get body:', req.body);
  Work.findById(
    req.params.work_id,
    'resources',
    function(err, work) {
      if (err) {
        console.log("log: resource get error:", err);
        res.send(err);
      } else{
        var thisResource = work.resources.id(req.params.resource_id);
        console.log("log: Individual resource document",thisResource);
        res.json(thisResource);
      }
    }
  );
})

// update the work with this id
.put(function(req, res) {
  console.log("log: /resource/.put: made with params: ", req.params,' body ', req.body);
  var obj = req.body.data;
  delete obj._id;
  Work.findById(
    req.params.work_id, 
    function(err, work) {
      if (err) {
        console.log("log: resource update error:", err);
        res.send(err);
      } else {
        var thisResource = work.resources.id(req.params.resource_id);
        //thisData.resource_id      = obj.resource_id;
        thisResource.resource_name    = obj.resource_name;
        thisResource.resource_details = obj.resource_details;
        thisResource.resource_url     = obj.resource_url;
        work.save(
          function (err, data) {
            if(err){
              console.log(err);
              res.json({"status":"error", "data": data});
            }
            console.log("log: data now " + data + " update saved");
            res.json({ "message": 'resource updated!', "result" :200, "row" : obj});
          }
        );  
      }
    }
  );
})

// delete the resource with this id
.delete(function(req, res) {
  console.log('log: /resource/.delete:', req.params);
  console.log("log: params",req.params);
  console.log("log: body",req.body);
  Work.findById( 
  req.params.work_id,
  function (err, work) {
    console.log("log: Pull item from (work.resource) array");
    console.log(work);
    //var theId = new ObjectId(req.params.resource_id);
    work.resources.id(req.params.resource_id).remove();
    work.save(
      function (err, data) {
        if(err){
          console.log(err);
          res.json({"status":"error", "data": data});
        }
        console.log("log: data now " + data + " delete saved");
        res.json({"status":"deleted", "data":data, "item" : req.params.resource_id });
      }
        );
  } 
    );
});

var workCheckBox = [
  "date_of_work_inferred", 
  "date_of_work_uncertain",
  "date_of_work_approx",   
  "date_of_work2_inferred", 
  "date_of_work2_uncertain",
  "date_of_work2_approx",   
  "authors_inferred",         
  "authors_uncertain",        
  "addressees_inferred",      
  "addressees_uncertain",     
  "origin_inferred",          
  "origin_uncertain",         
  "destination_inferred",     
  "destination_uncertain",    
  "place_mentioned_inferred", 
  "place_mentioned_uncertain",
  "mentioned_inferred",       
  "mentioned_uncertain"
];

module.exports = router;
