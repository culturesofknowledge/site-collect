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

//

$refineSearch = "";

if ((isset($_REQUEST['id'])) && ($_REQUEST['id'] != "")){
	$refineSearch = " where location_id =  {$_REQUEST['id']} ";

}



$sql = <<<sql
select location_id, location_name from cofk_union_location $refineSearch order by location_name;
sql;

$result = pg_query($con, $sql);

if(!$result) { 	die("SQL Error $sql: " . pg_last_error($con) );}




	while ($row = pg_fetch_assoc($result)) {
		
		$rw = array();
		
		$rw['emloid'] = $row['location_id'];
		$rw['label'] = $row['location_name'];
		

		$rows[] = $rw;
	}
	
	
	
	print json_encode($rows);


?>