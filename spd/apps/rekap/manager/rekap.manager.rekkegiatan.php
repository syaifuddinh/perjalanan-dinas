<?php
class rekkegiatan extends rekap {
	var $factory;
	public function __construct() {
		$this->factory=mainFactory::getInstance();
	}
	public function index() {
		$mt= $this->factory->Utils->general->getManagerMethod();
		if ($mt=="") $mt="viewkegiatan";
		
		if (method_exists($this,$mt))  $this->$mt();
	}
	protected function viewkegiatan(){
		/*cek apakah halaman ini dipanggil dari page kegiatan*/
		
		$this->factory->pageTitle="Rekap SPD Per Kegiatan";
		$this->factory->pageDesc="";
		$r = array();
		$r[] = array("label"=>"Rekapitulasi Daftar Peserta SPD","value"=>$this->factory->Utils->general->getReport('xls','rekegpeserta'));
		$r[] = array("label"=>"Rekapitulasi Rincian Biaya SPD Detail","value"=>$this->factory->Utils->general->getReport('xls','rekegbiayaa'));
		$r[] = array("label"=>"Rekapitulasi Rincian Biaya SPD","value"=>$this->factory->Utils->general->getReport('xls','rekegbiayab'));
		$r[] = array("label"=>"Rekapitulasi Tanda Tangan Peserta SPD","value"=>$this->factory->Utils->general->getReport('xls','rekegttd'));
		$r[] = array("label"=>"Rekapitulasi Nominatif SPD Jabatan Luar Negeri","value"=>$this->factory->Utils->general->getReport('xls','rekegln'));
		$this->factory->jenisRekap=$r;
		$this->defaultInterface();		
		
		$this->factory->Units->loadJSVar("rekkegiatan");
		$this->factory->Units->loadUI("rekkegiatan");
		$this->factory->Skins->load("spd",false);
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
	
}