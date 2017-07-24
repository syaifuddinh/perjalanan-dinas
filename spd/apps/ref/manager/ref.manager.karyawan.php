<?php
class karyawan extends ref {
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
		$this->factory->pageTitle="Referensi Karyawan";
		$this->factory->pageDesc="";
	
		$this->defaultInterface();
	
		$this->factory->Skins->Workers->load("form");
		$this->factory->Component->load("jqwidgets"); //widgets
		$this->factory->Component->load("jqgrid"); //widgets
	
		$this->factory->Component->jqwidgets->setThemes($this->THEMES);
		$this->factory->Component->jqwidgets->load("data,buttons,scrollbar,menu,checkbox,listbox,dropdownlist,grid,combobox,window");
		$this->factory->Skins->addJSPlugins("jquery-validation/dist/jquery.validate.min.js,jquery-validation/dist/additional-methods.min.js");
	
		//referensi golongan
		$this->factory->Models->load("refall");
		$this->factory->Models->refall->getRefGol();
		$this->factory->golList=$this->factory->Models->refall->results;
		//create json array
		$this->factory->Utils->load("string");
		$this->factory->Units->loadJSVar("karyawan");
		$this->factory->Units->loadUI("karyawan");
		$this->factory->Skins->load("spd",false);
	}
	protected function get() {
		$this->factory->Component->load("jqgrid");
		$this->factory->Component->jqgrid->fetchDataModel("spdkaryawan");
	}
	protected function add($update=FALSE) {
		if (!isset($_POST["nama_karyawan"])) die();
	
		$this->factory->Models->load("spdkaryawan");
		echo $this->factory->Models->spdkaryawan->add($_POST,$update);
	}
	protected function update() {
		$this->add(TRUE);
	}
	protected function remove() {
		if (!isset($_POST["id_karyawan"])) die();
		$this->factory->Models->load("spdkaryawan");
		echo $this->factory->Models->spdkaryawan->del($_POST["id_karyawan"]);
	}
	protected function getbiayakaryawan() {
		if (!isset($_GET["idk"])) die();
		$this->factory->Models->load("spdkaryawan");
		echo $this->factory->Models->spdkaryawan->getTingkatBiaya($_GET["idk"]);
	}	
}