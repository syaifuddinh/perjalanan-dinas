<?php 
class rekegbiayaa  {
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
		
	}
	protected function printHeader() {
		$this->mgr->xl->writeCell("A".$this->row,"No.");
		$this->mgr->xl->writeCell("B".$this->row,"Nama Pelaksana");
		$this->mgr->xl->writeCell("C".$this->row,"Jabatan");
		$this->mgr->xl->writeCell("D".$this->row,"NIP Karyawan");
		$this->mgr->xl->writeCell("E".$this->row,"Gol.");
		
		
		$r1=$this->row+1;
		$r2=$this->row+2;
		$this->mgr->xl->writeCell("F".$this->row,"Uang Harian");
		$this->mgr->xl->writeCell("F".$r1,"Hr");
		$this->mgr->xl->writeCell("G".$r1,"Per hari");
		$this->mgr->xl->writeCell("H".$r1,"Sub Total");
		$this->mgr->xl->merge("F".$this->row.":"."H".$this->row);
		$this->mgr->xl->merge("F".$r1.":"."F".$r2);
		$this->mgr->xl->merge("G".$r1.":"."G".$r2);
		$this->mgr->xl->merge("H".$r1.":"."H".$r2);
		
		$this->mgr->xl->writeCell("I".$this->row,"Transportasi");
		
		$this->mgr->xl->writeCell("I".$r1,"Tiket");
		$this->mgr->xl->writeCell("I".$r2,"Tiket Pergi");
		$this->mgr->xl->writeCell("J".$r2,"Tiket Pulang");
		$this->mgr->xl->writeCell("K".$r2,"Total Tiket");
		$this->mgr->xl->merge("I".$r1.":"."K".$r1);
		
		
		$this->mgr->xl->writeCell("L".$r1,"Tax");
		$this->mgr->xl->writeCell("L".$r2,"Tax Pergi");
		$this->mgr->xl->writeCell("M".$r2,"Tax Pulang");
		$this->mgr->xl->writeCell("N".$r2,"Airport Tax");
		$this->mgr->xl->merge("L".$r1.":"."N".$r1);
		
		$this->mgr->xl->writeCell("O".$r1,"Transport");
		$this->mgr->xl->writeCell("O".$r2,"Transport Asal");
		$this->mgr->xl->writeCell("P".$r2,"Transport Tujuan");
		$this->mgr->xl->writeCell("Q".$r2,"Riil Transport");
		$this->mgr->xl->merge("O".$r1.":"."Q".$r1);
		
		$this->mgr->xl->writeCell("R".$r1,"Jumlah");
		$this->mgr->xl->merge("I".$this->row.":"."R".$this->row);
		$this->mgr->xl->writeCell("S".$this->row,"Penginapan");
		$this->mgr->xl->writeCell("T".$this->row,"TOTAL");
		
		$this->mgr->xl->merge("A".$this->row.":A".$r2);
		$this->mgr->xl->merge("B".$this->row.":B".$r2);
		$this->mgr->xl->merge("C".$this->row.":C".$r2);
		$this->mgr->xl->merge("D".$this->row.":D".$r2);
		$this->mgr->xl->merge("E".$this->row.":E".$r2);
		$this->mgr->xl->merge("R".$r1.":R".$r2);
		$this->mgr->xl->merge("S".$this->row.":S".$r2);
		$this->mgr->xl->merge("T".$this->row.":T".$r2);
		$this->row=$r2;
	}
	protected function setup() {
		$this->ds[]=array("text"=>"No","field"=>"rownumber","align"=>"center");
		$this->ds[]=array("text"=>"Nama Pelaksana","field"=>"nama_karyawan");
		$this->ds[]=array("text"=>"Jabatan","field"=>"jabatan_karyawan");
		$this->ds[]=array("text"=>"NIP Karyawan","field"=>"nip_karyawan","type"=>"text");
		$this->ds[]=array("text"=>"Gol","field"=>"gol_karyawan","align"=>"center");
		$this->ds[]=array("text"=>"Hr","field"=>"jml_harian","align"=>"center");
		$this->ds[]=array("text"=>"Per Hari","field"=>"harga_harian","type"=>"number","align"=>"right");
		$this->ds[]=array("text"=>"Sub Total","field"=>"total_harian","type"=>"number","align"=>"right");
		$this->ds[]=array("text"=>"Tiket Pergi","field"=>"tiket_pergi","type"=>"number","align"=>"right");
		$this->ds[]=array("text"=>"Tiket Pulang","field"=>"tiket_pulang","type"=>"number","align"=>"right");
		$this->ds[]=array("text"=>"Total Tiket","field"=>"tiket_pulang","type"=>"number","formulatext"=>"Irow+Jrow","align"=>"right");
		$this->ds[]=array("text"=>"Tax Tujuan","field"=>"tax_tujuan","type"=>"number","align"=>"right");
		$this->ds[]=array("text"=>"Tax Asal","field"=>"tax_asal","type"=>"number","align"=>"right");
		$this->ds[]=array("text"=>"Airport Tax","field"=>"formula","type"=>"number","formulatext"=>"Lrow+Mrow","align"=>"right");
		$this->ds[]=array("text"=>"Transport Asal","field"=>"transport_asal","type"=>"number","align"=>"right");
		$this->ds[]=array("text"=>"Transport Tujuan","field"=>"transport_tujuan","type"=>"number","align"=>"right");
		$this->ds[]=array("text"=>"Riil Transport","field"=>"formula","formulatext"=>"Orow+Prow","type"=>"number","align"=>"right");
		$this->ds[]=array("text"=>"Jumlah","field"=>"total_transport","type"=>"number","align"=>"right");
		$this->ds[]=array("text"=>"Penginapan","field"=>"total_inap","type"=>"number","align"=>"right");
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
		
		$this->mgr->xl->merge("H".$row.":J".$row);
		$this->mgr->xl->merge("H".($row+1).":J".($row+1));
		$this->mgr->xl->merge("H".($row+2).":J".($row+2));
		$this->mgr->xl->merge("H".($row+8).":J".($row+8));
		$this->mgr->xl->merge("H".($row+9).":J".($row+9));
		
		$this->mgr->xl->writeCell("H".$row,"Lunas Dibayar,");
		$this->mgr->xl->writeCell("H".($row+1),"Bendahara Pengeluaran");
		$this->mgr->xl->writeCell("H".($row+2),"Sekretariat Ditjen PP dan PL");
		$this->mgr->xl->writeCell("H".($row+8),$pejabat2["nama"]);
		$this->mgr->xl->writeCell("H".($row+9),"NIP. ".$pejabat2["nip"]);
		
		$kota = $this->keg["tempat_kegiatan"].", ".$this->factory->Utils->string->dateId($this->keg["tgl_akhir"],false);
		$this->mgr->xl->merge("R".$row.":T".$row);
		$this->mgr->xl->merge("R".($row+1).":T".($row+1));
		$this->mgr->xl->merge("R".($row+2).":T".($row+2));
		$this->mgr->xl->merge("R".($row+8).":T".($row+8));
		$this->mgr->xl->merge("R".($row+9).":T".($row+9));
		
		$this->mgr->xl->writeCell("R".$row,$kota);
		$this->mgr->xl->writeCell("R".($row+1),"Yang membayarkan");
		$this->mgr->xl->writeCell("R".($row+2),"BPP Bagian Keuangan");
		$this->mgr->xl->writeCell("R".($row+8),$pejabat3["nama"]);
		$this->mgr->xl->writeCell("R".($row+9),"NIP. ".$pejabat3["nip"]);
	}
	protected function format() {
		$headrow=$this->res["rowstart"]-2;
		$rowTotal=$this->res["rowend"]+1;
		$cells=$this->res["colstart"].$headrow.":".$this->res["colend"].$rowTotal;
		/*summary*/
		$this->writeSummary("H,I,J,K,L,M,N,O,P,Q,R,S,T", $rowTotal);
		
		
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
		$this->mgr->xl->alignCenter("F4");
		$this->mgr->xl->alignCenter("I4");
		$this->mgr->xl->alignCenter("I5");
		$this->mgr->xl->alignCenter("L5");
		$this->mgr->xl->alignCenter("O5");
		
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