<?php 


$config = "emlo"; // local or emlo

switch($config){
	
	case "local":
		
		
		$dbhost = "localhost";
		$dbport = "5432";
		
		$dbuser = "postgres";
		$dbpassword = "password";
		
		$dbnametest = "test";
		$dbnameouls = "ouls";
		
		
		break;
		
		
	case "emlo":

		
		$dbhost = "localhost";
		$dbport = "5432";
		$dbuser = "postgres";
		$dbpassword = "";

		$dbnametest = "test";
		$dbnameouls = "ouls";
		

		break;
		
		
		
	
	
	
}









?>