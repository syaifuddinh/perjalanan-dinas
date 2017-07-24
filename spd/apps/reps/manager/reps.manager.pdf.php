<?php
require_once(DIR_COMPONENTS.'tcpdf'.DIRECTORY_SEPARATOR.'config'.DIRECTORY_SEPARATOR.'lang'.DIRECTORY_SEPARATOR.'eng.php');
require_once(DIR_COMPONENTS.'tcpdf'.DIRECTORY_SEPARATOR.'tcpdf.php');

class tpdf extends tcpdf{
	public function header() {
	/*	$image_file = DIR_ASSETS.'baktihusada.jpg';
		$this->Image($image_file, 5, 2,20, '', 'JPG', '', 'T', false, 100, '', false, false, 0, false, false, false);
		$this->SetY(8);
		$headerFont="dejavuserif";
		$this->SetFont($headerFont, 'B', 18);
		$this->Cell(0, 15, 'KEMENTERIAN KESEHATAN RI', 0, true, 'C', 0, '', 0, false, 'M', 'M');
		$this->SetFont($headerFont, 'B', 12);
		$this->Cell(0, 10, 'DIREKTORAT JENDERAL', 0, true, 'C', 0, '', 0, false, 'M', 'M');
		$this->Cell(0, 10, 'PENGENDALIAN PENYAKIT DAN PENYEHATAN LINGKUNGAN', 0, true, 'C', 0, '', 0, false, 'M', 'M');
		$this->SetFont($headerFont, '', 8);
		$this->Cell(0, 8, 'Jalan Percetakan Negara No. 29 Jakarta Pusat 10560', 0, true, 'C', 0, '', 0, false, 'M', 'M');
		$this->Cell(0, 8, 'Kotak Pos 223, Telepon (021) 4247608, Faksimile : (021) 4207807', 0, true, 'C', 0, '', 0, false, 'M', 'M');
		$this->SetLineStyle(array('width' => 1, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => 0));
		$this->SetY(33);
		$this->SetX(5);
		$this->Cell(200, 1, '', 'T', 0, 'C');*/
	}
	public function footer() {

	}
}

class pdf {
	var $factory;
	var $repFile;
	var $objrep;
	var $helper;
	var $pdf;
	var $MARGIN_HEADER=5;
	var $MARGIN_TOP=45;
	var $MARGIN_LEFT=5;
	var $MARGIN_RIGHT=5;
	var $MARGIN_BOTTOM=8;
	var $MARGIN_FOOTER=5;
	var $FONT="times";
	var $FONTSIZE="10";
	public function __construct() {

	}

	public  function index() {
		$this->factory=mainFactory::getInstance();

		if (isset($this->factory->pages[5])) {
			$this->repFile=$this->factory->pages[5];
		} else {
			die("invalid report file");
		}
		$this->factory->Utils->load("pdfhelper");
		$this->helper=$this->factory->Utils->pdfhelper;
		$f= $this->factory->Units->unitPath."pdf".DIRECTORY_SEPARATOR."pdf.".$this->repFile.".php";
		if (!file_exists($f)) die("report ".$this->repFile." not found");
		include_once ($f);
		$run = new $this->repFile($this);
	}
	public function createPDF() {
		
		$this->pdf = new tpdf("P", "mm", "A4", true, 'UTF-8', false);

		// set document information
		$this->pdf->SetCreator("shelow18@yahoo.com");
		$this->pdf->SetAuthor('Sativa');

		$this->pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

		//set margins
		$this->pdf->SetMargins($this->MARGIN_LEFT, $this->MARGIN_TOP, $this->MARGIN_RIGHT);
		$this->pdf->SetHeaderMargin($this->MARGIN_HEADER);
		$this->pdf->SetFooterMargin($this->MARGIN_FOOTER);

		//set auto page breaks
		$this->pdf->SetAutoPageBreak(TRUE, $this->MARGIN_BOTTOM);

		//set image scale factor
		$this->pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

		$this->pdf->SetFont($this->FONT, '', $this->FONTSIZE);

		$this->pdf->AddPage();
		$this->helper->pdf=$this->pdf;
		return true;
	}
	public function setSize($size,$ext) {
		if ($size=="") $size=$this->FONTSIZE;
		$this->pdf->SetFont($this->FONT, $ext, $size);
	}
	public function setNormalSize() {
		$this->pdf->SetFont($this->FONT, '', $this->FONTSIZE);
	}
}