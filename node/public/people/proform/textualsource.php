<?php 
header("Access-Control-Allow-Origin: *");
/*
 * get all people and return as a json file
 * 
 */

include("lib/config.php");

$con=pg_connect("host=$dbhost port=$dbport dbname=$dbnametest user=$dbuser password=$dbpassword");

// Check connection
if (pg_last_error()) { 	echo "Failed to connect to database: " . pg_last_error();	exit();}

$rows = array();


$refineSearch = "";

if ((isset($_REQUEST['q'])) && ($_REQUEST['q'] != "")){
	
	// case-independent search of institution_name
	$refineSearch = " where lower(abbreviation) like lower('%" . $_REQUEST['q'] . "%')";
	$refineSearch .= " or lower(author) like lower('%" . $_REQUEST['q'] . "%')";
	$refineSearch .= " or lower(title) like lower('%" . $_REQUEST['q'] . "%')";
	$refineSearch .= " or lower(publisher) like lower('%" . $_REQUEST['q'] . "%')";
	
	
} else if ((isset($_REQUEST['id'])) && ($_REQUEST['id'] != "")){
	$refineSearch = " where id =  {$_REQUEST['id']} ";
	
}

$sql = <<<sql
select id, abbreviation, author, title, publisher from pro_textual_source $refineSearch order by abbreviation;
sql;




$result = pg_query($con, $sql);

if(!$result) { 	die("SQL Error $sql: " . pg_last_error($con) );}




	while ($row = pg_fetch_assoc($result)) {
		
		$rw = array();
		
		$rw['emloid'] = $row['id'];
		$rw['label'] = "{$row['abbreviation']} | {$row['author']}    {$row['title']}     {$row['publisher']} " ;
		

		$rows[] = $rw;
	}
	
	
	
	print json_encode($rows);


?>