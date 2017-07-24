<?php
	ob_start();
	session_start();
	date_default_timezone_set('Asia/Jakarta');
	error_reporting(E_ALL);
	require_once "config.php";
	require_once DIR_LOADER."factory".DIRECTORY_SEPARATOR."sysboot.php";
	
	$myapp=mainFactory::getInstance();
	$myapp->runApp();
	
	ob_end_flush();

?>