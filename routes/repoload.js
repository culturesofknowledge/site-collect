var express = require('express');
var router = express.Router();
var ObjectId = require('mongoose').Types.ObjectId;
var async   = require('async');
var _       = require('underscore');
// Postgresql database
var pg = require('pg');

var EmloError = require("../lib/error.js");

var doRecord = require('./emloload.inc/record.inc.js');

var mm = require('../data/sql/emlo_ouls_sql1');
var cofk_collect_upload        = mm.cofk_collect_upload;
var cofk_collect_work          = mm.cofk_collect_work;
var cofk_collect_manifestation = mm.cofk_collect_manifestation;
var cofk_collect_institution   = mm.cofk_collect_institution;
var cofk_collect_location      = mm.cofk_collect_location;
var cofk_collect_person        = mm.cofk_collect_person;

router.get('/flush1/:upload_uuid', function(req, res, next) {
  console.log("Call flush1");
  var locals = { "upload_uuid" : req.params.upload_uuid};

  doRepositories(locals,  
    function(err, records) {
      if (err) { 
        console.log("doRepositories failed",err);
        res.json("doRepositories failed");
        return;
      }
      console.log("doRepositories finished",locals);
      res.json("doRepositories finished");
      return;
    });
});      
  
doRepositories = function(data, callback) {
  console.log("doRepositories Upload setup: ", data.upload_uuid);
  var locals = data;
  var mappings = { };
  mappings["Institution"] = { 
    "collection" : Institution,
    "pgTable"    : cofk_collect_institution,
    "pgMap"      : doPgSqlMap
  };
  mappings["Manifestation"] = {
    "collection" : Manifestation,
    "pgTable"    : cofk_collect_manifestation,
    "pgMap"      : doPgSqlMap
  };
  
  async.series(
    [
      //doManifestation
      function(callback) {      
        var item = "Manifestation" ;
        locals.mapping = mappings[item];
        locals.query = { 
          'upload_uuid'   : locals.upload_uuid,
          'repository_id' : { $ne : null}
        };
        locals.projection3 = "_id repository_id manifestation_id";
        locals.projection = "repository_id";
        console.log("doMapping -1.0 ",item,locals.mapping.collection.modelName);      
        doDistinct(
          locals, 
          function(err, records) {
            if (err) {
              return callback(err);
            }
            console.log("doDistinct -6 ",records);
            locals.reposTab = records;
            callback();
          }
        );
      },
      //doFetchRepos
      function(callback) {
        console.log("doFetchRepos -7 ");
        doFetchRepos(
          locals, 
          function(err, records) {
            if (err) {
              return callback(err);
            }
            console.log("doFetchRepos -7a ",records);
            locals.repos = records;
            callback();
          }
        );
      },
      //doUpsertRepos
      function(callback) {
        console.log("doUpsertRepos -18 ",locals.reposTab2);
        doUpsertRepos(
          locals, 
          function(err, records) {
            if (err) {
              return callback(err);
            }
            console.log("doUpsertRepos -18a ",records);
            locals.records = records;
            callback();
          }
        );
      }
    ],
    function(err) {
      if (err) {
        return callback(err);
      }
      console.log('\ndoRepositories(Manifestation,Institution)\n');  
      callback();
    }
  ); 
}

function doDistinct(data, callback) {
  //
  // Get all distinct values in data.projection field under query data.query .
  // i.e. find the repos in manifestation collection for this upload
  // Return results to callback
  //
  console.log("doDistinct -4: ",data.projection," query-> " ,data.query);
  data.mapping.collection.distinct(
    data.projection,
    data.query,
    function(err, records) {
      if (err) { return callback(err) };
        console.log("doFind -5",data.upload_uuid);
        callback(null, records);
    }
  );
}

function doFetchRepos(data, callback) {
  //
  // Loop around repos found in doDistinct, if any and call doQueryRepo
  //
  console.log("doFetchRepos -8: ", data.reposTab);
  data.reposTab2 = [];
  var i = 8;
  async.eachSeries(
    data.reposTab,
    function(item,callback) {
      console.log("\nrecord-9 -->",++i,"\t",item);
      data.search_id = item ;
      //console.log("\ndata.obj-10 -->",i,"\t",data.reposTab2);
      doQueryRepo(data, callback);
    },
    function (err) {
      if (err) { return callback(err) }
      console.log('doFetchRepos -Tab2: ',data.reposTab2);
      callback(null,data.reposTab2)
    });
}

doQueryRepo = function(data , callback){
  //
  // Find repo in cofk_union_institutions with institution_id = data.search_id
  //
  console.log('\ndoQueryRepo-11');
  var client = new pg.Client(config.conString);
  console.log("\nbefore connect-12: "+data.search_id);
  client.connect();
  console.log("\nbefore query-13: "+data.search_id);
  var b = data.search_id;
  var q = "SELECT institution_id as institution_id";
  q += ",institution_name as institution_name";
  q += ",institution_city";       
  q += " as institution_city";
  q += ",institution_id as union_institution_id";
  q += " FROM cofk_union_institution";
  q += " WHERE institution_id = $1 ";
  q += " order by institution_name";
  var query = client.query( q , [b]);
  
  query.on("row", function (row, result) {
    result.addRow(row);
  });
  
  query.on("end", function (result) {
    data.datarows  = result.rows;
    console.log("\ndoQueryRepo-14 result.rows b4 doQueryLocalRepo " , data.datarows , "\n");
    doQueryLocalRepo(data, callback);
  });      
};

doQueryLocalRepo =  function(data, callback ) {
  console.log("\ndoQueryLocalRepo-15", data.search_id);
  Institution
  .find({
    "upload_uuid"          : data.upload_uuid, 
    "institution_id"       : data.search_id, 
    "union_institution_id" : null 
  })
  .select('institution_id institution_name institution_city union_institution_id')
  .sort( 'institution_name' )
  .exec(
    function(err, newrepo) {
      console.log("\ndoQueryLocalRepo-16 after query ", newrepo, " err ", err);
      if (err) {
        return callback(err);
      } else {
        var results = [], alabel;
        if ( newrepo ) {
          for(var j = 0 ; j < newrepo.length; j++ ){            
            results.push(
              {
                "upload_uuid"         : data.upload_uuid, 
                "institution_id"      : newrepo[j].institution_id,
                "institution_name"    : newrepo[j].institution_name,                
                "institution_city"    : newrepo[j].institution_city,                
                "union_institution_id": newrepo[j].union_institution_id
              }
            );
          }
        }
        if (data.datarows[0]) {
          console.log("\ndoQueryLocalRepo-17 b4 combine ",data.datarows);
          data.datarows[0].upload_uuid = data.upload_uuid;
        }
        var combine  = results.concat(data.datarows);
        data.reposTab2.push(combine);
        console.log("\ndoQueryLocalRepo-17 combine b4 callback " , combine , "\n");
        callback(null, combine );
      }
    });
};

function doUpsertRepos(data, callback) {
  console.log("doUpsertRepos -19: ", data.reposTab2.length);
  var i = 1;
  async.eachSeries(
    data.reposTab2,
    function (item, callback) {
      console.log("\nrecord-20 -->",i,"\t",item);
      data.item = item;
      doUpsertRepo(data, i, callback);
      i++;
    },
    function (err) {
      if (err) { return callback(err) }
      console.log('doUpsertRepos -Tab2: ',data.reposTab2.length);
      callback(null,data.reposTab2)
    });
}

doUpsertRepo =  function(data, pos, callback ) {
  console.log("\doUpsertRepo-21", data.item);
  if (data.item[0]) {
    var query = {
      //"institution_name": new RegExp('^'+req.params.search, "i"),  // case insensitive prefix
      "upload_uuid": data.item[0].upload_uuid,
      "institution_id": data.item[0].institution_id
    };
    console.log("\doUpsertRepo-23", data.item[0].union_institution_id);
    Institution
        .findOneAndUpdate(
        query,
        {$set: data.item[0]},
        {upsert: true},
        function (err, result) {
          console.log("\ndoUpsertRepo-22 after update ", result, " err ", err);
          if (err) {
            return callback(err);
          } else {
            console.log("\ndoUpsertRepo-23 b4 callback ", result);
            callback(null, result);
          }
        }
    );
  }
  else {
    return callback( new EmloError( "Repository with id:" + data.reposTab[pos-1] + " not found" ) );
  }
};

module.exports = doRepositories;