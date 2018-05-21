/*
 * API
 */
var express = require('express');
var router = express.Router();
var pg = require('pg');

var checkAllowed = function( req, res ) {
	if ( !req.query.key || config.apiKeys.indexOf( req.query.key ) === -1 ) {
		res.status(400).send('Key missing.');
		res.end();

		return false;
	}

	return true;
};

router.get( '/people/:search', function(req, res) {

	if( checkAllowed( req, res) ) {

		// Search person PG database
		doSearchPGPeople(req, res, function (resultsPG) {

			if( req.query.upload_uuid ) {
				// Search new people
				doSearchLocalPeople(req, res, function (resultsLocal) {
					var resultsAll = resultsLocal.concat( resultsPG );
					res.jsonp(resultsAll);
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
	var q="" +
		"SELECT foaf_name,uuid,iperson_id,date_of_birth_year,date_of_death_year,flourished_year" +
		" FROM cofk_union_person" +
		" WHERE (foaf_name ilike $1 or skos_altlabel ilike $1)" +
		" ORDER by foaf_name" +
		" LIMIT 100";

	client.query( q , b)

		.on("error", function (error) {
			//console.error( "Error in doSearchPG: " + error );
			//callbackDone([]);
			res.status(500).send('Service down.');
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
			function(err, newPeople) {
				console.log("Local after query ", newPeople, " err ", err);
				if (err) {
					res.json({ "error" : err });
					callbackDone( res.datarows );
				} else {
					var results = [];
					if ( newPeople ) {
						for(var j = 0 ; j < newPeople.length; j++ ){
							var person = newPeople[j];
							var personData = {
									"name"    : person.primary_name,
									"additionid"   : person.iperson_id,
									"id"  : person.union_iperson_id,
									"addition" : true
								};

							if( person.date_of_birth_year ) {
								personData.b = person.date_of_birth_year;
							}
							if( person.date_of_death_year ) {
								personData.d = person.date_of_death_year;
							}
							if( person.flourished_year ) {
								personData.fl = person.flourished_year;
							}
							results.push( personData );
						}
					}

					callbackDone( results );
				}
			});
};

router.get( '/places/:search',  function(req, res) {

	if( checkAllowed( req, res) ) {

		doSearchPGPlace(req, res, function (resultsPG) {

			if( req.query.upload_uuid ) {
				res.datarows = resultsPG;
				doSearchLocalPlace(req, res, function (resultsLocal) {
					var resultsAll = resultsLocal.concat( resultsPG );
					res.jsonp(resultsAll);
				});
			}
			else {
				res.jsonp(resultsPG);
			}
		});
	}
});

// Search Person PG database
var doSearchPGPlace = function(req, res, callback) {

	var client = new pg.Client(config.conString);
	client.connect();

	var q="" +
		"SELECT uuid,location_id,location_name,latitude,longitude" +
		" FROM cofk_union_location" +
		" WHERE location_name ilike $1" +
		" ORDER by location_name" +
		" LIMIT 100";

	client.query( q , ['%'+req.params.search+'%'] )

		.on("error", function (error) {
			console.log( "Error in doSearchPlace: " + error );
			res.status(500).send('Service down.');
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
									"loc" : newplace[j].location_name,
									"id" : newplace[j].union_location_id,
									"addition" : true
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