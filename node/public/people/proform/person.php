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

if ((isset($_REQUEST['id'])) && ($_REQUEST['id'] != "")){
	$refineSearch = " where iperson_id =  {$_REQUEST['id']} ";
}


$sql = <<<sql
select iperson_id, foaf_name, date_of_birth_year, date_of_death_year, flourished_year from  cofk_union_person $refineSearch;
sql;

$result = pg_query($con, $sql);

if(!$result) { 	die("SQL Error $sql   " . pg_last_error($con) );}




	while ($row = pg_fetch_assoc($result)) {
		
		$rw = array();
		
		$rw['name'] = $row['foaf_name'];
		$rw['date'] = " (b: " . $row['date_of_birth_year'] . " d: " . $row['date_of_death_year'] . " fl: " . $row['flourished_year'] . " )"; 
		$rw['emloid'] = $row['iperson_id'];
		

		$rows[] = $rw;
	}
	
	
	
	print json_encode($rows);


?>