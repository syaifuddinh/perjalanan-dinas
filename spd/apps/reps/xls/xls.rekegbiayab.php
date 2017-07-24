<?php 
class rekegbiayab  {
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
		$this->printHeader();
		
		$this->setup();
		$this->mgr->data->where="id_kegiatan=".$this->idk;
		$this->mgr->data->order="tgl_surat,nama_karyawan";
		$this->mgr->data->get();
		$this->res=$this->mgr->xl->generateTable("A",$this->row,$this->ds,$this->mgr->data->results,$header=false);
		$this->format();
		$this->mgr->xl->sendOutput("rekap_biaya_spd");
	}
	protected function printTitle() {
		$this->factory->Models->load("spdkegiatan");
		if (!$this->factory->Models->spdkegiatan->getdetail($this->idk)) die("Data Not Found");
		$this->keg=$this->factory->Models->spdkegiatan->results;
		$this->mgr->xl->writeCell("B".$this->row,"REKAPITULASI BIAYA PERJALANAN DINAS ");
		$this->row++;
		$t= strtoupper($this->keg["tempat_kegiatan"].", ".$this->factory->Utils->string->dateId($this->keg["tgl_mulai"],false)." s/d ".$this->factory->Utils->string->dateId($this->keg["tgl_akhir"],false));
		$this->mgr->xl->writeCell("B".$this->row++,$this->keg["nama_kegiatan"]);
		$this->mgr->xl->writeCell("B".$this->row++,$t);
		$this->mgr->xl->writeCell("B".$this->row++,"Akun ".$this->keg["akun_anggaran"]);
	}
	protected function printHeader() {
		$this->mgr->xl->writeCell("A".$this->row,"No.");
		$this->mgr->xl->writeCell("B".$this->row,"Nama Pelaksana");
		$this->mgr->xl->writeCell("C".$this->row,"Jabatan");
		$this->mgr->xl->writeCell("D".$this->row,"NIP Karyawan");
		$this->mgr->xl->writeCell("E".$this->row,"Gol.");
		
		
		$r1=$this->row+1;
	
		$this->mgr->xl->writeCell("F".$this->row,"Uang Harian");
		
		$this->mgr->xl->writeCell("F".$r1,"Hr");
		$this->mgr->xl->writeCell("G".$r1,"Per hari");
		$this->mgr->xl->writeCell("H".$r1,"Jumlah");
		$this->mgr->xl->merge("F".$this->row.":"."H".$this->row);
		
		$this->mgr->xl->writeCell("I".$this->row,"Uang Penginapan");
		$this->mgr->xl->writeCell("I".$r1,"Hr");
		$this->mgr->xl->writeCell("J".$r1,"Per hari");
		$this->mgr->xl->writeCell("K".$r1,"Jumlah");
		$this->mgr->xl->merge("I".$this->row.":"."K".$this->row);
		
		$this->mgr->xl->writeCell("L".$this->row,"Transport");
		$this->mgr->xl->merge("L".$this->row.":"."L".$r1);
		
		$this->mgr->xl->writeCell("M".$this->row,"TOTAL");
		$this->mgr->xl->merge("M".$this->row.":M".$r1);
		
		//$this->mgr->xl->merge("A".$this->row.":A".$r1);
		$this->mgr->xl->merge("B".$this->row.":B".$r1);
		$this->mgr->xl->merge("C".$this->row.":C".$r1);
		$this->mgr->xl->merge("D".$this->row.":D".$r1);
		$this->mgr->xl->merge("E".$this->row.":E".$r1);
		
		$this->row=$r1;
	}
	protected function setup() {
		$this->ds[]=array("text"=>"No","field"=>"rownumber","align"=>"center");
		$this->ds[]=array("text"=>"Nama Pelaksana","field"=>"nama_karyawan");
		$this->ds[]=array("text"=>"Jabatan","field"=>"jabatan_karyawan");
		$this->ds[]=array("text"=>"NIP Karyawan","field"=>"nip_karyawan","type"=>"text");
		$this->ds[]=array("text"=>"Gol","field"=>"gol_karyawan","align"=>"center");
		
		$this->ds[]=array("text"=>"Hr","field"=>"jml_harian","align"=>"center");
		$this->ds[]=array("text"=>"Per Hari","field"=>"harga_harian","type"=>"number","align"=>"right");
		$this->ds[]=array("text"=>"jumlah","field"=>"total_harian","type"=>"number","align"=>"right");
		
		$this->ds[]=array("text"=>"Hr","field"=>"jml_inap","align"=>"center");
		$this->ds[]=array("text"=>"Per Hari","field"=>"harga_inap","type"=>"number","align"=>"right");
		$this->ds[]=array("text"=>"Sub Total","field"=>"total_inap","type"=>"number","align"=>"right");
		
		$this->ds[]=array("text"=>"Transport","field"=>"total_transport","type"=>"number","align"=>"right");
		$this->ds[]=array("text"=>"Total","field"=>"total_biaya","type"=>"number","align"=>"right");
	}
	protected function writeSummary($cols,$rowTotal) {
		$c=explode(",", $cols);
		for ($i=0;$i<count($c);$i++) {
			$this->mgr->xl->writeCell($c[$i].$rowTotal,"=SUM(".$c[$i].$this->res["rowstart"].":".$c[$i].$this->res["rowend"].")");
			$this->mgr->xl->formatNumber($c[$i].$rowTotal);
		}
	}
	protected function writePejabat($row) {
		$pejabat1=$this->mgr->pejabat->getPejabat("1");
		$pejabat2=$this->mgr->pejabat->getPejabat("2");
		$pejabat3=$this->mgr->pejabat->getPejabat("3");
		
		$this->mgr->xl->writeCell("B".$row,"Mengetahui :");
		$this->mgr->xl->writeCell("B".($row+1),"A/n. Kuasa Pengguna Anggaran/Pengguna Barang");
		$this->mgr->xl->writeCell("B".($row+2),"Sekretariat Ditjen PP dan PL");
		$this->mgr->xl->writeCell("B".($row+3),"Pejabat Pembuat Komitmen Bagian Keuangan,");
		$this->mgr->xl->writeCell("B".($row+8),$pejabat1["nama"]);
		$this->mgr->xl->writeCell("B".($row+9),"NIP. ".$pejabat1["nip"]);
		
	
		
		$this->mgr->xl->writeCell("C".$row,"Lunas Dibayar,");
		$this->mgr->xl->writeCell("C".($row+1),"Bendahara Pengeluaran");
		$this->mgr->xl->writeCell("C".($row+2),"Sekretariat Ditjen PP dan PL");
		$this->mgr->xl->writeCell("C".($row+8),$pejabat2["nama"]);
		$this->mgr->xl->writeCell("C".($row+9),"NIP. ".$pejabat2["nip"]);
		
		
		$this->mgr->xl->merge("D".$row.":G".$row);
		$this->mgr->xl->merge("D".($row+1).":G".($row+1));
		$this->mgr->xl->merge("D".($row+2).":G".($row+2));
		$this->mgr->xl->merge("D".($row+8).":G".($row+8));
		$this->mgr->xl->merge("D".($row+9).":G".($row+9));
		
		
		$this->mgr->xl->writeCell("D".($row+1),"Yang membayarkan");
		$this->mgr->xl->writeCell("D".($row+2),"BPP Bagian Keuangan");
		$this->mgr->xl->writeCell("D".($row+8),$pejabat3["nama"]);
		$this->mgr->xl->writeCell("D".($row+9),"NIP. ".$pejabat3["nip"]);
	}
	protected function format() {
		$headrow=$this->res["rowstart"]-1;
		$rowTotal=$this->res["rowend"]+1;
		$cells=$this->res["colstart"].$headrow.":".$this->res["colend"].$rowTotal;
		/*summary*/
		$this->writeSummary("G,H,J,K,L,M", $rowTotal);
		
		
		$this->mgr->xl->merge("B1:".$this->res["colend"]."1");
		$this->mgr->xl->merge("B2:".$this->res["colend"]."2");
		$this->mgr->xl->merge("B3:".$this->res["colend"]."3");
		$this->mgr->xl->setBold("B1:B3");
		$this->mgr->xl->autoFitCol("A,".$this->res["cols"]);
		
		$this->mgr->xl->setBold($this->res["colstart"].$headrow.":".$this->res["colend"].$this->res["rowstart"]);
		$this->mgr->xl->setBold($this->res["colstart"].$rowTotal.":".$this->res["colend"].$rowTotal);
		$this->mgr->xl->setCellColor($this->res["colstart"].$headrow.":".$this->res["colend"].$this->res["rowstart"],"FFBDBDBD");
		
		$this->mgr->xl->setAllBorders($cells);
		/*Header alignment*/
		$this->mgr->xl->alignCenter("F5");
		$this->mgr->xl->alignCenter("I5");
	
		
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
		$this->mgr->xl->appExcel->getActiveSheet()->getPageSetup()->setRowsToRepeatAtTopByStartAndEnd(4, 6);
		
	}
	
}
?>