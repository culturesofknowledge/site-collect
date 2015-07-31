var express = require('express');
var router = express.Router();
/*
 * Autocomplete Routes
 */

// Postgresql databaase
var pg = require('pg');

console.log(config.conString);
  
router.get(
  '/person/:search', function(req, res) {
    console.log("Search person PG database");
    doSearchPG(req, res, doSearchLocal);
});      

// Search Person PG database
doSearchPG = function(req, res, callback){
    console.log('called1 /autocomplete/person/:upload_uuid/:search');
    var client = new pg.Client(config.conString);
    console.log("before connect "+req.params.search);
    client.connect();
    
    console.log("before query "+req.params.search);
    var b=req.params.search+'%';
    var q="select";
      q += " foaf_name as name";
      q += ",' ('";
      q += "||' b:'|| coalesce(to_char(date_of_birth_year,'9999'),' ')";
      q += "||' d:'|| coalesce(to_char(date_of_death_year,'9999'),' ')";
      q += "||' fl:'|| coalesce(to_char(flourished_year,'9999'),' ')";
      q += "||' )'";        
      q += " as date";
      q += ",iperson_id as value";
      q += ",iperson_id as emloid";
      q += " from cofk_union_person";
      q += " where foaf_name ilike $1 ";
      q += " order by foaf_name";
    console.log("the query ", q);

    client.query( q , [b])

    .on("error", function (error) {
      console.log( "Error in doSearchPG: " + error )
    })

    .on("row", function (row, result) {
      result.addRow(row);
    })
    
    .on("end", function (result) {
      var results = JSON.stringify(result.rows, null, "    ");
      //res.end(req.query.callback + "(" + results + ")");
      res.datarows   = result.rows;
      //res.dataresult = results;
      callback(req, res);
      client.end();
      //console.log("\tResponded with '" + results + "'\n");
    });      
};
  
// SELECT "location_id","location_name" FROM "cofk_union_location" WHERE "location_name" ILIKE 'aB%'
router.get(
  '/place/:upload_uuid/:search',  function(req, res) {
  console.log("Search place PG database");
  doSearchPlace(req, res, doSearchLocalPlace);
});      
  
  // Search Person PG database
  doSearchPlace = function(req, res, callback){
    console.log('called /autocomplete/place/:upload_uuid/:search');
    var client = new pg.Client(config.conString);
    console.log("before connect "+req.params.search);
    client.connect();
    
    console.log("before query "+req.params.search);
    var b=req.params.search+'%';
    var q="SELECT location_id as value";
      q += ",location_name as label";
      q += ",location_id as emloid";
      q += " FROM cofk_union_location ";
      q += " WHERE location_name ilike $1  ";
      q += " order by location_name";

    client.query( q , [b] )

    .on("error", function (error) {
      console.log( "Error in doSearchPlace: " + error )
    })

    .on("row", function (row, result) {
      result.addRow(row);
    })
    
    .on("end", function (result) {
      var results = JSON.stringify(result.rows, null, "    ");
      //res.end(req.query.callback + "(" + results + ")");
      res.datarows   = result.rows;
      //res.dataresult = results;
      callback(req, res);
      client.end();
      //console.log("\tResponded with '" + results + "'\n");
    });      
};
  
// SELECT "institution_id","institution_name" FROM "cofk_union_institution" WHERE "institution_name" ILIKE 'aB%'
router.get(
  '/institution/:upload_uuid/:search',  function(req, res) {
  console.log("Search repo PG database");
  doSearchRepo(req, res, doSearchLocalRepo);
});      

// Search Person PG database
doSearchRepo = function(req, res, callback){
  console.log('called /autocomplete/institution/:search');
    var client = new pg.Client(config.conString);
    console.log("before connect "+req.params.search);
    client.connect();

    console.log("before query "+req.params.search);
    var b=req.params.search+'%';
    var q="SELECT institution_id as value";
    q += ",institution_name as label";
    q += ",' ( '";
    q += "||institution_city";
    q += "||' )'";
    q += " as label2";
    q += ",institution_id as emloid";
    q += " FROM cofk_union_institution";
    //q += " WHERE institution_name ilike $1 ";
    q += " order by institution_name";
    //var query = client.query( q , [b]);

    client.query( q )

    .on("error", function (error) {
      console.log( "Error in doSearchRepo: " + error )
    })

    .on("row", function (row, result) {
      result.addRow(row);
    })

    .on("end", function (result) {
      var results = JSON.stringify(result.rows, null, "    ");
      //res.end(req.query.callback + "(" + results + ")");
      res.datarows   = result.rows;
      //res.dataresult = results;
      callback(req, res);
      client.end();
      //console.log("\tResponded with '" + results + "'\n");
    });
};

// get all the users (accessed at GET http://localhost:8080/api/users)
router.get(
  '/repository/:upload_uuid/:search', function(req, res) {
    console.log("Search repo to doAttach");
  doSearchRepo(req, res, doSearchLocalRepo);
});      

// Search Local Place
doSearchLocalRepo =  function(req, res ) {
  console.log("Get(repository) Request for Data Table made with data: ", req.query);
  //console.log("\tCalled with '" , res.datarows , "'\n");
  //console.log("\tCalled with dataresult'" , res.dataresult , "'\n");
  console.log("before query -> ",req.params.search);
  Institution
  .find({
      //"institution_name": new RegExp('^'+req.params.search, "i"),  // case insensitive prefix
      "upload_uuid" : req.params.search, 
      "institution_id" :  { $gt: 1000000 }, 
      "union_institution_id" : null 
  })
  .select('institution_id institution_name institution_city union_institution_id')
  .sort( 'institution_name' )
  .exec(
    function(err, newrepo) {
      console.log("Local after query ", newrepo, " err ", err);
      if (err) {
        res.json({ "error" : err });
      } else {
        var results = [], alabel;
        if ( newrepo ) {
          for(var j = 0 ; j < newrepo.length; j++ ){
            //alabel  = newrepo[j].institution_name;
            alabel  = ' (' ;
            alabel += '' + newrepo[j].institution_city;
            //alabel += ' d:' + newrepo[j].date_of_death_year;
            //alabel += ' fl:' + newrepo[j].flourished_year;
            alabel += ' )' ;
            
            results.push(
              {
                "label"   : newrepo[j].institution_name,                
                "label2"  : alabel,                
                "value"   : newrepo[j].institution_id,
                "emloid"  : newrepo[j].union_institution_id
              }
            );
          }
        }
        //console.log("\tLocal Responded with " , results , "\n");
        var combine  = results.concat(res.datarows);
        //var combined = JSON.stringify(combine, null, "    ");
        //res.end(req.query.callback + "(" + combined + ")");
        res.json({ data: combine });
        //res.json(results);
      }
  });
  /*  */
};

router.get(
  '/language/:search',
  function(req, res) {
    console.log("Get(language) Request for Data Table made with data: ", req.query);
    Language.find(
    {},
    'language_code language_name',
    { sort : { language_name : 1 } },
    function(err, language) {
      if (err) {
        res.json({ "error" : err });
      } else {
        res.json({ data :language});
      }
    });
  /*  */
});

router.get(
  '/newperson/:upload_uuid/:search', function(req, res) {
    console.log("Search person to doAttach");
    doSearchPG(req, res, doSearchLocal);
});      
  
  // Search Local Person
  doSearchLocal =  function(req, res ) {
    console.log("Get(newperson) Request for autocomplete: ", req.query);
    //console.log("\tCalled with '" , res.datarows , "'\n");
    //console.log("\tCalled with dataresult'" , res.dataresult , "'\n");
    console.log("before query -> ",req.params.search);
    //{primary_name: new RegExp('^'+req.params.search+'$', "i")}, // case insensitive match
    Person
    .find({
      "primary_name": new RegExp('^'+req.params.search, "i"),  // case insensitive prefix
      "upload_uuid" : req.params.upload_uuid,
      "union_iperson_id" : null 
    }) 
    .select('primary_name iperson_id union_iperson_id date_of_birth_year date_of_death_year flourished_year')
    .sort( 'primary_name' )
    .exec(
    function(err, newperson) {
      console.log("Local after query ", newperson, " err ", err);
      if (err) {
        res.json({ "error" : err });
      } else {
        var results = [], alabel;
        if ( newperson ) {
          for(var j = 0 ; j < newperson.length; j++ ){
            // alabel  = newperson[j].primary_name;
            alabel  = ' (' ;
            alabel += ' b:' + newperson[j].date_of_birth_year;
            alabel += ' d:' + newperson[j].date_of_death_year;
            alabel += ' fl:' + newperson[j].flourished_year;
            alabel += ' )' ;
            results.push(
              {
                "name"    : newperson[j].primary_name,                
                "date"    : alabel,                
                "value"   : newperson[j].iperson_id,
                "emloid"  : newperson[j].union_iperson_id
              }
            );
          }
        }
        console.log("\tLocal Responded with " , results , "\n");
        var combine  = results.concat(res.datarows);
        var combined = JSON.stringify(combine, null, "    ");
        res.end(req.query.callback + "(" + combined + ")");
        //res.json({ data: combined });
      }
    });
  /*  */
};

router.get(
  '/newplace/:upload_uuid/:search', function(req, res) {
    console.log("Search place to doAttach");
    doSearchPlace(req, res, doSearchLocalPlace);
  });      

// Search Local Place
doSearchLocalPlace =  function(req, res ) {
  console.log("Get(newplace) Request for autocomplete: ", req.query);
  //console.log("\tCalled with '" , res.datarows , "'\n");
  //console.log("\tCalled with dataresult'" , res.dataresult , "'\n");
  console.log("before query -> ",req.params.search);
  //{primary_name: new RegExp('^'+req.params.search+'$', "i")}, // case insensitive match
  Place
  .find({
    "location_name": new RegExp('^'+req.params.search, "i"),  // case insensitive prefix
    "upload_uuid" : req.params.upload_uuid,
    "union_location_id" : null 
  }) 
  .select('location_name location_id union_location_id ')
  .sort( 'location_name' )
  .exec(
    function(err, newplace) {
      console.log("Local after query ", newplace, " err ", err);
      if (err) {
        res.json({ "error" : err });
      } else {
        var results = [], alabel;
        if ( newplace ) {
          for(var j = 0 ; j < newplace.length; j++ ){
            /* //alabel  = newplace[j].primary_name;
            alabel  = ' (' ;
            alabel += ' b:' + newplace[j].date_of_birth_year;
            alabel += ' d:' + newplace[j].date_of_death_year;
            alabel += ' fl:' + newplace[j].flourished_year;
            alabel += ' )' ;
            */
            results.push(
              {
                "label"    : newplace[j].location_name,                
                //"date"    : alabel,                
                "value"   : newplace[j].location_id,
                "emloid"  : newplace[j].union_location_id
              }
            );
          }
        }
        console.log("\tLocal Responded with " , results , "\n");
        var combine  = results.concat(res.datarows);
        var combined = JSON.stringify(combine, null, "    ");
        res.end(req.query.callback + "(" + combined + ")");
        //res.json(results);
      }
    });
      /*  */
};
module.exports = router;