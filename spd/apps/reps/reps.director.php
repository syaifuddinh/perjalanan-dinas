<?php
class reps {
	var $factory;
	
	public function __construct() {
		$this->factory=mainFactory::getInstance();
	}

	public function disp($dispname="") {
		if ($dispname=="") {
			$dispname=$this->factory->Utils->general->getManagerName();
		}
		if ($dispname=="") die();
		$this->factory->Units->loadManager($dispname);
		
	}
}
?>