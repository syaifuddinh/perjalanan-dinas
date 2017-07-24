<?php
class biayaspd extends ent {
	var $factory;
	public function __construct() {
		$this->factory=mainFactory::getInstance();
	}
	public function index() {
		$mt= $this->factory->Utils->general->getManagerMethod();
		if ($mt=="") $mt="view";
		if (method_exists($this,$mt))  $this->$mt();
	}
	
	protected function viewbiaya() {
		/*data untuk input select*/
		if (!isset($_GET["p"])) die();
		$this->defaultInterface();
		$this->factory->Skins->Workers->load("form");
		
		$this->factory->Models->load("spdpelaksana,refall");
		$this->factory->formData=$this->factory->Models->spdpelaksana->getDetail($_GET['p']);
		if ($this->factory->formData["id_pelaksana"]=="") die(); 
		$this->factory->refData=$this->factory->Models->refall->getRefBiayaFromTingkat($this->factory->formData["tingkat_biaya"]);
		$this->factory->pageTitle="Perhitungan Biaya SPD";
		$this->factory->pageDesc="";
		
		$this->factory->Component->load("jqwidgets"); 
		//$this->factory->Component->jqwidgets->setThemes($this->THEMES);
		$this->factory->Component->jqwidgets->load("buttons,numberinput");
		
		$this->factory->Units->loadJSVar("biayaspd");
		$this->factory->Units->loadUI("biayaspd");
		$this->factory->Skins->load("nomenu",false);
	}
	
	
	protected function add() {
		if (!isset($_POST["id_pelaksana"])) die();
		$this->factory->Models->load("spdpelaksana");
		echo $this->factory->Models->spdpelaksana->add($this->sanitize(),true);
	}
	protected function sanitize() {
		$r=array("_",".","Rp ");
		$data=array();
		foreach($_POST as $key=>$val){
			$data[$key]=str_replace($r, '', $val);
		}
		return $data;
	}	
}