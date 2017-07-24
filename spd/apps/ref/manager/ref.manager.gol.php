<?php
class gol extends ref {
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
		$this->factory->pageTitle="Referensi Golongan";
		$this->factory->pageDesc="";
	
		$this->defaultInterface();
	
		$this->factory->Skins->Workers->load("form");
		$this->factory->Component->load("jqwidgets"); //widgets
		$this->factory->Component->load("jqgrid"); //widgets
	
		$this->factory->Component->jqwidgets->setThemes($this->THEMES);
		$this->factory->Component->jqwidgets->load("data,buttons,scrollbar,menu,checkbox,listbox,dropdownlist,grid,combobox,window");
		$this->factory->Skins->addJSPlugins("jquery-validation/dist/jquery.validate.min.js,jquery-validation/dist/additional-methods.min.js");
		
		$this->factory->Units->loadJSVar("gol");
		$this->factory->Units->loadUI("gol");
		$this->factory->Skins->load("spd",false);
	}
	protected function get() {
		$this->factory->Component->load("jqgrid");
		$this->factory->Component->jqgrid->fetchDataModel("refall","getRefGol");
	}
	protected function add($update=FALSE) {
		if (!isset($_POST["gol"])) die();
		
		$this->factory->Models->load("refall");
		echo $this->factory->Models->refall->addRefGol($_POST,$update);
	}
	protected function update() {
		$this->add(TRUE);
	}
	protected function remove() {
		if (!isset($_POST["gol"])) die();
		$this->factory->Models->load("refall");
		echo $this->factory->Models->refall->delRefGol($_POST["gol"]);
	}	
}