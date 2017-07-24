<?php
class lkegiatan extends browse {
	var $factory;
	public function __construct() {
		$this->factory=mainFactory::getInstance();
	}
	public function index() {
		$mt= $this->factory->Utils->general->getManagerMethod();
		if ($mt=="") $mt="view";
		$this->$mt();
	}
	protected function view(){
		$this->factory->pageTitle="Daftar Kegiatan";
		$this->factory->pageDesc="";
		$this->defaultInterface("lkegiatan");
	}
	protected function get() {
		$this->factory->Component->load("jqgrid");
		$this->factory->Component->jqgrid->fetchDataModel("spdkegiatan","","tgl_mulai,tgl_akhir");
	}
}