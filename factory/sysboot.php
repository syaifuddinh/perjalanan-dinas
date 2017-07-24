<?php
	include "sysconfig.php";
	require_once DIR_BASE."class.base.sys.php";
	require_once DIR_BASE."class.base.dbs.php";
	
	require_once DIR_BASE."class.base.utils.php";
	require_once DIR_BASE."class.base.models.php";
	require_once DIR_BASE."class.base.units.php";
	require_once DIR_BASE."class.base.skins.php";
	require_once DIR_BASE."class.base.workers.php";
	require_once DIR_BASE."class.base.components.php";
	require_once DIR_BASE."class.base.director.php";
	
	function &instantiate_class(&$class_object)
	{
		return $class_object;
	}
	
?>