<?php
class spdlist extends front {
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
		$this->factory->pageTitle="Daftar Perjalanan Dinas";
		$this->factory->pageDesc="";
		$this->defaultInterface();
		$this->factory->Component->load("jqwidgets"); //widgets
		$this->factory->Component->load("jqgrid"); //widgets
		
		$this->factory->Component->jqwidgets->load("data,buttons,scrollbar,menu,checkbox,listbox,dropdownlist,grid,grid.aggregates,combobox,numberinput,calendar,datetimeinput");
		
		
		$this->factory->Skins->addJSPlugins("colorbox/colorbox.min.js");
		$this->factory->Skins->addCSSPlugins("colorbox/colorbox");
		
		$this->factory->Units->loadJSVar("spdlist");
		$this->factory->Units->loadUI("spdlist");
		$this->factory->Skins->load("spd",false);
	}
	
	protected function get() {
		$this->factory->Component->load("jqgrid");
		$menu='<div class="btn-group">
<a class="btn btn-small btn-magenta" href="{id_pelaksana}" id="l_biaya" title="Print Rincian Biaya" ><i class="icon-print"></i></a>
<a class="btn btn-small btn-pink" href="{id_pelaksana}" id="l_surat" title="Print Surat Tugas" ><i class="icon-envelope"></i></a>
</div>';
		$this->factory->Component->jqgrid->fetchDataModel("spdpelaksana","","tgl_surat,tgl_berangkat,tgl_kembali",$menu,"id_pelaksana");
	}
}