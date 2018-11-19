// record ============================================  
var async   = require('async');

doRecord = function(data, callback) {
  var locals = data;
  console.log("log: record -3 ",data.mapping.collection.modelName);
  async.series(
    [
      //Find records by Id
      function(callback) {
        doFind(
          locals, 
          function(err, records) {
            if (err) { callback(err); }

            locals.records = records;
            callback();
          }
        );
      },
      //delete records by upload_Id
      function(callback) {
        doDeleteTable(
          locals.mapping.pgTable, 
          locals, 
          function(err, result) {
            if (err) { callback(err); }
            //locals.records = records;  //not needed as only delete performed
            callback();
          }
        );
      },
      //Process records
      function(callback) {

        doProcessRecords(
          locals, 
          function(err, result) {
            if (err) { callback(err); }
            locals.result = result;

            callback();
          }
        );
      }
    ],
    function(err) {
      if (err) { callback(err); }
      console.log('log: doRecord done\n');  
      callback();
    }
  );
};

// Find(3) for Upload transfer:
function doFind(data, callback) {
  console.log("log: doFind -1: ", data.upload_uuid);
  console.log("\nlog: doFind -1c: ", data.mapping.collection.modelName);
  if (data.mapping.collection.modelName == "Work") {
    console.log("\nlog: doFind -1d: ", data.mapping.collection.modelName);

    data.mapping.collection
    .find({ 'upload_uuid' :data.upload_uuid})
    .populate('origin_id', 'location_id')
    .populate('destination_id', 'location_id')
    .exec(function(err, records) {
      if (err) { callback(err) };
      console.log("log: doFind -2",data.upload_uuid);
      callback(null, records);
    });
  } else {
    console.log("log: doFind -1a: ", data.upload_uuid);
    data.mapping.collection
    .find({ 'upload_uuid' :data.upload_uuid})
    .exec(function(err, records) {
      if (err) { callback(err) };
          console.log("log: doFind -2a",data.upload_uuid);
          console.log("\nlog: doFind -2b",records.length, records[0]);
          callback(null, records);
    });
  }
}

doProcessRecords = function(data, callback) {

  var i = 1;
  async.eachSeries(
    data.records, 
    function(item,callback) {

      data.obj= data.mapping.pgMap(data.mapping.pgTable, item);
      data.obj['upload_name']  = data.upload_name ;
      data.obj['upload_id']    = data.pgUploadId;
      // update data.obj['upload_status'] at a later stage once we know postgres value

      if (data.mapping.field_key) {
        data.obj[data.mapping.field_key] = i++;
      }

      data.obj['_id'] = data.obj['_id'].toString() ;

      doUpsertTest(data, callback);
      //callback();
    },
    callback
  );
};

doUpsertTest = function(data, callback) {
  async.series(
    [
      function(callback) {
        // *** Handle get person id if needed here
        if (data.mapping.pgGetId) {
          data.mapping.pgGetId(data.mapping.pTable, data.obj, callback);
        } else {
          callback();
        }
      },
      //Process records
      function(callback) {
        doUpsertTable(data.mapping.pgTable, data.obj, callback);
        //callback();
      }
    ],
    function(err) {
      if (err) { callback(err); }
      callback();
    }
  );
}

doUpsertTable = function(table, data, callback) {

  // Check whether row exists already
  var q = table
  .select(table.star())
  .from(table)
  .where( table._id.equals(data._id) )
  .toQuery();

  client.query( q , function(error, result) {
    if(error) { callback(error); }

    if (result.rows.length < 1) {
      doInsertTable(table, data, callback);
    } else {
    	// Work out if upload status needs to change. (If it's previously rejected make it reviewable)
	    // 1	Awaiting review
	    // 2	Partly reviewed
	    // 3	Review complete
	    // 4	Accepted and saved into main database
	    // 5	Rejected

        if( data.iwork_id ) { // if it's a work.
	        data.upload_status = (result.rows[0].upload_status === 5) ? 1 : result.rows[0].upload_status;
        }

      doUpdateTable(table, data, callback);
    }
  });
};

doInsertTable = function(table, data, callback) {

  var q = table
  .insert(data)
  .returning(table.star())
  .toQuery();

  //console.log("\nlog: query :",q);

  client.query( q )
  .on('row', function (row, result) {
  })
  .on("error", function (error) {
    console.log("log: do insert row " , error , "\n");
    callback(error);
  })
  .on("end", function (result) {
    callback(null, result);
  });
};

doDeleteTable = function(table, data, callback) {

  if (data.mapping.collection.modelName == "Manifestation") {

    var q = table
    .delete()
    .where( table.upload_id.equals(data.pgUploadId) )
    .toQuery();

    //console.log("log: query :",q);

    client.query( q )
    .on('row', function (row, result) {
    })
    .on("error", function (error) {
      console.log("log: do delete row " , error , "\n");
      callback(error);
    })
    .on("end", function (result) {
      console.log("log: do delete row count =", result.rowCount , "\n");
      callback(null, result);
    });
  } else {
    callback();
  }
  
};

doUpdateTable = function(table, data, callback) {

  var q = table
  .update(data)
  .where( table._id.equals(data._id) )
  .toQuery();

  //console.log("log: query :",q); //query is parameterized by default

  var query = client.query( q );
  query.on("row", function (row, result) {
    result.addRow(row);
  });    
  query.on("error", function (error) {
    console.log("log: doUpdateTable query error " , error , "\n");
    callback(error);
  });
  query.on("end", function (result) {
    if( result ) {
      console.log("log: doUpdateTable query end Responded with ", result.rowCount);
    }
    callback(null, result);
  });
};

module.exports = doRecord;
