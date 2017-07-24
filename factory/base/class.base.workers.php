<?php
	class workersFactory extends mainFactory{
		
		var $factory;
		public function __construct() {
		 	$this->factory=mainFactory::getInstance();
		}
		
		public function load($workername,$prefix="") {
			if ($prefix=="") $prefix="skin.".$this->factory->Skins->skinName;
			$this->loadMultiClass($this->factory->Skins->dir_worker,"class.".$prefix.".worker.",$workername);
		}
		
	}
?>
