<?php 
header("Access-Control-Allow-Origin: *");
/*
 * get all people and return as a json file
 * 
 */

include("lib/config.php");

$con=pg_connect("host=$dbhost port=$dbport dbname=$dbnameouls user=$dbuser");

// Check connection
if (pg_last_error()) { 	echo "Failed to connect to database: " . pg_last_error();	exit();}

$rows = array();


$refineSearch = "";

if ($_REQUEST['q'] != ""){
	
	// case-independent search of institution_name
	$refineSearch = " where lower(institution_name) like lower('%" . $_REQUEST['q'] . "%')";
}


else if ($_REQUEST['id'] != ""){
	// search by id
	$refineSearch = " where institution_id = '" . $_REQUEST['id'] . "'";
}




$sql = <<<sql
select institution_id, institution_name from cofk_union_institution $refineSearch order by institution_name;
sql;


$result = pg_query($con, $sql);

if(!$result) { 	die("SQL Error $sql: " . pg_last_error($con) );}




	while ($row = pg_fetch_assoc($result)) {
		
		$rw = array();
		
		$rw['emloid'] = $row['institution_id'];
		$rw['label'] = $row['institution_name'];
		

		$rows[] = $rw;
	}
	
	
	
	print json_encode($rows);


?>