<?php
class pengikutspd extends ent {
	var $factory;
	public function __construct() {
		$this->factory=mainFactory::getInstance();
	}
	
	public function index() {
		$mt= $this->factory->Utils->general->getManagerMethod();
		if ($mt=="") $mt="view";
		if (method_exists($this,$mt))  $this->$mt();
	}
	protected function view() {
		$this->factory->pageTitle="Pengikut SPD";
		$this->factory->pageDesc="";
	
		$this->defaultInterface();
	
		$this->factory->Skins->Workers->load("form");
		$this->factory->Component->load("jqwidgets"); //widgets
		$this->factory->Component->load("jqgrid"); //widgets
	
		//$this->factory->Component->jqwidgets->setThemes($this->THEMES);
		$this->factory->Component->jqwidgets->load("data,buttons,scrollbar,menu,checkbox,listbox,dropdownlist,grid,combobox,window");
		$this->factory->Skins->addJSPlugins("jquery-validation/dist/jquery.validate.min.js,jquery-validation/dist/additional-methods.min.js");
		
		$this->factory->Units->loadJSVar("pengikutspd");
		$this->factory->Units->loadUI("pengikutspd");
		$this->factory->Skins->load("nomenu",false);
	}
	protected function get() {
		if (!isset($_GET["p"])) die();
		$this->factory->Component->load("jqgrid");
		$this->factory->Component->jqgrid->fetchDataModel("spdpengikut","","","","","id_pelaksana=".$_GET["p"]);
	}
	protected function add($update=FALSE) {
		if (!isset($_POST["id_pelaksana"])) die();
		
		$this->factory->Models->load("spdpengikut");
		echo $this->factory->Models->spdpengikut->add($_POST,$update);
	}
	protected function update() {
		$this->add(TRUE);
	}
	protected function remove() {
		if (!isset($_POST["id_pengikut"])) die();
		if (!isset($_POST["id_pelaksana"])) die();
		$this->factory->Models->load("spdpengikut");
		echo $this->factory->Models->spdpengikut->del($_POST);
	}	
}