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
            console.log("log: doFindrecords -3");
            locals.records = records;
            console.log("log: doFindrecords -4",locals.records[0]);
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
            console.log("log: doDelete -3");
            //locals.records = records;  //not needed as only delete performed
            console.log("log: doDelete -4",locals.records[0]);
            callback();
          }
        );
      },
      //Process records
      function(callback) {
        console.log("log: doProcessRecords -1");
        doProcessRecords(
          locals, 
          function(err, result) {
            if (err) { callback(err); }
            locals.result = result;
            console.log("log: doProcessRecords -2");
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
  console.log("log: doProcessRecords -3 \n", data.records[0]);
  var i = 1;
  async.eachSeries(
    data.records, 
    function(item,callback) {
      //console.log("log: record -->",i,"\n",item);
      data.obj= data.mapping.pgMap(data.mapping.pgTable, item);
      data.obj['upload_name']  = data.upload_name ;
      data.obj['upload_id']    = data.pgUploadId;
      if( data.mapping.pgTable.upload_status ) {
        data.obj['upload_status']    = '1'; // set status in collect to "Awaiting review" (It may have been set to "Rejected" (5) before.)
      }

      if (data.mapping.field_key) {
        data.obj[data.mapping.field_key] = i++;
        console.log("\nlog: data.mapping.field_key -->",i,
                    "\n",data.obj[data.mapping.field_key]);
      }
      //console.log("log: data.obj -->",i++,"\n",data.obj);
      data.obj['_id'] = data.obj['_id'].toString() ;
      console.log("log: data",data.mapping.pgTable._name);
      doUpsertTest(data, callback);
      //callback();
    },
    callback
  );
};

doUpsertTest = function(data, callback) {
  console.log("\nlog: doUpsertTest 0",data.mapping.pgTable._name);
  async.series(
    [
      function(callback) {
        // *** Handle get person id if needed here
        console.log("\nlog: testGetPersonId - 0 ",data.mapping.pgTable._name);                    
        if (data.mapping.pgGetId) {
          console.log("\nlog: doGetPersonId - 1 ",
                      "\n",data.mapping.person_id);
          data.mapping.pgGetId(data.mapping.pTable, data.obj, callback);
        } else {
          console.log("\nlog: testGetPersonId - 2 ",data.mapping.pgTable._name);                    
          callback();
        }
      },
      //Process records
      function(callback) {
        console.log("log: doUpsertTable -0 ",data.mapping.pgTable._name);
        doUpsertTable(data.mapping.pgTable, data.obj, callback);
        //callback();
      }
    ],
    function(err) {
      if (err) { callback(err); }
      console.log('log: doUpsertTest -1  done\n',data.mapping.pgTable._name);  
      callback();
    }
  );
}

doUpsertTable = function(table, data, callback) {
  console.log("\nlog: doUpsertTable 1");
  // Check whether row exists already
  var q = table
  .select(table.star())
  .from(table)
  .where( table._id.equals(data._id) )
  .toQuery();
  console.log("\nlog: query :",q); 
  client.query( q , function(error, result) {
    if(error) { callback(error); }
    console.log("\nlog: doUpsertTable 1a",result.rows.length + ' rows were received');
    if (result.rows.length < 1) {
      doInsertTable(table, data, callback);
    } else {
      doUpdateTable(table, data, callback);
    }
  });
};

doInsertTable = function(table, data, callback) {
  console.log('log: doInsertTable \n',data);  
  var q = table
  .insert(data)
  .returning(table.star())
  .toQuery();
  console.log("\nlog: query :",q);
  client.query( q )
  .on('row', function (row, result) {
    //console.log("inserted" , row," result ->", result);
  })
  .on("error", function (error) {
    console.log("log: do insert row " , error , "\n");
    callback(error);
  })
  .on("end", function (result) {
    if( result ) {
       console.log("log: do insert row  ", result.rowCount , "\n");
    }
    callback(null, result);
  });
};

doDeleteTable = function(table, data, callback) {
  console.log("log: doDeleteTable -1: ", data.upload_uuid);
  console.log("log: doDeleteTable -1c: ", data.mapping.collection.modelName);
  if (data.mapping.collection.modelName == "Manifestation") {
    console.log("log: doDeleteTable -1d: ", data.mapping.collection.modelName);
    //console.log('log: doDeleteTable \n',data);  
    var q = table
    .delete()
    .where( table.upload_id.equals(data.pgUploadId) )
    .toQuery();
    console.log("log: query :",q);
    client.query( q )
    .on('row', function (row, result) {
      console.log("log: deleted" , row," result ->", result);
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
    console.log("log: doDeleteTable - 2 ",data.mapping.pgTable._name);                    
    callback();
  }
  
};

doUpdateTable = function(table, data, callback) {
  console.log('log: doUpdateTable \n',data);
  var q = table
  .update(data)
  .where( table._id.equals(data._id) )
  .toQuery(); 
  console.log("log: query :",q); //query is parameterized by default
  var query = client.query( q );
  query.on("row", function (row, result) {
    result.addRow(row);
  });    
  query.on("error", function (error) {
    console.log("log: doUpdateTable query error " , error , "\n");
    callback(error);
  });
  query.on("end", function (result) {
    //console.log("log: doUpdateTable query end Responded1 with ", result, "\n"); 
    console.log("log: doUpdateTable query end Responded with ", result.rowCount , "\n"); 
    callback(null, result);
  });
};

module.exports = doRecord;
