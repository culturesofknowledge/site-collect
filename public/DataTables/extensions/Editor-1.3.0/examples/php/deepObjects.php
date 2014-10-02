<?php

/*
 * Example PHP implementation used for the deppObjects.html example
 *
 * Please note that this example is UNNECESSARILY complex! It has been made so
 * to demonstrate the client-side software's ability to use nested objects.
 *
 * Set formatters are used to get the data from the nested data objects sent
 * by the client-side on set, and the `nestData()` function is used to create
 * the nested data structure
 */

// DataTables PHP library
include( "../../php/DataTables.php" );

// Alias Editor classes so they are easy to use
use
	DataTables\Editor,
	DataTables\Editor\Field,
	DataTables\Editor\Format,
	DataTables\Editor\Join,
	DataTables\Editor\Validate;

// Build our Editor instance and process the data coming from _POST
$json = Editor::inst( $db, 'datatables_demo' )
	->fields(
		Field::inst( 'first_name' )
			->validator( 'Validate::notEmpty' )
			->setFormatter( function ( $val, $data ) {
				return $data['name']['first_name'];
			} ),
		Field::inst( 'last_name' )
			->validator( 'Validate::notEmpty' )
			->setFormatter( function ( $val, $data ) {
				return $data['name']['last_name'];
			} ),
		Field::inst( 'position' )
			->setFormatter( function ( $val, $data ) {
				return $data['hr']['position'];
			} ),
		Field::inst( 'email' )
			->setFormatter( function ( $val, $data ) {
				return isset($data['contact']['email']) ? $data['contact']['email'] : null;
			} ),
		Field::inst( 'office' )
			->setFormatter( function ( $val, $data ) {
				return $data['hr']['office'];
			} ),
		Field::inst( 'salary' )
			->setFormatter( function ( $val, $data ) {
				return $data['hr']['salary'];
			} ),
		Field::inst( 'extn' )
			->validator( 'Validate::numeric' )
			->setFormatter( function ( $val, $data ) {
				return $data['contact']['extn'];
			} ),
		Field::inst( 'start_date' )
			->validator( 'Validate::dateFormat', array(
				"format"  => Format::DATE_ISO_8601,
				"message" => "Please enter a date in the format yyyy-mm-dd"
			) )
			->getFormatter( 'Format::date_sql_to_format', Format::DATE_ISO_8601 )
			->setFormatter( function ( $val, $data ) {
				return $data['hr']['start_date'];
			} )
	)
	->process( $_POST )
	->data();


// If getting data for the table, manipulate the output so it contains nested
// objects for the deepObjects example.
//
// You typically wouldn't do this here(!), but we do so for the deepObjects 
// example to show how the client-side can cope with nested objects
if ( !isset($_POST['action']) ) {
	for ( $i=0 ; $i<count($json['data']) ; $i++ ) {
		$json['data'][$i] = nestData( $json['data'][$i] );
	}
}
else if ( isset($json['row']) ){
	// create, edit
	$json['row'] = nestData( $json['row'] );
}

echo json_encode( $json );



function nestData( $row )
{
	return array(
		"DT_RowId" => $row['DT_RowId'],
		"name" => array(
			"full"      => $row['first_name'].' '.$row['last_name'],
			"first_name" => $row['first_name'],
			"last_name"  => $row['last_name']
		),
		"contact" => array(
			"email" => $row['email'],
			"extn"  => $row['extn']
		),
		"hr" => array(
			"salary"     => $row['salary'],
			"start_date" => $row['start_date'],
			"office"     => $row['office'],
			"position"   => $row['position']
		)
	);
}

