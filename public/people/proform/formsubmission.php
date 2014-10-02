<?php 

include("lib/config.php");


$con=pg_connect("host=$dbhost port=$dbport dbname=$dbnametest user=$dbuser password=$dbpassword");



// Check connection
if (pg_last_error()) {
	echo "Failed to connect to database: " . pg_last_error($con);
	exit();
}




$sql = "START TRANSACTION;";

if (pg_query($con, $sql)) {} else {  die('Error: ' . pg_last_error($con));}


//  add activity
$activity_id = add_activity($con);

//  add textual sources
add_textual_sources($activity_id, $con);

//  add location
add_location($activity_id, $con);

//  add role
add_role($activity_id, $con);

// add relationship
add_relationship($activity_id, $con);


// commit inserts if no errors occurred
$sql = "COMMIT;";


if (pg_query($con, $sql)) {} else {  die('Error with commit: ' . pg_last_error($con));}

// close db connection
pg_close($con);


echo "The activity has been added.";

/*
 * FUNCTIONS
*/


function add_relationship($activity_id, $con){
	$date = date('Y-m-d H:i:s');
	$counterRole = 1;
	
	do 
	{ // loop roles
		if (isset($_POST["subject_role_" . $counterRole]))
		{
			
		$counterRel = 1; // reset relationship counter
		
		do { // loop relationships
			if (isset($_POST["relationship_{$counterRole}_{$counterRel}"]))
				{
	
				$subject_id = $_POST["subject"];
				$subject_type = "Person";
				$subject_role_id = $_POST["subject_role_{$counterRole}"];
				$relationship =  $_POST["relationship_{$counterRole}_{$counterRel}"];
				$object_id = (isset($_POST["object_{$counterRole}_{$counterRel}"])) ? pg_escape_string($con, $_POST["object_{$counterRole}_{$counterRel}"]) : "" ;
				$object_type =  $_POST["object_type_{$counterRole}_{$counterRel}"];
				$object_role = (isset($_POST["object_role_{$counterRole}_{$counterRel}"])) ? $_POST["object_role_{$counterRole}_{$counterRel}"] : "";
			
				
			
				// sql relationship
				$sqlRel = <<<sql
								INSERT INTO pro_relationship 
								(activity_id, subject_id, subject_type, relationship_id, object_id, object_type, timestamp, subject_role_id) 
								VALUES 
								('$activity_id', '$subject_id', '$subject_type', '$relationship', '$object_id', '$object_type', '$date', '$subject_role_id');
sql;
				
			
				// sql role
				$sqlRole = <<<sql

								INSERT INTO pro_role_in_activity 
								(activity_id, entity_id, entity_type, role_id, timestamp) 
								VALUES 
								('$activity_id', '$object_id', '$object_type', '$object_role', '$date');
sql;

				
				
	
				// add entry in database
				if ($_POST["relationship_{$counterRole}_{$counterRel}"] != '') {	
						if (pg_query($con, $sqlRel)) { } else {  die('Error adding relationship: ' . pg_last_error($con));}
						
						
						// only add role for object if a role has been recorded
						if ($object_role != '') {

							if (pg_query($con, $sqlRole)) { } else {  die('Error adding object role: ' . pg_last_error($con));}
						}
				
				}
				$counterRel++;
	
				} else {$counterRel = -1; } // end loop relationships
	
			} while ($counterRel != -1);  // loop relationships
		
		$counterRole++;
			
		} else { $counterRole = -1; } // end loop roles
		
		
	} while ($counterRole != -1);  // loop roles
	
	

}












function add_role($activity_id, $con){

	$date = date('Y-m-d H:i:s');
	$counter = 1;
	
	do {
	
		if (isset($_POST["subject_role_" . $counter])){
	
			$subject_role = $_POST["subject_role_" . $counter];
			$entity_id = $_POST["subject"];	
	
			$sql = <<<sql

INSERT INTO pro_role_in_activity 
(activity_id, entity_id, entity_type, role_id, timestamp) 
VALUES 
('$activity_id', '$entity_id', 'Person', '$subject_role', '$date');

sql;
	
			// if source_id field is not null then add entry in database
			if ($_POST["subject_role_" . $counter] != '') { 	
				
				if (pg_query($con, $sql)) {} else {  die('Error adding subject role: ' . pg_last_error($con));}
				
				
				
				 }
				$counter++;
	
		} else {
			// stop the loop if the form field with counter isn't set
			$counter = -1;
		}
	
	} while ($counter != -1);
	
}


function add_location($activity_id, $con){
	
	$date = date('Y-m-d H:i:s');
	$counter = 1;
	
	do {
	
		if (isset($_POST["location_id_" . $counter])){
	
			$location_id = pg_escape_string($con, $_POST["location_id_" . $counter]);
			
	
			$sql = <<<sql

INSERT INTO pro_location 
(location_id, activity_id, timestamp) 
VALUES 
('$location_id', '$activity_id', '$date');

sql;
	
	
			if ($_POST["location_id_" . $counter] != '') { 
				if (pg_query($con, $sql)) {} else {  die('Error adding location: ' . pg_last_error($con));}
				
				}
				$counter++;
	
		} else {
			// stop the loop if the form field with counter isn't set
			$counter = -1; }
	
	} while ($counter != -1);
	
	
}



/*
* add activity to activity table
*/

function add_activity($con){
	$date = date('Y-m-d H:i:s');
	$sql2return = "";
	// free text form values
	
	// escape free text form field values
	$activity_type = pg_escape_string($con, $_POST["activity_type"]);
	$activity_name = pg_escape_string($con, $_POST["activity_name"]);
	$activity_description = pg_escape_string($con, $_POST["activity_description"]);
	
	$additional_notes  = pg_escape_string($con, $_POST["additional_notes"]);
	$notes_used = pg_escape_string($con, $_POST["notes_used"]);
	
	// construct sql statement
	$sql = <<<sql
INSERT INTO pro_activity (
		activity_type_id, activity_name, activity_description,
		date_type,
		date_from_year, date_from_month, date_from_day, date_from_uncertainty,
		date_to_year, date_to_month, date_to_day, date_to_uncertainty,
		notes_used, additional_notes, timestamp
) VALUES
		(
'$activity_type', '$activity_name', '$activity_description',
		'{$_POST['date_type']}',
		'{$_POST['date_from_year']}', '{$_POST['date_from_month']}', '{$_POST['date_from_day']}', '{$_POST['date_from_uncertainty']}',
		'{$_POST['date_to_year']}', '{$_POST['date_to_month']}', '{$_POST['date_to_day']}', '{$_POST['date_to_uncertainty']}',
		'$notes_used', '$additional_notes','$date'
	
)
	 returning id;
sql;
	
	
	
	// insert record in database
	$result = pg_query($con, $sql);
	
	// return id for new record, to be used as foreign key in other tables
	$insert_row = pg_fetch_row($result); // get id of activity added
	$activity_id = $insert_row[0];
	return $activity_id;
	
}





/*
 * add textual sources
 * 
 */


function add_textual_sources($activity_id, $con){
	$date = date('Y-m-d H:i:s');
	$counter = 1;
do {
	
	if (isset($_POST["source_id_" . $counter])){
		
		$source_id = pg_escape_string($con, $_POST["source_id_" . $counter]);
		$source_description = pg_escape_string($con, $_POST["source_details_" . $counter]);
		
		$sql = <<<sql
INSERT INTO pro_assertion 
(assertion_type, assertion_id, source_id, source_description, timestamp)	
VALUES 
('activity', '$activity_id', '$source_id', '$source_description', '$date');

sql;
		
		
		
		// if source_id field is not null then add entry in database
		if ($_POST["source_id_" . $counter] != '') { 
			
			if (pg_query($con, $sql)) { printf("<p>source added.</p>");} else {  die('Error adding textual source: ' . pg_last_error($con));}
				
			}	
		$counter++;
	} else {
		// stop the loop if the form field with counter isn't set
		$counter = -1;
	}
	
} while ($counter != -1);

}
















?>