<?php 
header("Access-Control-Allow-Origin: *");

/*
 * get all activities and return as a json file
 * 
 */

include("lib/config.php");


$con=pg_connect("host=$dbhost port=$dbport dbname=$dbnametest user=$dbuser password=$dbpassword");

// Check connection
if (pg_last_error()) {
	echo "Failed to connect to database: " . pg_last_error();
	exit();
}

// restrict search if an id parameter exists
$queryActivityId = isset($_GET['id']) ? $_GET['id'] : ""; // activity id as GET parameter
//  addition to activity search sql statement
$qualifyQuery = ($queryActivityId != '') ? " where id = $queryActivityId  "  : "";
 


$sql = <<<sql
select * from pro_activity $qualifyQuery order by activity_type_id, activity_name, timestamp  ;
sql;




$sqlRole = <<<sql
select * from pro_role_in_activity where activity_id = '%s' ;
sql;

$sqlAssertion = <<<sql
select * from pro_assertion where assertion_type = 'activity' and assertion_id = '%s';
sql;

$sqlRelationship = <<<sql
select * from pro_relationship where activity_id = '%s';
sql;

$sqlLocation = <<<sql
select * from pro_location where activity_id = '%s';
sql;


$sqlPrimaryPerson = <<<sql
select * from pro_primary_person where activity_id = '%s';
sql;



$term = (isset($_REQUEST["term"])) ? $_REQUEST["term"] : "";
$person = (isset($_REQUEST["subject"])) ? $_REQUEST["subject"] : "";



// ACTIVITY QUERY
$result = pg_query($con, $sql);

if(!$result) {
	die("SQL Error: " . pg_last_error($con));
}


$rows = array();


// ITERATE THROUGH ACTIVITY RESULTS
while ($row = pg_fetch_assoc($result)) {
	
	
	$activity_id = $row["id"];
	
	$activity_label = "{$row['activity_type_id']}  {$row['activity_name']}  {$row['activity_description']}";
	
	$row['text'] = $activity_label;
	$row['role_in_activity'] = getRows($activity_id, $con, $sqlRole);
	$row['relationship'] = getRows($activity_id, $con, $sqlRelationship);
	$row['location'] = getRows($activity_id, $con, $sqlLocation);
	$row['assertion'] = getRows($activity_id, $con, $sqlAssertion);
	$row['primary_person'] = getRows($activity_id, $con, $sqlPrimaryPerson);
	
	$rows[] = $row;
		
}


print json_encode($rows);




function getRows($activity_id, $con, $sqlvar){
	
	$rows = array();
	
	$sql = sprintf($sqlvar, $activity_id);

	
	$result = pg_query($con, $sql);
	
	if(!$result) {
		die("SQL Error $sqlvar: " . pg_last_error($con));
	}
	
	while ($row = pg_fetch_assoc($result)) {
		
		$rows[] = $row;
	}
	
	return $rows;
}




?>