<?php
class xls {
	var $factory;
	var $repFile;
	var $data;
	var $xl;
	var $pejabat;
	public function __construct() {

	}

	public  function index() {
		
		$this->factory=mainFactory::getInstance();

		if (isset($this->factory->pages[5])) {
			$this->repFile=$this->factory->pages[5];
		} else {
			die("invalid report file");
		}
		$f= $this->factory->Units->unitPath."xls".DIRECTORY_SEPARATOR."xls.".$this->repFile.".php";
		if (!file_exists($f)) die("report ".$this->repFile." not found");
		$this->factory->Component->load("xl");
		$this->factory->Models->load("spdpelaksana,refall");
		
		$this->xl=$this->factory->Component->xl;
		$this->data=$this->factory->Models->spdpelaksana;
		$this->pejabat=$this->factory->Models->refall;
		include_once ($f);
		$run = new $this->repFile($this);
	}
	
	
}