<?php
class home extends front {
	var $factory;
	public function __construct() {
		$this->factory=mainFactory::getInstance();
	}
	public function index() {
		$mt= $this->factory->Utils->general->getManagerMethod();
		if ($mt=="") $mt="view";
		
		if (method_exists($this,$mt))  $this->$mt();
	}
	protected function view(){
		$this->factory->pageTitle="Welcome";
		$this->factory->pageDesc="Sistem Informasi Surat Perjalanan Dinas Kementerian Kesehatan RI";
		$this->defaultInterface();
		$this->factory->Utils->load("string");
		$this->factory->Models->load("spdstatistik");
		$this->factory->Models->spdstatistik->getInfo();
	//	$this->factory->Component->load("jqwidgets"); //widgets
	//	$this->factory->Component->load("jqgrid"); //widgets
		
	//	$this->factory->Component->jqwidgets->load("data,buttons,scrollbar,menu,checkbox,listbox,dropdownlist,grid,grid.aggregates,combobox,numberinput,calendar,datetimeinput");
		
		
//		$this->factory->Skins->addJSPlugins("colorbox/colorbox.min.js");
	//	$this->factory->Skins->addCSSPlugins("colorbox/colorbox");
		
		//$this->factory->Units->loadJSVar("spdlist");
		$this->factory->Units->loadUI("home");
		$this->factory->Skins->load("spd",false);
	}
	protected function getStatistik() {
		
	}
	protected function get() {
		
	}
}