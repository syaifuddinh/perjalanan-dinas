<?php
	class unitsFactory extends mainFactory{
		var $factory;
		var $unitSelected;
		var $unitPath;
		
		var $uipath;
		var $jspath;
		var $varpath;
		var $uilayout;
		var $mgrpath;
		
		public function __construct() {
		 $this->factory=mainFactory::getInstance();
		 
		}
		public function setUnit($unitName) {
			$this->unitSelected=$unitName;
			$this->unitPath=DIR_UNITS.$unitName.DIRECTORY_SEPARATOR;
			
			$this->uipath=$this->unitPath."ui".DIRECTORY_SEPARATOR;
			$this->jspath=$this->unitPath."js".DIRECTORY_SEPARATOR;
			$this->varpath=$this->unitPath."var".DIRECTORY_SEPARATOR;
			$this->uilayout=$this->unitPath."layout".DIRECTORY_SEPARATOR;
			$this->mgrpath=$this->unitPath."manager".DIRECTORY_SEPARATOR;
			return true;
		}
		public function load($directorName="index") {
			$className=strtolower($this->unitSelected);
			$classFile=$this->unitPath.$this->unitSelected.".director.php";
			
			if (!isset($this->vars[$className])) {
				if (!$this->loadCode($classFile,$className)) die();
				$this->vars[$className]=& instantiate_class(new $className());
				if (method_exists($this->vars[$className],$directorName)) {
					$this->vars[$className]->$directorName();
					return true;
				} else {
					echo "Invalid request";
					die();
				}
				
			}
		}
		public function loadManager($managerName,$functionName="index") {
			$className=strtolower($managerName);
			$classFile=$this->mgrpath.$this->unitSelected.".manager.".$className.".php";
			
			if (!isset($this->vars[$className])) {
				if (!$this->loadCode($classFile,$className)) die();
				$this->vars[$className]=& instantiate_class(new $className());
				if (method_exists($this->vars[$className],$functionName)) $this->vars[$className]->$functionName();
				return true;
			}
			return false;
		}
		public function loadUI($uilist) {
			$this->factory->UI=$uilist;
			return true;
		}
		public function loadUILayout($layoutname) {
			$this->loadMultiCode($this->uilayout,"layout.",$layoutname);
		}
		public function loadJS($jslist) {
			$this->factory->JS=$jslist;
			return true;
		}
		
		public function loadJSVar($jsvar) {
			$this->factory->JSVar=$jsvar;
			return true;
		}
		
		public function loadContentUI() {
			if ($this->factory->UI != "")
				$this->loadMultiCode($this->uipath,$this->unitSelected.".ui.",$this->factory->UI);
		}
		public function loadContentJS() {
			if ($this->factory->JS != "") {
				$this->loadMultiCode($this->jspath,$this->unitSelected.".",$this->factory->JS,true,"js");
			}
		}
		public function loadContentJSVar() {
			if ($this->factory->JSVar != "") {
				$this->loadMultiCode($this->varpath,$this->unitSelected.".var.",$this->factory->JSVar);
			}
		
		}
	}
?>