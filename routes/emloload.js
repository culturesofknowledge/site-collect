var express = require('express');
var router  = express.Router();
var async   = require('async');
var _       = require('underscore');
// Postgresql database
var pg = require('pg');

var doRepositories = require('./repoload');
var doWorkRecord = require('./workload');
var doRecord = require('./emloload.inc/record.inc.js');
var workMap  = require('./emloload.inc/workmap.inc.js');
var locationMap  = require('./emloload.inc/locationmap.inc.js');

//console.log(config.conString);

//require the module
var mm = require('../data/sql/emlo_ouls_sql1');
var cofk_collect_upload        = mm.cofk_collect_upload;
var cofk_collect_work          = mm.cofk_collect_work;
var cofk_collect_manifestation = mm.cofk_collect_manifestation;
var cofk_collect_institution   = mm.cofk_collect_institution;
var cofk_collect_location      = mm.cofk_collect_location;
var cofk_collect_person        = mm.cofk_collect_person;

router.get('/flush/:upload_uuid', function(req, res, next) {
     console.log("log: emloload: Call find Upload");
     doSeries(req, res, next);
});      

router.post('/flush/:upload_uuid', function(req, res, next) {
  console.log("log: emloload: Post find Upload");
  doSeries(req, res, next);
});      

global.doSeries = function(req, res, next) {
  var locals = { "upload_uuid" : req.params.upload_uuid};
  //var upload_id;
  //var client;
  async.series(
    [
      // Find upload by Id
      function(callback) {
        dofindUpload(
          locals.upload_uuid, 
          function(err, upload) {
            if (err) { return callback(err); }
            console.log("log: dofindUpload -3",upload);
            locals.upload = upload;
            locals.upload_name = upload.upload_name;
            console.log("log: dofindUpload -4",locals.upload);
            callback();
          }
        );
      },
      // Find Upload in PG
      function(callback) {
        console.log("log: dofindUploadPG -5",locals.upload);
        dofindUploadPG(
          locals.upload_uuid, 
          function(err, result) {
            if (err) { return callback(err); }
            locals.result = result;
            console.log("log: dofindUploadPG -6",locals.upload);
            callback();
          }
        );
      },
      // doinsertUpload
      function(callback) {
        console.log("log: doinsertUpload -7",locals.upload);
        doinsertUpload(
          locals, 
          function(err, result) {
            if (err) { return callback(err); }
            locals.pgUploadId = result;
            locals.upload.upload_id = result;
            console.log("log: doinsertUpload -8",locals.upload);
            callback();
          }
        );
      },
      // doRepositories
      function(callback) {
        console.log("log: doRepositories -8");
        doRepositories(
          locals, 
          function(err /*, result*/) {
            if (err) { return callback(err); }
            console.log("log: doRepositories -9");
            callback();
          }
        );
      },
      // processUpload
      function(callback) {
        console.log("log: processUpload -10");
        processUpload(
          locals, 
          function(err /*, result*/) {
            if (err) { return callback(err); }
            console.log("log: processUpload -11");
            callback();
          }
        );
/**/
      },
        // doWorkRecord
        function(callback) {
            console.log("log: doWorkRecord -12",locals.upload);
            locals.mapping = {
                "collection" : Work,
                "pgTable"  : cofk_collect_work,
                //    "pgMap"    : doPgSqlMap
                "pgMap"    : doPgWorkSqlMap
            };
            doWorkRecord(
                locals,
                function(err /*, result*/) {
                    if (err) { return callback(err); }
                    console.log("log: doWorkRecord -13");
                    callback();
                }
            );
        },
        // Clean up unused (hanging) people/places etc
        function(callback) {
            console.log("log: doCleanup",locals.upload);

            doCleanup( locals.upload, function(err) {
                callback(err);
            } );
        }
    ],
    function(err) {
      if (err) {
        if (req.xhr) {
          res.status(500).send({ "error" : err.message/*, "stack" : err.stack*/});
          return;
        } else {
          return next(err);
        }
      }
      console.log('doSeries finished\n',locals.mapping.collection.modelName);  
      //client.end();  
      res.json({"status":"done", "data" : locals.upload });
    }
  );
};

function dofindUpload(uuid, callback) {
  //
  // Get upload model from uuid (upload_uuid)
  //

  console.log("log: Get(2) Request for Upload transfer: ", uuid);
  Upload.findById(
    uuid,
    function(err, upload) {
	    if (err) { return callback(err) }
	           //Check that an upload was found
	    if (!upload) {
	      console.log("log: dofindUpload -1",uuid);
	      callback(new Error('No upload with uuid '+uuid+' found.'));
	    }
	    console.log("log: dofindUpload -2",uuid);
	    callback(null, upload);
    }
  );
}

function dofindUploadPG(uuid, callback) {
  //
  // Check for Upload in PG database
  //

  console.log("log: dofindUploadPG","\nuuid:",uuid);
  client = new pg.Client(config.conString);
  console.log("log: before connect "+uuid);
  client.connect();
  
  var q = cofk_collect_upload
  .select(cofk_collect_upload.star())
  .from(cofk_collect_upload)
  .where(
    cofk_collect_upload._id.equals(uuid)
  )
  .toQuery();
  
  console.log("log: query :",q); //SELECT "user".* FROM "user"
    
  //query is parameterized by default
  var query = client.query( q );
  var rows = []; //example1. method
  
  query.on('error', function(error) {
    //handle the error
    callback(error);
  });
  
  query.on("row", function (row, result) {
    //fired once for each row returned
    rows.push(row);     //example1. method
    result.addRow(row); //example2. method
  });
  
  query.on("end", function (result) {
    //fired once and only once, after the last row has been returned and after all 'row' events are emitted
    //in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
    console.log("log: dofindUploadPG  -- " ,result.rowCount + ' rows were received');
    //console.log("\ndofindUploadPG  --rows: " , rows );
    //client.end();
    callback(null, result);
  }); 
  
}

function doinsertUpload(data, callback) {
  //
  // Create or update if we already have this upload in collect.
  //

  console.log("log: doinsertUpload Received with data"  , "\nrows\n[" , data.result.rows[0] , "]\nCount\n[" , data.result.rows.length  , "]\nUpload\n" , data.upload );

  var q,obj = doPgSqlMap(cofk_collect_upload, data.upload);

  obj._id = data.upload['_id'].toString() ;

  // This is overwritten to a late change in instruction and upload name is ignored for now.
  obj.upload_description = data.upload['upload_name'] ;
  //obj['upload_name'] = data.upload['upload_description'] ;

  obj.upload_timestamp = (obj.upload_timestamp == null) ? new Date() : obj.upload_timestamp ;
  obj.upload_status = (obj.upload_status < 1) ? 1 : obj.upload_status ;

  delete obj.upload_id;

  var pgUploadId;
  if (data.result.rows < 1) { // i.e. equal to zero...!?
    console.log('upload for insert \n',obj);  
    q = cofk_collect_upload
    .insert(obj)
    .returning(cofk_collect_upload.star())
    .toQuery();
    
    console.log("log: query :",q);
    client.query( q )
    .on('error', function(error) {
      //handle the error
      console.log("log: doinsertUpload row insert error " , error , "\n");
      callback(error);
    })
    .on('row', function (row) {
      console.log("log: doinsertUpload row insert Responded with " , row , "\n");
      pgUploadId = row.upload_id;
      callback(null, pgUploadId);
    });
  } else {
    console.log('upload for update \n',obj);
    pgUploadId = data.result.rows[0].upload_id;
    q = cofk_collect_upload
    .update(obj)
    .where(
      cofk_collect_upload._id.equals(obj._id)
    )
    .toQuery();
    //query is parameterized by default
    console.log("log: query :",q); 
    var query = client.query( q );
    query.on('error', function(error) {
      //handle the error
      console.log("log: doupsertUpload row update error " , error , "\n");
      callback(error);
    });
    query.on("row", function (row, result) {
      console.log("log: doupsertUpload2 query on " , row," \nresult", result , "\n");
      result.addRow(row);
    });    
    query.on("end", function (result) {
      console.log("log: doupsertUpload end update Responded with " , result , "\n");
      callback(null, pgUploadId);
    }); 
  }
  //dofindWorkbyUpload(req, res);  // this moved to insert/update
}

global.processUpload = function(data, callback) {
  //
  // Loop around creating the objects we need in the postgress collect table
  //
  var locals = data;
  var mappings = { };
  mappings["Institution"] = { 
    "collection" : Institution,
    "pgTable"    : cofk_collect_institution,
    "pgMap"      : doPgSqlMap
  };
  mappings["Location"] = { 
    "collection" : Location,
    "pgTable"    : cofk_collect_location,
    "pgMap"      : doPgLocSqlMap
  };
  mappings["Person"] = {
    "collection" : Person,
    "pgTable"    : cofk_collect_person,     
    "pTable"     : mm.cofk_union_person,
    "person_id"  : "person_id",
    "pgGetId"    : doGetPersonId,
    "pgMap"      : doPgSqlMap
  };
  mappings["Work"] = {
    "collection" : Work,
    "pgTable"  : cofk_collect_work,
//    "pgMap"    : doPgSqlMap
    "pgMap"    : doPgWorkSqlMap
  };
  mappings["Manifestation"] = {
    "collection" : Manifestation,
    "field"      : "manifestation",
    "field_key"  : "manifestation_id",
    "pgTable"    : cofk_collect_manifestation,
    "pgMap"      : doPgSqlMap
  };
  
  var procTab = [
    "Institution",
    "Location",
    "Person",
    "Work",
    "Manifestation"
  ];
  
  async.eachSeries(
    //doArray
    procTab,
    function(item, callback) {
      locals.mapping = mappings[item];
      console.log("log: doMapping -0 ",item,locals.mapping.collection.modelName);
      doRecord(
        locals, 
        function(err, records) {
          if (err) { return callback(err); }
          console.log("log: doMapping -1 ",locals.mapping.collection.modelName);
          locals.records = records;
          callback();
        }
      );
    },
    function(err) {
      if (err) { return callback(err); }

      console.log('doProcess(Institution,Location,Person,Work,Manifestation) \n');  
      callback();
    }
  );  
};

global.toPg = function(x) {
  //
  // Convert javascript values to postgress
  //
  switch (x) {
    case undefined :
      return "";
    case true :
      return 1;
    case false :
      return 0;
    default:
      return x;
  }
};

global.doPgSqlMap = function( table, data ) {
  //
  // Create an object with column name members
  //
  console.log("log: process doPgSqlMap ");
  var columns = table.columns,
    name, value,
    obj = {};

  for (var i=0;i<columns.length;i++) {
    name = columns[i].name;
    value = data[name];

    if ( value !== undefined ) {

      if (name !== 'image_filenames') {
        obj[name] = toPg(value);
        console.log("name [", i, "] --> ", name, " --> ", value, " --> ", obj[name]);
      }
      else {
        console.log("nulling image_filenames from manifestation");
        obj[name] = null;
      }
    }
  }
  //console.log("\nprocess doPgSqlMap done\n", obj);
  return obj;
};

global.doPgLocSqlMap = function(table, data ) {
  console.log("log: process doPgLocSqlMap ", data);
  var x = table.columns;
  var theName, theValue ;
  var obj = {};
  var i = 0;
  console.log("log: locationMap ",locationMap);
  for ( theName in locationMap ){
    console.log("log: handle locationMap[theName] ",locationMap[theName]);
    console.log("log: handle data[locationMap[theName]]",data[locationMap[theName]]);
    theValue = data[locationMap[theName]];
    if ( theValue !== undefined ) {
      obj[theName] = toPg(theValue) ;
      console.log(
        "theName [", i++ , 
        "] --> ", theName, 
        " --> " , theValue,
        " --> " , obj[theName]
      );
    }
  }
  return obj;
};

global.doPgWorkSqlMap = function(table, data ) {
  console.log("log: process doPgWorkSqlMap ");
  var x = table.columns;
  var theName, theValue ;
  var obj = {};
  //for (var i=0;i<x.length;i++) {
    //theName  = x[i].name;
  var i = 0;
  for ( theName in workMap ){

    theValue = data[workMap[theName]];

    if ( theValue  !== undefined && workPlaceFlds.indexOf(theName) > -1 ) {

      if( theValue.length && theValue.length > 0 ) {
          theValue = theValue[0].location_id;
      }
      else {
          // Setting to null means we get a NULL value in the database (i.e. it will update anything that may be set already)
          // MATTT: TODO: Should we be setting all the values which are undefined to null also?
          theValue = null;
      }
    }

    if ( theValue !== undefined ) {

      obj[theName] = toPg(theValue) ;
      if ( workNumericFlds.indexOf(theName) > -1 ){
        console.log("log: handle numeric field here ",theName);
        obj[theName] = (obj[theName] === "") ? null : obj[theName] ;
      }
      console.log(
        "theName [", i++ , 
        "] --> ", theName, 
        " --> " , theValue,
        " --> " , obj[theName]
      );
    }
  }
  //console.log("\nprocess doPgWorkSqlMap done\n");
  return obj;
};

global.doGetPersonId = function(table, data, callback) {
  console.log("log: doGetPersonId -",data.iperson_id);
  // Find person_id for existing person
  var q = table
  .select(table.person_id)
  .from(table)
  .where( table.iperson_id.equals(data.iperson_id) )
  .toQuery();
  
  client.query( q , function(error, result) {
    if(error) { callback(error); }
    console.log('doGetPersonId ',result.rows.length + ' person_id rows were received');
    if (result.rows.length < 1) {
      data.person_id = null;
    } else {
      data.person_id = result.rows[0].person_id;
    }
    console.log("log: data.person_id:",data.person_id);
    callback(null, data);
  });
};


global.doCleanup = function( uploadData, callbackComplete ) {

    async.series(
        [
            function( callbackStepDone ) {
                doCleanupPeople( uploadData.upload_id, function( error ) {
                    callbackStepDone( error );
                })
            },
            function( callbackStepDone ) {
                doCleanupLocations( uploadData.upload_id, function( error ) {
                    callbackStepDone( error )
                })
            }
        ],

        function( error ) {
            callbackComplete( error );
        }
    );
};

global.doCleanupLocations = function( uploadId, callbackComplete ) {

    var links = [];

    async.series(
        [
            // First get a list of all locations we link to.
            function( callbackDone ) {
                // Work's destination and origin
                var q = mm.cofk_collect_work
                    .select( mm.cofk_collect_work.origin_id, mm.cofk_collect_work.destination_id )
                    .where(
                    mm.cofk_collect_work.upload_id.equals( uploadId )
                    )
                    .toQuery();

                client.query( q )
                    .on("row", function( row ) {
                        if (row.origin_id) {
                            links.push(row.origin_id);
                        }
                        if( row.destination_id ) {
                            links.push(row.destination_id);
                        }
                    })
                    .on("error", function (error) {
                        callbackDone(error);
                    })
                    .on("end", function () {
                        callbackDone();
                    })
            },
            function( callbackDone ) {
                // Locations mentioned
                var q = mm.cofk_collect_place_mentioned_in_work
                    .select( mm.cofk_collect_place_mentioned_in_work.location_id )
                    .where(
                    mm.cofk_collect_place_mentioned_in_work.upload_id.equals( uploadId )
                )
                    .toQuery();

                client.query( q )
                    .on("row", function( row ) {
                        links.push( row.location_id )
                    })
                    .on("error", function (error) {
                        callbackDone(error);
                    })
                    .on("end", function () {
                        callbackDone();
                    })
            }
        ],
        function( error ) {

            if (!error) {
                doCleanupObjects( _.uniq( links ), cofk_collect_location, "location_id", uploadId, function( error ) {
                    callbackComplete( error );
                } )
            }
            else {
                callbackComplete( error );
            }
        }
    );

};

global.doCleanupPeople = function( uploadId, callbackComplete ) {
    var
        mainTable = cofk_collect_person,
        linkTables = [
            mm.cofk_collect_author_of_work,
            mm.cofk_collect_addressee_of_work,
            mm.cofk_collect_person_mentioned_in_work
        ],
        mainField  = "iperson_id";

    var links = [];
    async.eachSeries(
        linkTables, // TODO: We could probably UNION the data rather than making several database selects, the query syntax gets awkward though...
        function( table, callbackDone ) {
            // Get a list of all the people links to author, addressee or mentioned
            var q = table
                .select( table[mainField] )
                .where(
                table.upload_id.equals( uploadId )
            )
                .toQuery();

            client.query( q )
                .on("row", function( row ) {
                    links.push( row[mainField] )
                })
                .on("error", function (error) {
                    callbackDone(error);
                })
                .on("end", function () {
                    callbackDone();
                })
        },
        function( error ) {
            if (!error) {
                doCleanupObjects( _.uniq( links ), mainTable, mainField, uploadId, function( error ) {
                    callbackComplete( error );
                } )
            }
            else {
                callbackComplete( error );
            }
        }
    );

};

global.doCleanupObjects = function( linksUnique, mainTable, mainField, upload_id, callbackComplete ) {

    // check for objects in this upload that are no longer linked. (i.e. the link has been removed)
    // then remove them

   //
    // Now get the list of objects in this upload
    //
    var q = mainTable
        .select( mainTable[mainField] )
        .where(
        mainTable.upload_id.equals( upload_id )
        )
        .toQuery();

    var ids = [];
    client.query( q )
        .on("row", function( data ) {
            ids.push( data[mainField] );
        })
        .on("error", function (error) {
            callbackComplete(error);
        })
        .on("end", function () {
            async.eachSeries(
                _.uniq( ids ),
                function( id, callbackDone ) {
                    if( linksUnique.indexOf( id, 0 ) === -1 ) {
                        // Not found, we need to remove this row from mainTable
                        console.log("Delete row " + id);
                        var q = mainTable
                            .delete(  )
                            .where(
                                mainTable.upload_id.equals( upload_id )
                            )
                            .and (
                                mainTable[mainField].equals( id )
                            )
                            .toQuery();

	                    // For some reason I got a problem with callbackDone() being called by both "end" and "error"
	                    // (which is supposed to be impossible), I think there may have been a timing issue... somehow, breaking an already ended query...
	                    // Anyway, making this async seriel seems to have fixed the problem...
                        client.query( q )
                            .on("error", function (error) {
		                        console.log("Error on row " + id);
                                callbackDone(error);
                            })
                            .on("end", function () {
		                        console.log("Finished row " + id);
		                        callbackDone();
                            });
                    }
                    else {
                        callbackDone();
                    }
                },
                function() {
                    callbackComplete();
                });
        });

    //callbackComplete( null );
};

var workNumericFlds = [
  "date_of_work_std_year",
  "date_of_work_std_month",
  "date_of_work_std_day",
  "date_of_work2_std_year",
  "date_of_work2_std_month",
  "date_of_work2_std_day"
];

var workPlaceFlds = [
  "origin_id",
  "destination_id"
];



/*  note for RG how to generate the sql mapping schemas from postgresql
eurodevadmin@euro-dev1:~/www/node.198/emlocollect/data/sql$ !2038
node-sql-generate --include-schema --dsn "postgres://cofkrenhart:Sperry95@192.168.56.1/ouls" --schema "public" > emlo_ouls_sql1.js
eurodevadmin@euro-dev1:~/www/node.198/emlocollect/data/sql$
*/
module.exports = router;