<?php
	require_once '../loader.php';
	define('APP_TITLE','Sistem Informasi Perjalanan Dinas');
	define('APP_LOGO','<strong>Sativa</strong> - Sistem Informasi Surat Perjalanan Dinas');
	
	define('BASE_URL',URL_LOADER.'spd/'); //alamat hosting,relative ke root address
	define('DIR_MAIN',realpath(dirname(__FILE__)).DIRECTORY_SEPARATOR);
	define('APP_PATH',DIR_MAIN.'apps');
	 
	 define('INDEX_PAGE','index.php/'); //jika tidak memakai .htacess isi dengan index.php/
	 define('DIR_ASSETS',DIR_LOADER.'assets'.DIRECTORY_SEPARATOR);
	 define('MINIMIZE_HTML',TRUE);
	 define('DEFAULT_UNIT',"front");
	 define('ACTIVE_SKIN','flaty'); //themes yang dipakai
	 define('SESS_PREFIX','SPD_'); //session prefix, default is JS5
	 define('AUTH_TYPE','FULL');//if full, always show login form
	 /*DATABASE SETTING */
	 define('DB_DRIVER','dbmysqli'); //dbi : mysqli driver
	 define('DB_SERVER', "127.0.0.1");
	 define('DB_USER', "root");
	 define('DB_PASS', "");
	 define('DB_DATABASE', "spd_db");
	 define('DB_LOG','stvlog'); /*untuk debuggin sql error*/
	 /*widget themes*/
	 define('WIDGET_THEMES','bootstrap-segoe');
?>
