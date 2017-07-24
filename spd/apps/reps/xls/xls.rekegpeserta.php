<?php 
class rekegpeserta  {
	var $mgr;
	var $row=1;
	var $factory;
	var $idk;
	var $keg;
	var $ds=array();
	var $res;
	public function __construct($obj) {
		if (!isset($_GET["idk"])) die();
		$this->idk=$_GET["idk"];
		$this->factory=mainFactory::getInstance();
		$this->mgr=$obj;
		$this->factory->Utils->load("string");
		
		$this->printTitle();
		$this->setup();
		$this->mgr->data->where="id_kegiatan=".$this->idk;
		$this->mgr->data->order="tgl_surat,nama_karyawan";
		$this->mgr->data->get();
		$this->res=$this->mgr->xl->generateTable("A",$this->row,$this->ds,$this->mgr->data->results);
		$this->format();
		$this->mgr->xl->sendOutput("rekap_peserta_spd");
	}
	protected function printTitle() {
		$this->factory->Models->load("spdkegiatan");
		if (!$this->factory->Models->spdkegiatan->getdetail($this->idk)) die("Data Not Found");
		$this->keg=$this->factory->Models->spdkegiatan->results;
		$this->mgr->xl->writeCell("B".$this->row,"DAFTAR PESERTA ".$this->keg["nama_kegiatan"]);
		$this->row++;
		$this->mgr->xl->writeCellPair("B",$this->row++,"No. Kegiatan",$this->keg["no_kegiatan"]);
		$this->mgr->xl->writeCellPair("B",$this->row++,"Tanggal",$this->factory->Utils->string->dateId($this->keg["tgl_mulai"],false)." s/d ".$this->factory->Utils->string->dateId($this->keg["tgl_akhir"],false));
		$this->mgr->xl->writeCellPair("B",$this->row++,"Tempat",$this->keg["tempat_kegiatan"]);
		$this->mgr->xl->writeCellPair("B",$this->row++,"Satuan Kerja",$this->keg["satuan_kerja"]);
		$this->mgr->xl->writeCellPair("B",$this->row++,"Kementerian Negara","Kementerian Kesehatan");
	
	}
	protected function setup() {
		$this->ds[]=array("text"=>"No","field"=>"rownumber","align"=>"center");
		$this->ds[]=array("text"=>"Nama Pelaksana","field"=>"nama_karyawan");
		$this->ds[]=array("text"=>"Jabatan","field"=>"jabatan_karyawan");
		$this->ds[]=array("text"=>"NIP Karyawan","field"=>"nip_karyawan","type"=>"text");
		$this->ds[]=array("text"=>"Gol","field"=>"gol_karyawan","align"=>"center");
		$this->ds[]=array("text"=>"Dari","field"=>"tempat_asal");
		$this->ds[]=array("text"=>"Ke","field"=>"tempat_tujuan");
		$this->ds[]=array("text"=>"Tingkat Biaya","field"=>"tingkat_biaya","align"=>"center");
		$this->ds[]=array("text"=>"Angkutan","field"=>"alat_angkut");
		$this->ds[]=array("text"=>"No. Surat Tugas","field"=>"no_surat");
		$this->ds[]=array("text"=>"Tgl Surat","field"=>"tgl_surat","type"=>"date","align"=>"center");
		$this->ds[]=array("text"=>"Tgl Berangkat","field"=>"tgl_berangkat","type"=>"date","align"=>"center");
		$this->ds[]=array("text"=>"Tgl Kembali","field"=>"tgl_kembali","type"=>"date");
		$this->ds[]=array("text"=>"Durasi","field"=>"durasi","appendValue"=>" hari","align"=>"center");
		$this->ds[]=array("text"=>"Keterangan","field"=>"");
	}
	protected function format() {
		$cells=$this->res["colstart"].$this->res["rowstart"].":".$this->res["colend"].$this->res["rowend"];
		$this->mgr->xl->merge("B1:".$this->res["colend"]."1");
		$this->mgr->xl->setBold("B1");
		$this->mgr->xl->autoFitCol($this->res["cols"]);
		
		$this->mgr->xl->setBold($this->res["colstart"].$this->res["rowstart"].":".$this->res["colend"].$this->res["rowstart"]);
		$this->mgr->xl->setCellColor($this->res["colstart"].$this->res["rowstart"].":".$this->res["colend"].$this->res["rowstart"],"FFBDBDBD");
	
		$this->mgr->xl->setAllBorders($cells);
		/*printing options*/
		$this->mgr->xl->appExcel->getActiveSheet()->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
		$this->mgr->xl->appExcel->getActiveSheet()->getPageSetup()->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);
		$this->mgr->xl->appExcel->getActiveSheet()->getPageSetup()->setFitToWidth(1);
		$this->mgr->xl->appExcel->getActiveSheet()->getPageSetup()->setFitToHeight(0);
		$this->mgr->xl->appExcel->getActiveSheet()->getPageMargins()->setTop(0.3);
		$this->mgr->xl->appExcel->getActiveSheet()->getPageMargins()->setRight(0.3);
		$this->mgr->xl->appExcel->getActiveSheet()->getPageMargins()->setLeft(0.3);
		$this->mgr->xl->appExcel->getActiveSheet()->getPageMargins()->setBottom(0.3);
		$this->mgr->xl->appExcel->getActiveSheet()->getPageMargins()->setHeader(0);
		$this->mgr->xl->appExcel->getActiveSheet()->getPageMargins()->setFooter(0);
		$this->mgr->xl->appExcel->getActiveSheet()->getPageSetup()->setRowsToRepeatAtTopByStartAndEnd(7, 7);
		
	}
}
?>