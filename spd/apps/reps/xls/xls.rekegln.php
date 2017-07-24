<?php 
class rekegln  {
	var $mgr;
	var $row=1;
	var $factory;
	var $idk;
	var $keg;
	var $ds=array();
	var $res;
	public function __construct($obj) {
	
		$this->idk=$_GET["idk"];
		$this->factory=mainFactory::getInstance();
		$this->mgr=$obj;
		$this->factory->Utils->load("string");
		
		$this->printTitle();
	
		
		$this->setup();
		$this->mgr->data->where="id_kegiatan=".$this->idk." and jenis_spd ='Luar Negeri'";
		$this->mgr->data->order="tgl_surat,nama_karyawan";
		$this->mgr->data->get();
		$this->res=$this->mgr->xl->generateTable("A",$this->row,$this->ds,$this->mgr->data->results);
		$this->format();
		$this->mgr->xl->sendOutput("rekap_nominatif_spd_luar_negeri");
	}
	protected function printTitle() {
		$this->factory->Models->load("spdkegiatan");
		if (!$this->factory->Models->spdkegiatan->getdetail($this->idk)) die("Data Not Found");
		$this->keg=$this->factory->Models->spdkegiatan->results;
		$this->mgr->xl->writeCell("B".$this->row,"DAFTAR NOMINATIF PERJALANAN DINAS JABATAN LUAR NEGERI ");
		$this->row++;
		
		$this->mgr->xl->writeCell("B".$this->row++,"DALAM RANGKA ".strtoupper($this->keg["nama_kegiatan"]));
		$this->mgr->xl->writeCell("B".$this->row++,"SATKER : ".strtoupper($this->keg["satuan_kerja"]));
		$this->mgr->xl->writeCell("B".$this->row++,"AKUN ".$this->keg["akun_anggaran"]);
	}
	
	protected function setup() {
		$this->ds[]=array("text"=>"No","field"=>"rownumber","align"=>"center");
		$this->ds[]=array("text"=>"Nama Pelaksana","field"=>"nama_karyawan");
		$this->ds[]=array("text"=>"Jabatan","field"=>"jabatan_karyawan");
		$this->ds[]=array("text"=>"NIP Karyawan","field"=>"nip_karyawan","type"=>"text");
		$this->ds[]=array("text"=>"Gol","field"=>"gol_karyawan","align"=>"center");
		$this->ds[]=array("text"=>"Tujuan","field"=>"tempat_tujuan");
		$this->ds[]=array("text"=>"Tgl. Berangkat","field"=>"tgl_berangkat","type"=>"date","align"=>"center");
		$this->ds[]=array("text"=>"Tgl. Kembali","field"=>"tgl_kembali","type"=>"date","align"=>"center");
		$this->ds[]=array("text"=>"Lama","field"=>"durasi","align"=>"center","appendtext"=>"hari");
		
		$this->ds[]=array("text"=>"Biaya SPD","field"=>"total_biaya","type"=>"number","align"=>"right");
	}
	protected function writeSummary($cols,$rowTotal) {
		$c=explode(",", $cols);
		for ($i=0;$i<count($c);$i++) {
			$this->mgr->xl->writeCell($c[$i].$rowTotal,"=SUM(".$c[$i].$this->res["rowstart"].":".$c[$i].$this->res["rowend"].")");
			$this->mgr->xl->formatNumber($c[$i].$rowTotal);
		}
	}
	protected function writePejabat($row) {
		$pejabat1=$this->mgr->pejabat->getPejabat("4");
		$pejabat2=$this->mgr->pejabat->getPejabat("2");

		
		$this->mgr->xl->merge("D".$row.":G".$row);
		$this->mgr->xl->merge("D".($row+1).":G".($row+1));
		$this->mgr->xl->merge("D".($row+2).":G".($row+2));
		$this->mgr->xl->merge("D".($row+3).":G".($row+3));
		$this->mgr->xl->merge("D".($row+8).":G".($row+8));
		$this->mgr->xl->merge("D".($row+9).":G".($row+9));
		
		$this->mgr->xl->writeCell("D".$row,"Jakarta, ".$this->mgr->factory->Utils->string->dateId(Date('Y-m-d')));
		$this->mgr->xl->writeCell("D".($row+1),"Mengetahui/Menyetujui");
		$this->mgr->xl->writeCell("D".($row+2),"Pejabat Pembuat Komitmen Swakelola");
		$this->mgr->xl->writeCell("D".($row+3),"Bagian Kepegawaian dan Umum");
		$this->mgr->xl->writeCell("D".($row+8),$pejabat1["nama"]);
		$this->mgr->xl->writeCell("D".($row+9),"NIP. ".$pejabat1["nip"]);
		
	
		
		
		$this->mgr->xl->writeCell("B".($row+1),"Bendahara Pengeluaran");
		$this->mgr->xl->writeCell("B".($row+2),"Sekretariat Ditjen PP dan PL");
		$this->mgr->xl->writeCell("B".($row+8),$pejabat2["nama"]);
		$this->mgr->xl->writeCell("B".($row+9),"NIP. ".$pejabat2["nip"]);
		
		
	}
	protected function format() {
		$headrow=$this->res["rowstart"];
		$rowTotal=$this->res["rowend"]+1;
		$cells=$this->res["colstart"].$headrow.":".$this->res["colend"].$rowTotal;
		/*summary*/
		$this->writeSummary("J", $rowTotal);
		$this->mgr->xl->writeCell("H".$rowTotal,"JUMLAH");
		$this->mgr->xl->merge("H".$rowTotal.":I".$rowTotal);
		$this->mgr->xl->setBold("H".$rowTotal);
		$this->mgr->xl->alignCenter("H".$rowTotal);
		
		$this->mgr->xl->merge("B1:".$this->res["colend"]."1");
		$this->mgr->xl->merge("B2:".$this->res["colend"]."2");
		$this->mgr->xl->merge("B3:".$this->res["colend"]."3");
		$this->mgr->xl->setBold("B1:B3");
		$this->mgr->xl->autoFitCol("A,".$this->res["cols"]);
		
		$this->mgr->xl->setBold($this->res["colstart"].$headrow.":".$this->res["colend"].$this->res["rowstart"]);
		$this->mgr->xl->setBold($this->res["colstart"].$rowTotal.":".$this->res["colend"].$rowTotal);
		$this->mgr->xl->setCellColor($this->res["colstart"].$headrow.":".$this->res["colend"].$this->res["rowstart"],"FFBDBDBD");
		
		$this->mgr->xl->setAllBorders($cells);
	
	
		
		$this->mgr->xl->alignCenter("B1");
		$this->mgr->xl->alignCenter("B2");
		$this->mgr->xl->alignCenter("B3");
		$this->writePejabat($rowTotal + 3);
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
		$this->mgr->xl->appExcel->getActiveSheet()->getPageSetup()->setRowsToRepeatAtTopByStartAndEnd(5, 5);
		
	}
	
}
?>