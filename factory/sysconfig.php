<?php
/**Core system/base**/
	define('ROOT_DIR', realpath(dirname(__FILE__)).DIRECTORY_SEPARATOR);
	define('DIR_BASE',ROOT_DIR.'base'.DIRECTORY_SEPARATOR); 
	define('DIR_SKINS',ROOT_DIR.'skins'.DIRECTORY_SEPARATOR); //skins
	
	define('DIR_DBA',ROOT_DIR.'dba'.DIRECTORY_SEPARATOR);
	define('DIR_UTILS',ROOT_DIR.'utils'.DIRECTORY_SEPARATOR);
	define('DIR_MODELS',DIR_MAIN.'models'.DIRECTORY_SEPARATOR); //model
	define('DIR_UNITS',APP_PATH.DIRECTORY_SEPARATOR); //units
	
	
	define('DIR_WIDGETS',ROOT_DIR.'components'.DIRECTORY_SEPARATOR); //widgets
	define('DIR_COMPONENTS',DIR_WIDGETS); //widgets
	
	
	define('BASEURL', BASE_URL.INDEX_PAGE);
	
	define('URL_BASE_SKIN',URL_FACTORY."skins/");

	define('URL_ASSETS',URL_LOADER."assets/");
	define('URL_FONTS',URL_ASSETS."fonts/");
	
	define('URL_COMMON',URL_FACTORY."common/");
	define('URL_WIDGETS',URL_FACTORY."components/");
	define('URL_COMPONENTS',URL_WIDGETS);
?>