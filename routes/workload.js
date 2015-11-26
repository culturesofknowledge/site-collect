// record ============================================  
var async   = require('async');
var mm = require('../data/sql/emlo_ouls_sql1');

doWorkRecord = function(data, callback) {
  var locals = data;
  
  console.log("doWorkRecord -2 ",data.mapping.collection.modelName);
  console.log("doWorkRecord -2a ",locals.mapping.collection.modelName);
  //console.log("doWorkRecord -2b ",locals.mapping.pgMap);
  //console.log("doWorkRecord -2c ",data.mapping);
  async.series(
    [
      //Find records by Id
      function(callback) {
        console.log("doFindWork -0");
        doFindWork(
          locals, 
          function(err, records) {
            if (err) { callback(err); }
            console.log("doWorkRecord -3");
            locals.works = records;
            console.log("doWorkRecord -4 works count -> ",locals.works.length);
            callback();
          }
        );
      },
      //Process records
      function(callback) {
        console.log("doProcessWorks -1");
        doProcessWorks(
          locals, 
          function(err, result) {
            if (err) { callback(err); }
            locals.result = result;
            console.log("doProcessWorks -2");
            callback();
          }
        );
      }
    ],
    function(err) {
      if (err) { callback(err); }
      console.log('doWorkRecord done\n');  
      callback();
    }
  );
};

// Find(3) for Upload transfer:
global.doFindWork = function(data, callback) {
  console.log("doFindWork -1: ", data.upload_uuid, " are we here ");
  console.log("doFindWork -1a: ", data.mapping.collection.modelName, " are we here ");
  data.mapping.collection
  .find({ 'upload_uuid' :data.upload_uuid})
  .populate('createdBy', 'name email')
  .populate('contributors', 'name email')
  .populate('authors', 'primary_name iperson_id union_iperson_id _id')
  .populate('addressees', 'primary_name iperson_id union_iperson_id _id')
  .populate('people_mentioned', 'primary_name iperson_id union_iperson_id _id')
  .populate('origin_id', 'location_name location_id union_location_id _id')
  .populate('destination_id', 'location_name location_id union_location_id _id')
  .populate('place_mentioned', 'location_name location_id union_location_id _id')
  .populate('upload_uuid', 'upload_name _id')
  .exec(function(err, records) {
      if (err) { callback(err) }
      console.log("doFindWork -2 count -> ",records.length);
      callback(null, records);
  });
};

global.doProcessWorks = function(data, callbackReturn) {
  console.log("doProcessWorks -3");
  var locals = data;
  var mappings = { };
  mappings["authors"] = { 
    "collection" : Work,
    "field"      : "authors",
    "field_key"  : "author_id",
    "pgTable"    : mm.cofk_collect_author_of_work,
    "pgMap"      : doPSqlMap
  };
  mappings["addressees"] = { 
    "collection" : Work,
    "field"      : "addressees",
    "field_key"  : "addressee_id",
    "pgTable"    : mm.cofk_collect_addressee_of_work,
    "pgMap"      : doPSqlMap
  };
  mappings["people_mentioned"] = { 
    "collection" : Work,
    "field"      : "people_mentioned",
    "field_key"  : "mention_id",
    "pgTable"    : mm.cofk_collect_person_mentioned_in_work,
    "pgMap"      : doPSqlMap
  };
  mappings["origin_id"] = { 
    "collection" : Work,
    "field"      : "origin_id",
    "field_key"  : "origin_id",
    "pgTable"    : mm.cofk_collect_origin_of_work,
    "pgMap"      : doPSqlMap
  };
  mappings["destination_id"] = { 
    "collection" : Work,
    "field"      : "destination_id",
    "field_key"  : "destination_id",
    "pgTable"    : mm.cofk_collect_destination_of_work,
    "pgMap"      : doPSqlMap
  };
  mappings["place_mentioned"] = { 
    "collection" : Work,
    "field"      : "place_mentioned",
    "field_key"  : "mention_id",
    "pgTable"    : mm.cofk_collect_place_mentioned_in_work,
    "pgMap"      : doPSqlMap
  };
  mappings["languages"] = { 
    "collection" : Work,
    "field"      : "languages",
    "field_key"  : "language_of_work_id",
    "pgTable"    : mm.cofk_collect_language_of_work,
    "pgMap"      : doPgSqlMap
  };
  mappings["resources"] = { 
    "collection" : Work,
    "field"      : "resources",
    "field_key"  : "resource_id",
    "pgTable"    : mm.cofk_collect_work_resource,
    "pgMap"      : doPgSqlMap
  };

  locals.itemMappings = mappings;
  
  locals.itemTab = [
    "origin_id", 
    "destination_id", 
    "place_mentioned", 
    "languages", 
    "authors",
    "addressees",
    "people_mentioned", 
    "resources" 
  ];
  
  async.eachSeries(
    data.works,
    function(item, callbackComplete) {

        async.series( [
            function ( callbackDone ) {
                console.log("doWorkMapping -0 ", item);
                locals.itemWork = item;
                doProcessItems(
                    locals,
                    function (err /*, records*/) {
                        if (err) {
                            callbackDone(err);
                        }
                        console.log("doWorkMapping -1 ", locals.itemWork.iwork_id);
                        //locals.records = records;
                        callbackDone();
                    }
                );
            },
            function( callbackDone ) {

                // data.pgUploadId item.iwork_id
                createWorkSummaryEntry( data.pgUploadId, item.iwork_id, function( err ) {
                    callbackDone( err );
                } );
            }
        ],
        function( err ) {
            callbackComplete( err )
        });
    },
    function(err) {
      if (err) { callbackReturn(err); }
      
      console.log('doProcessWorks(for authors addressees mentioned-) \n');
	    callbackReturn();
    }
  );  
};

global.createWorkSummaryEntry = function( uploadId, iwork_id, callbackComplete ) {
    /*
        Add an entry to the work summary

        this is so the export in collect works.
     */
    console.log( "createWorkSummaryEntry : ", uploadId, iwork_id );

    var table = mm.cofk_collect_work_summary,
        q = table
        .insert(
            table.upload_id.value( uploadId ),
            table.work_id_in_tool.value(iwork_id)
        )
        .toQuery();

    client.query( q )
        .on('error', function(error) {
            if( error.code === "23505" ) {
                // Duplicate entry, whatever, it's there.
                error = null;
            }
            callbackComplete(error);
        })
        //q.on("row", function (row, result) {});
        .on("end", function () {
            callbackComplete();
        });

};

global.doProcessItems = function(data, callbackReturn) {
  //
  // Loop through fields of data.itemTab in work
  // Add links between objects (e.g. person is author of work)
  //
  console.log("doProcessItems -3 for iwork_id-> ", data.itemWork.iwork_id);
  var i = 0;
  async.eachSeries(
    data.itemTab,
    function(item, callbackSeriesDone) {

      console.log("\ndoProcessItems -3a record -->",++i,"\t",item);

      data.mapping = data.itemMappings[item];

      async.series(
          [
              function (callback) {
                // Delete existing links
                workClearLinks( data.mapping.pgTable, data.pgUploadId, data.itemWork.iwork_id, function(error) {
                  callback(error)
                } );
              },

              function (callback) {
                // Make the new links

                console.log("\ndoProcessItems -3b for item ",data.mapping.field);
                console.log("\ndoProcessItems -3c for fields \n",data.itemWork[data.mapping.field]);

                if( data.itemWork[data.mapping.field].length > 0 ) {

                  doProcessItemRows( data, function(err, data) {
                    if (err) {
                      console.log('Ahh! An -----1 Error!');
                      callback(err);
                    }
                    callback(null, data);
                  });

                } else {
                  callback();
                }

              }

          ],

          function(err, data ) {
            if (err) {
	            callbackSeriesDone( err );
            }
            else {
              console.log('doProcessItems(for each of authors addressees mentioned etc ) \n');
	            callbackSeriesDone(null,data);
            }
          }
      );
    },
	  callbackReturn
  );
};


global.workClearLinks = function( table, uploadId, iWorkId, callReturn ) {
   var q = table.delete()
        .where(table.upload_id.equals(uploadId))
        .and(table.iwork_id.equals(iWorkId))
        .toQuery();

	if (uploadId > 0) {
        console.log( "workClearLinks deleting links with Query", q );

        client.query( q , function( error, result ) {
            if( result && result.rowCount > 0 ) {
                console.log("workClearLinks - Deleted rows count =",result.rowCount);
            }
	        else {
		        console.log("workClearLinks - Deleted rows count = 0" );
	        }
            callReturn( error, result );
        });
    }
    else {
        callReturn( new Error( "Invalid uploadId" ) );
    }
};

global.doProcessItemRows = function(data, callbackReturn) {

  console.log("doProcessItemRows -3d for item ",data.mapping.field);
  var i = 1;
  async.eachSeries(
    data.itemWork[data.mapping.field], 
    function(item,callback) {
      data.obj= data.mapping.pgMap(data.mapping.pgTable, item);
      data.obj['iwork_id']  = data.itemWork.iwork_id ;
      data.obj['upload_id'] = data.pgUploadId;
      data.obj[data.mapping.field_key] = i++;
      data.obj['_id'] = data.obj['_id'].toString() ;
      console.log("\ndata.obj -->",i,"\n",data.obj);
      console.log("data",data.mapping.pgTable._name);
      doWorkUpsertTable(
        data.mapping.pgTable, 
        data.obj, 
        function(err, data) {
          if (err) {
            console.log('Ahh! An -----0 Error!');
            callback(err);
          }
          callback(null, data);
        }
      );
      // /**/
      //callback();
    },
	  function( error ) {
		  callbackReturn( error );
	  }
  );
};

global.doPSqlMap = function(table, data ) {
	// TODO: Investigate if this function should call doPgSqlMap... sigh...
  console.log("\nprocess doPSqlMap \n", data);
  var x = table.columns;
  var theName, theValue ;
  var obj = {};
  for (var i=0;i<x.length;i++) {
    theName = x[i].name;
    theValue = data[theName];
    if ( theValue !== undefined ) {
      obj[theName] = toPg(theValue) ;
      console.log(
        "theName [", i , 
        "] --> ", theName, 
        " --> " , theValue,
        " --> " , obj[theName]
      );
    }
  }
  console.log("\nprocess doPSqlMap done\n", obj);
  return obj;
};

global.doWorkUpsertTable = function(table, data, callback) {
  console.log("\ndoWorkUpsertTable 1");
  // Check whether row exists already
  var q = table
  .select(table.star())
  .from(table)
  .where(table._id.equals(data._id))
  .and(table.iwork_id.equals(data.iwork_id))
  .and(table.upload_id.equals(data.upload_id))
  .toQuery();

  console.log("\ndoWorkUpsertTable query :",q);

  client.query( q , function(error, result) {
    if(error) { callback(error); }
    console.log("\ndoWorkUpsertTable " +result.rows.length + ' rows were received');
    if (result.rows.length < 1) {
      doWorkInsertTable(table, data, function(err, data) {
        if (err) {
          console.log('Ahh! An Insert Error!');
          callback(err);
        }
        callback(null, data);
      });
    } else {
        // TODO: MATTT: I don't think it does this anymore as I'm removing the entries everytime.
      doWorkUpdateTable(table, data, function(err, data) {
        if (err) {
          console.log('Ahh! An Update Error!');
          callback(err);
        }
        callback(null, data);
      });
    }
  });
};

global.doWorkInsertTable = function(table, data, callback) {
  console.log('doWorkInsertTable upload for insert \n',data);  
  var q = table
  .insert(data)
  .returning(table.star())
  .toQuery();

  console.log("\ndoWorkInsertTable query :",q);
  client.query( q )
  .on('row', function (row) {
    console.log("doWorkInsertTable inserted row" , row);
  })
  .on("error", function (error) {
    console.log("\ndoWorkInsertTable do insert error " , error , "\n");
    callback(error);
  })
  .on("end", function (result) {
          if( result ) {
              console.log("\ndoWorkInsertTable do insert end  ", result.rowCount );
          }
    callback(null, result);
  });
};

global.doWorkUpdateTable = function(table, data, callback) {
  console.log('doWorkUpdateTable data for update \n',data);
  var q = table
  .update(data)
  .where(table._id.equals(data._id))
  .and(table.iwork_id.equals(data.iwork_id))
  .and(table.upload_id.equals(data.upload_id))
  .toQuery(); 
  console.log("\nquery :",q); //query is parameterized by default
  var query = client.query( q );
  query.on("row", function (row, result) {
    result.addRow(row);
  });    
  query.on("error", function (error) {
    console.log("\ndoWorkUpdateTable query error " , error , "\n");
    callback(error);
  });
  query.on("end", function (result) {
    console.log("\ndoWorkUpdateTable query end Responded with " 
    , result.command, " rowCount ", result.rowCount , "\n");
    callback(null, result);
  });
};

module.exports = doWorkRecord;