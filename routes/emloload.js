var express = require('express');
var router  = express.Router();
var async   = require('async');
var _       = require('underscore');
// Postgresql databaase
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

doSeries = function(req, res, next) {
  var locals = { "upload_uuid" : req.params.upload_uuid};
  var upload_id;
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
          function(err, result) {
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
          function(err, result) {
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
          function(err, result) {
            if (err) { return callback(err); }
            console.log("log: doWorkRecord -13");
            callback();
          }
        );
/**/
      }
    ],
    function(err) {
      if (err) {
        return next(err);
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
    if (err) { return callback(err) };
           //Check that an upload was found
    if (!upload) {
      console.log("log: dofindUpload -1",uuid);
      callback(new Error('No upload with uuid '+uuid+' found.'));
    }
    console.log("log: dofindUpload -2",uuid);
    callback(null, upload);
  });
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
  
};      

function doinsertUpload(data, callback) {
  //
  // Create or update if we already have this upload in collect.
  //

  console.log("log: doinsertUpload Received with data"  , "\nrows\n[" , data.result.rows[0] , "]\nCount\n[" , data.result.rows.length  , "]\nUpload\n" , data.upload );

  var obj = doPgSqlMap(cofk_collect_upload, data.upload);

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
    var q = cofk_collect_upload
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
    var q = cofk_collect_upload
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
};

processUpload = function(data, callback) {
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

toPg = function(x) {
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

doPgSqlMap = function( table, data ) {
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

doPgLocSqlMap = function(table, data ) {
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

doPgWorkSqlMap = function(table, data ) {
  console.log("log: process doPgWorkSqlMap ");
  var x = table.columns;
  var theName, theValue ;
  var obj = {};
  //for (var i=0;i<x.length;i++) {
    //theName  = x[i].name;
  var i = 0;
  for ( theName in workMap ){
    if ( workPlaceFlds.indexOf(theName) > -1 ){
      console.log("log: handle place field here ",theName);
      //console.log("handle data ",data);
      console.log("log: handle workMap[theName] ",workMap[theName]);
      console.log("log: handle data[workMap[theName]]",data[workMap[theName]]);
      if( data[workMap[theName]].length > 0 ) {
          theValue = data[workMap[theName]][0];
          if (theValue) {
              theValue = data[workMap[theName]][0].location_id;
          }
      }
      else {
          // Setting to null means we get a NULL value in database (i.e. replacing anything that may be there already)
          theValue = null;
      }
    } else {
      theValue = data[workMap[theName]];
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

doGetPersonId = function(table, data, callback) {
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