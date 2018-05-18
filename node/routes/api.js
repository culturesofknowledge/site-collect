/*
 * API
 */
var express = require('express');
var router = express.Router();
var pg = require('pg');

var checkAllowed = function( req, res ) {
	if ( !req.query.key || config.apiKeys.indexOf( req.query.key ) === -1 ) {
		res.end();
		return false;
	}

	return true;
};

router.get( '/person/:search', function(req, res) {

	if( checkAllowed( req, res) ) {

		// Search person PG database
		doSearchPGPeople(req, res, function (resultsPG) {

			if( req.query.upload_uuid ) {
				// Search new people
				doSearchLocalPeople(req, res, function (resultsLocal) {
					resultsLocal.concat( resultsPG );
					res.jsonp(resultsLocal);
				});
			}
			else {
				// Send data, if callback query set said as jsonp, otherwise json.
				res.jsonp(resultsPG);
			}

		});
	}
});

// Search Person PG database
var doSearchPGPeople = function(req, res, callbackDone){
	var client = new pg.Client(config.conString);
	client.connect();

	var b=['%'+req.params.search+'%'];
	var q="select";
	q += " foaf_name,uuid,iperson_id,date_of_birth_year,date_of_death_year,flourished_year";
	q += " from cofk_union_person";
	q += " where (foaf_name ilike $1 or skos_altlabel ilike $1)";
	q += " order by foaf_name";

	client.query( q , b)

		.on("error", function (error) {
			console.error( "Error in doSearchPG: " + error );
			callbackDone([]);
			client.end();
		})

		.on("row", function (row, result) {

			var person = {
				name: row.foaf_name,
				id: row.iperson_id,
				uuid: row.uuid // make uri with "http://emlo.bodleian.ox.ac.uk/" + uuid
			};

			if( row.date_of_birth_year ) {
				person.b = row.date_of_birth_year;
			}
			if( row.date_of_death_year ) {
				person.d = row.date_of_death_year;
			}
			if( row.flourished_year ) {
				person.fl = row.flourished_year;
			}

			result.addRow( person );
		})

		.on("end", function (result) {
			callbackDone(result.rows);
			client.end();
		});
};

// Search Local Person
var doSearchLocalPeople =  function(req, res, callbackDone ) {

	Person
		.find({
			"primary_name": new RegExp('^'+req.params.search, "i"),  // case insensitive prefix
			"upload_uuid" : req.query.upload_uuid,
			"union_iperson_id" : null
		})
		.select('primary_name iperson_id union_iperson_id date_of_birth_year date_of_death_year flourished_year')
		.sort( 'primary_name' )
		.exec(
			function(err, newperson) {
				console.log("Local after query ", newperson, " err ", err);
				if (err) {
					res.json({ "error" : err });
					callbackDone( res.datarows );
				} else {
					var results = [];
					if ( newperson ) {
						var j, alabel;
						for(j = 0 ; j < newperson.length; j++ ){

							alabel  = ' (' ;
							alabel += ' b:' + newperson[j].date_of_birth_year || "-";
							alabel += ', d:' + newperson[j].date_of_death_year || "-";
							alabel += ', fl:' + newperson[j].flourished_year || "-";
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

					callbackDone( results );
				}
			});
};

router.get( '/place/:search',  function(req, res) {

	if( checkAllowed( req, res) ) {

		doSearchPGPlace(req, res, function (results) {

			if( req.query.upload_uuid ) {
				res.datarows = results;
				doSearchLocalPlace(req, res, function (results) {
					res.jsonp(results);
				});
			}
			else {
				res.jsonp(results);
			}
		});
	}
});

// Search Person PG database
var doSearchPGPlace = function(req, res, callback) {

	var client = new pg.Client(config.conString);
	client.connect();

	var q="SELECT uuid,location_id,location_name,latitude,longitude";
	q += " FROM cofk_union_location ";
	q += " WHERE location_name ilike $1 ";
	q += " order by location_name";

	client.query( q , ['%'+req.params.search+'%'] )

		.on("error", function (error) {
			console.log( "Error in doSearchPlace: " + error )
		})

		.on("row", function (row, result) {
			var place = {
				id: row.location_id,
				loc: row.location_name,
				uuid: row.uuid  // make uri with "http://emlo.bodleian.ox.ac.uk/" + uuid
			};

			if( row.latitude ) {
				place.lat = row.latitude;
			}
			if( row.longitude ) {
				place.long = row.longitude;
			}

			result.addRow(place);
		})

		.on("end", function (result) {
			callback(result.rows);
			client.end();
		});
};



router.get(
	'/newplace/:upload_uuid/:search', function(req, res) {
		console.log("Search place to doAttach");
		doSearchPlace(req, res, doSearchLocalPlace);
	});

// Search Local Place
var doSearchLocalPlace =  function(req, res, callbackComplete ) {

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

				if (err) {
					res.json({ "error" : err });
					callbackComplete([]);
				} else {
					var results = [];
					if ( newplace ) {
						for(var j = 0 ; j < newplace.length; j++ ){
							results.push(
								{
									"label"    : newplace[j].location_name,
									"value"   : newplace[j].location_id,
									"emloid"  : newplace[j].union_location_id
								}
							);
						}
					}

					callbackComplete( results.concat(res.datarows) );
				}
			});
	/*  */
};

module.exports = router;