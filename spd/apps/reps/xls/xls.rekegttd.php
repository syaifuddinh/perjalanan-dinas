<?php 
class rekegttd  {
	var $mgr;
	var $row=5;
	var $factory;
	var $idk;
	var $keg;
	var $ds=array();
	var $res;
	var $rowhead;
	var $maxcol;
	public function __construct($obj) {
		if (!isset($_GET["idk"])) die();
		$this->idk=$_GET["idk"];
		$this->factory=mainFactory::getInstance();
		$this->mgr=$obj;
		$this->factory->Utils->load("string");
		$this->factory->Models->load("spdkegiatan");
		if (!$this->factory->Models->spdkegiatan->getdetail($this->idk)) die("Data Not Found");
		$this->keg=$this->factory->Models->spdkegiatan->results;
	
		$this->printHeader();
		
		$this->setup();
		$this->mgr->data->where="id_kegiatan=".$this->idk;
		$this->mgr->data->order="nama_karyawan";
		$this->mgr->data->get();
		$this->res=$this->mgr->xl->generateTable("A",$this->row,$this->ds,$this->mgr->data->results,false);
		$this->format();
		$this->mgr->xl->sendOutput("rekap_nominatif_spd_luar_negeri");
	}
	protected function printTitle() {
		
		$t= strtoupper($this->keg["tempat_kegiatan"].", ".$this->factory->Utils->string->dateId($this->keg["tgl_mulai"],false)." s/d ".$this->factory->Utils->string->dateId($this->keg["tgl_akhir"],false));
		$this->mgr->xl->writeCell("B1","REKAPITULASI BIAYA PERJALANAN DINAS ");
		
		$this->mgr->xl->writeCell("B2","DALAM RANGKA ".strtoupper($this->keg["nama_kegiatan"]));
		$this->mgr->xl->writeCell("B3",$t);
		
	}
	protected function printHeader() {
		$r=$this->row+1;
		$this->mgr->xl->writeCell("A".$r,"NO");
		$this->mgr->xl->writeCell("B".$r,"NAMA");
		$this->mgr->xl->writeCell("C".$r,"JABATAN/SATKER");
		$this->mgr->xl->writeCell("D".$this->row,"TANDA TANGAN");
		
		$d=strtotime($this->keg["tgl_akhir"]) - strtotime($this->keg["tgl_mulai"]);
		$d=floor($d/(60*60*24))+1;
		$c="C";
		
		$mulai = strtotime($this->keg["tgl_mulai"]);
		for ($i=0;$i<$d;$i++) {
			$c=$this->mgr->xl->getCol($c);
			$tglabsen=date('Y-m-d',strtotime("+".$i." days", $mulai));
			$tglabsen=$this->mgr->factory->Utils->string->dateId($tglabsen);
			$this->mgr->xl->writeCell($c.$r,$tglabsen);
			$this->mgr->xl->setColWidth($c,"25");
			$this->mgr->xl->alignCenter($c.$r);
		}
		
		$this->mgr->xl->merge("D".$this->row.":".$c.$this->row);
		
		$this->mgr->xl->alignCenter("D".$this->row);
		$this->maxcol=$c;
		$this->rowhead=$this->row;
		$this->mgr->xl->setBold("A".$this->rowhead.":".$this->maxcol.$r);
		$this->row=$r;
	}
	protected function setup() {
		$this->ds[]=array("text"=>"No","field"=>"rownumber","align"=>"center");
		$this->ds[]=array("text"=>"NAMA","field"=>"nama_karyawan");
		$this->ds[]=array("text"=>"SATKER","field"=>"jabatan_karyawan");
		
	}
	protected function writeSummary($cols,$rowTotal) {
		$c=explode(",", $cols);
		for ($i=0;$i<count($c);$i++) {
			$this->mgr->xl->writeCell($c[$i].$rowTotal,"=SUM(".$c[$i].$this->res["rowstart"].":".$c[$i].$this->res["rowend"].")");
			$this->mgr->xl->formatNumber($c[$i].$rowTotal);
		}
	}
	
	protected function format() {
		
		
		$cells=$this->res["colstart"].$this->rowhead.":".$this->maxcol.$this->res["rowend"];
	
		
		
		$this->mgr->xl->autoFitCol("B");
		$this->mgr->xl->autoFitCol("C");
		$this->mgr->xl->autoFitCol("A");
		$this->mgr->xl->setCellColor("A".$this->rowhead.":".$this->maxcol.$this->res["rowstart"],"FFBDBDBD");
		
		$this->mgr->xl->setAllBorders($cells);
		/*row height tanda tangan*/
		$maxrow=$this->res["rowend"]+1;
		for ($i=$this->res["rowstart"];$i<$maxrow;$i++) {
			$this->mgr->xl->setRowHeight($i,"45");
		}	
		/*Title*/
		$this->mgr->xl->merge("B1:".$this->maxcol."1");
		$this->mgr->xl->merge("B2:".$this->maxcol."2");
		$this->mgr->xl->merge("B3:".$this->maxcol."3");
		$this->printTitle();
		$this->mgr->xl->setBold("B1:B3");
		$this->mgr->xl->alignCenter("B1:B3");
		
		
		$this->mgr->xl->alignMiddle($cells);
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
		$this->mgr->xl->appExcel->getActiveSheet()->getPageSetup()->setRowsToRepeatAtTopByStartAndEnd(5, 6);
		
	}
	
}
?>