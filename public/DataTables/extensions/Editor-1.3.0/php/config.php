<?php if (!defined('DATATABLES')) exit(); // Ensure being used in DataTables env.

// Enable error reporting for debugging (remove for production)
error_reporting(E_ALL);
ini_set('display_errors', '1');


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Database user / pass
 */
$sql_details = array(
  "type" => "Postgres",
  "user" => "cofkrenhart",
  "pass" => "Sperry95",
  "host" => "192.168.56.1",
  "port" => "",
  "db"   => "nodetest"
);


