<?php
class biaya extends ref {
	var $factory;
	
	public function __construct() {
		$this->factory=mainFactory::getInstance();
	}
	public function index() {
		$mt= $this->factory->Utils->general->getManagerMethod();
		if ($mt=="") $mt="view";
		$this->$mt();
	}
	protected function view() {
		$this->factory->pageTitle="Referensi Tingkat Biaya";
		$this->factory->pageDesc="";
		
		$this->defaultInterface();
		
		$this->factory->Skins->Workers->load("form");
		$this->factory->Component->load("jqwidgets"); //widgets
		$this->factory->Component->load("jqgrid"); //widgets
		
		$this->factory->Component->jqwidgets->setThemes($this->THEMES);
		$this->factory->Component->jqwidgets->load("data,buttons,scrollbar,menu,checkbox,listbox,dropdownlist,grid,combobox,window,numberinput");
		$this->factory->Skins->addJSPlugins("jquery-validation/dist/jquery.validate.min.js,jquery-validation/dist/additional-methods.min.js");
		
		$this->factory->Units->loadJSVar("biaya");
		$this->factory->Units->loadUI("biaya");
		$this->factory->Skins->load("spd",false);
	}
	protected function get() {
		$this->factory->Component->load("jqgrid");	
		$this->factory->Component->jqgrid->fetchDataModel("refall","getRefBiaya");
	}
	protected function add($update=FALSE) {
		if (!isset($_POST["tingkat_biaya"])) die();
		$this->factory->Utils->load("validator");
		
		$_POST["tingkat_biaya"] = strtoupper($_POST["tingkat_biaya"]);
		$_POST["u_harian"] = validator::convertNumber($_POST["u_harian"]);
		$_POST["u_inap"] = validator::convertNumber($_POST["u_inap"]);
		$_POST["id"]="#ignore";
		$this->factory->Models->load("refall");
		echo $this->factory->Models->refall->addTingkatBiaya($_POST,$update);
	}
	protected function update() {
		$this->add(TRUE);
	}
	protected function remove() {
		if (!isset($_POST["tingkat_biaya"])) die();
		$this->factory->Models->load("refall");
		echo $this->factory->Models->refall->delTingkatBiaya($_POST["tingkat_biaya"]);
	}
}