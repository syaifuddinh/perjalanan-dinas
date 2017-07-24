<?php
class browse {
	var $factory;

	public function __construct() {
		$this->factory=mainFactory::getInstance();
	
	}
	
	protected function defaultInterface($lname) {
		$this->factory->setupUI();
		$this->factory->Skins->Workers->load("container");
		$this->factory->Component->load("jqwidgets"); 
		$this->factory->Component->load("jqgrid"); 
		$this->factory->Component->jqwidgets->load("data,buttons,scrollbar,menu,checkbox,listbox,dropdownlist,grid,combobox,window,numberinput,calendar,datetimeinput");
		$this->factory->Units->loadJSVar($lname);
		$this->factory->Units->loadUI("dg");
		$this->factory->Skins->load("nomenu",false);
		return true;
	}
	
	public function index() {
		$this->disp("lkegiatan");
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