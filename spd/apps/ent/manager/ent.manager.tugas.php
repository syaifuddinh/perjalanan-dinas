<?php
class tugas extends ent {
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
		/*cek apakah halaman ini dipanggil dari page kegiatan*/
		$this->getkegiatandetail();
		$this->factory->pageTitle="Entri Surat Tugas";
		$this->factory->pageDesc="";
		
		$this->defaultInterface();
		
		$this->factory->Skins->Workers->load("form");
		$this->factory->Component->load("jqwidgets"); //widgets
		$this->factory->Component->load("jqgrid"); //widgets
		
		$this->factory->Component->jqwidgets->setThemes($this->THEMES);
		$this->factory->Component->jqwidgets->load("data,buttons,scrollbar,menu,checkbox,listbox,dropdownlist,grid,combobox,window,numberinput,calendar,datetimeinput");
		$this->factory->Skins->addJSPlugins("jquery-validation/dist/jquery.validate.min.js,jquery-validation/dist/additional-methods.min.js");
		
		$this->factory->Skins->addJSPlugins("colorbox/colorbox.min.js");
		$this->factory->Skins->addCSSPlugins("colorbox/colorbox");
		
		$this->factory->Units->loadJSVar("tugas");
		$this->factory->Units->loadUI("tugas");
		$this->factory->Skins->load("spd",false);
	}
	protected function viewdetail() {
		/*data untuk input select*/
		if (!isset($_GET["idk"])) die();
		$this->getkegiatandetail($_GET["idk"]);
		$this->factory->Models->load("spdkaryawan,refall");
		$this->factory->Models->spdkaryawan->order = "nama_karyawan";
		$this->factory->Models->spdkaryawan->get("concat(nip_karyawan,'. ',nama_karyawan) as label,(id_karyawan) as value");
		$this->factory->Models->refall->getRefBiaya("tingkat_biaya");
		
		$this->factory->Utils->load("string");
		
		$this->factory->pageTitle="Entri Surat Tugas";
		$this->factory->pageDesc="";
		
		$this->defaultInterface();
		$this->factory->Skins->Workers->load("form");
		if (isset($_GET["p"])) {
			//edit mode
			$this->factory->Models->load("spdpelaksana");
			$this->factory->formData=$this->factory->Models->spdpelaksana->getDetail($_GET['p']);
			$this->factory->Skins->Workers->form->formData=$this->factory->formData;
			
		}
		
		
		$this->factory->Component->load("jqwidgets"); //widgets
		$this->factory->Component->jqwidgets->setThemes($this->THEMES);
		$this->factory->Component->jqwidgets->load("datetimeinput,calendar");
		$this->factory->Skins->addJSPlugins("jquery-validation/dist/jquery.validate.min.js,jquery-validation/dist/additional-methods.min.js");
		$this->factory->Skins->addJSPlugins("bootstrap-inputmask/bootstrap-inputmask.min.js,chosen-bootstrap/chosen.jquery.min.js");
		$this->factory->Skins->addCSSPlugins("chosen-bootstrap/chosen.min");
		$this->factory->Units->loadJSVar("tugas.detail");
		$this->factory->Units->loadUI("tugas.detail");
		$this->factory->Skins->load("nomenu",false);
	}
	protected function getkegiatandetail($id="") {
		if ($id=="") {
			if (!isset($_GET["k"])) return false;
			$id = $_GET["k"];
		}
		
			/*ambil data kegiatan*/
			$this->factory->Models->load("spdkegiatan");
			if ($this->factory->Models->spdkegiatan->getDetail($id)) {
				$this->factory->Utils->load("string");
				$this->factory->idkegiatan=$this->factory->Models->spdkegiatan->results["id_kegiatan"];
				$this->factory->namakegiatan=$this->factory->Models->spdkegiatan->results["nama_kegiatan"];
				$this->factory->tglmulai=$this->factory->Models->spdkegiatan->results["tgl_mulai"];
				$this->factory->tglakhir=$this->factory->Models->spdkegiatan->results["tgl_akhir"];
			} 
	
	}
	protected function get() {
		if (!isset($_GET["idk"])) $_GET["idk"] = "0";
		if ($_GET["idk"]=="") $_GET["idk"] = "0";
		$wh= "id_kegiatan=".$this->factory->DB->escape($_GET["idk"]);
		
		$this->factory->Component->load("jqgrid");
		$menu='<div class="btn-group">
<a class="btn btn-small btn-danger" href="{id_pelaksana}" id="l_delete" title="Delete"><i class="icon-trash"></i></a>
<a class="btn btn-small btn-warning" href="{id_pelaksana}" id="l_ikut" title="Daftar Pengikut"><i class="icon-group"></i></a>
<a class="btn btn-small btn-magenta" href="{id_pelaksana}" id="l_biaya" title="Print Rincian Biaya" ><i class="icon-print"></i></a>
<a class="btn btn-small btn-pink" href="{id_pelaksana}" id="l_surat" title="Print Surat Tugas" ><i class="icon-envelope"></i></a>
<a class="btn btn-small btn-success" href="{id_pelaksana}" id="l_rampung" title="Perhitungan SPD Rampung" ><i class="icon-money"></i></a>
<a class="btn btn-small btn-lime" href="{id_pelaksana}" id="l_edit" title="Edit" ><i class="icon-pencil"></i></a>
</div>';
		$this->factory->Component->jqgrid->fetchDataModel("spdpelaksana","","tgl_surat,tgl_berangkat,tgl_kembali",$menu,"id_pelaksana",$wh);
	}
	protected function add($update=false) {
		
		if (!isset($_POST["id_kegiatan"])) die();
		if (isset($_POST["id_pelaksana"])) {
			if ($_POST["id_pelaksana"]!="")  {
				$update=true;
			} else {
				$_POST["id_pelaksana"]="#ignore";
			}
		}
		$this->factory->Models->load("spdpelaksana");
		echo $this->factory->Models->spdpelaksana->add($this->sanitizeInput(),$update);
	}
	
	protected function remove() {
		if (!isset($_POST["id_pelaksana"])) die();
		$this->factory->Models->load("spdpelaksana");
		echo $this->factory->Models->spdpelaksana->del($_POST["id_pelaksana"]);
	}	
	protected function sanitizeInput() {
		$this->factory->Utils->load("string");
		if (isset($_POST["tgl_spd"])) {
			$t=explode(" - ", $_POST["tgl_spd"]);
			$_POST["tgl_berangkat"] = $t[0];
			$_POST["tgl_kembali"] = $t[1];
			$_POST["tgl_spd"] = "#ignore";
		}
		if (isset($_POST["tgl_surat"])) $_POST["tgl_surat"] = $this->factory->Utils->string->dateInt($_POST["tgl_surat"]);
		if (isset($_POST["tgl_berangkat"])) $_POST["tgl_berangkat"] = $this->factory->Utils->string->dateInt($_POST["tgl_berangkat"]);
		if (isset($_POST["tgl_kembali"])) $_POST["tgl_kembali"] = $this->factory->Utils->string->dateInt($_POST["tgl_kembali"]);
		if (isset($_POST["nama_karyawan"])) $_POST["nama_karyawan"]  = "#ignore";
		if (isset($_POST["total_kasbon"])) {
			if ($_POST["total_kasbon"]=="") $_POST["total_kasbon"] = "0";
		}
		return $_POST;
	}
	
}