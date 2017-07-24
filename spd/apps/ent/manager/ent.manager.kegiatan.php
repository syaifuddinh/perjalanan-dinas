<?php
class kegiatan extends ent {
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
		$this->factory->pageTitle="Entri Kegiatan SPD";
		$this->factory->pageDesc="";
		
		$this->defaultInterface();
		
		$this->factory->Skins->Workers->load("form");
		$this->factory->Component->load("jqwidgets"); //widgets
		$this->factory->Component->load("jqgrid"); //widgets
		
		$this->factory->Component->jqwidgets->setThemes($this->THEMES);
		$this->factory->Component->jqwidgets->load("data,buttons,scrollbar,menu,checkbox,listbox,dropdownlist,grid,combobox,window,numberinput,calendar,datetimeinput");
		//$this->factory->Component->jqwidgets->addGlobalization();
		$this->factory->Skins->addJSPlugins("jquery-validation/dist/jquery.validate.min.js,jquery-validation/dist/additional-methods.min.js");
		$this->factory->Skins->addJSPlugins("bootstrap-inputmask/bootstrap-inputmask.min.js");
		$this->factory->Units->loadJSVar("kegiatan");
		$this->factory->Units->loadUI("kegiatan");
		$this->factory->Skins->load("spd",false);
	}
	protected function get() {
		$this->factory->Component->load("jqgrid");
		$menu='<div class="btn-group">
				<a class="btn btn-small btn-danger" href="{id_kegiatan}" id="l_delete" ><i class="icon-trash"></i>&nbsp;Delete</a>
				<a class="btn btn-small btn-pink" href="{id_kegiatan}" id="l_tugas" ><i class="icon-envelope"></i>&nbsp;Surat Tugas</a>

</div>';
		$this->factory->Component->jqgrid->fetchDataModel("spdkegiatan","","tgl_mulai,tgl_akhir",$menu,"id_kegiatan");
	}
	protected function add($update=FALSE) {
		if (!isset($_POST["no_kegiatan"])) die();
		
		$this->factory->Models->load("spdkegiatan");
		echo $this->factory->Models->spdkegiatan->add($this->sanitizeInput(),$update);
	}
	protected function update() {
		
		if (isset($_POST["tgl_mulai"])) $_POST["tgl_mulai"] = date("d/m/Y",strtotime(strstr($_POST["tgl_mulai"], " (", true)));
		if (isset($_POST["tgl_akhir"])) $_POST["tgl_akhir"] = date("d/m/Y",strtotime(strstr($_POST["tgl_akhir"], " (", true)));
		$this->add(TRUE);
	}
	protected function remove() {
		if (!isset($_POST["id_kegiatan"])) die();
		$this->factory->Models->load("spdkegiatan");
		echo $this->factory->Models->spdkegiatan->del($_POST["id_kegiatan"]);
	}	
	protected function sanitizeInput() {
		$this->factory->Utils->load("string");
		if (isset($_POST["tgl_mulai"])) $_POST["tgl_mulai"] = $this->factory->Utils->string->dateInt($_POST["tgl_mulai"]);
		if (isset($_POST["tgl_akhir"])) $_POST["tgl_akhir"] = $this->factory->Utils->string->dateInt($_POST["tgl_akhir"]);
		if (isset($_POST["nama_kegiatan"])) $_POST["nama_kegiatan"] = strtoupper($_POST["nama_kegiatan"]);
		return $_POST;
	}
}