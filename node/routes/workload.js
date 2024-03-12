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

        const collect_work_id_query = {
          text: 'SELECT id FROM cofk_collect_work WHERE upload_id=$1 AND iwork_id=$2',
          values: [data.pgUploadId, item.iwork_id],
          }

        const res = client.query(collect_work_id_query).then(function(collect_work){
            item.iwork_id = collect_work.rows[0].id;

            async.series( [
                function ( callbackDone ) {
                    console.log("doWorkMapping -0 ", (item) ? item.iwork_id : "no work" );
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
                }
            ],
            function( err ) {
                callbackComplete( err )
            });
        });
    },
    function(err) {
      if (err) { callbackReturn(err); }
      
      console.log('doProcessWorks(for authors addressees mentioned-) \n');
	    callbackReturn();
    }
  );  
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

        client.query( q , function( error, result ) {
	        if( error ) {
		        console.log( "ERROR: ", q, uploadId, iWorkId );
	        }
	        console.log('CLEARING: ', table._name, result.rowCount)

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

  var x = table.columns;
  var theName, theValue ;
  var obj = {};
  for (var i=0;i<x.length;i++) {
    theName = x[i].name;
    theValue = data[theName];
    if ( theValue !== undefined ) {
      obj[theName] = toPg(theValue) ;
    }
  }

  return obj;
};

global.doWorkUpsertTable = function(table, data, callback) {

  // Check whether row exists already
  var q = table
  .select(table.star())
  .from(table)
  .where(table._id.equals(data._id))
  .and(table.iwork_id.equals(data.iwork_id))
  .and(table.upload_id.equals(data.upload_id))
  .toQuery();

  client.query( q , function(error, result) {
    if(error) { callback(error); }

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
   function insertData(insertTable, insertData, insertCallback)   {
        var q = insertTable
            .insert(insertData)
            .returning(table.star())
            .toQuery();
        console.log(data);
        var query = client.query( q );

        query.then(function(result, s) {
            insertCallback(null, result);
        });
    }

    if(data.iperson_id) {
        const collect_person_id_query = {
          text: 'SELECT id FROM cofk_collect_person WHERE upload_id=$1 AND iperson_id=$2',
          values: [data.upload_id, data.iperson_id],
        }

        const res2 = client.query(collect_person_id_query).then(function(collect_person)    {
            if(collect_person.rows.length)  {
                data.iperson_id = collect_person.rows[0].id;
            }

            insertData(table, data, callback);

        });
    }
    else if(data.location_id)   {
        const collect_location_id_query = {
          text: 'SELECT id FROM cofk_collect_location WHERE upload_id=$1 AND location_id=$2',
          values: [data.upload_id, data.location_id],
        }

        const res2 = client.query(collect_location_id_query).then(function(collect_location)    {

            if(collect_location.rows.length)  {
                data.location_id = collect_location.rows[0].id;
            }

            insertData(table, data, callback);

        });
    }
    else {
        insertData(table, data, callback);
    }

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

    query.then(function(result, s) {
        console.log("\ndoWorkUpdateTable query end Responded with "
        , result.command, " rowCount ", result.rowCount , "\n");
      callback(null, result);
    });
};

module.exports = doWorkRecord;