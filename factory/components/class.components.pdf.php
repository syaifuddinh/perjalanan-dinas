<?php
require_once('tcpdf/config/lang/eng.php');
require_once('tcpdf/tcpdf.php');

class pdf extends TCPDF {
	var $factory;
	
	//Page header
	public function Header() {
		// Logo
		/*$image_file = K_PATH_IMAGES.'ipc.png';
		$this->Image($image_file, 10, 10, 30, '', 'PNG', '', 'T', false, 100, '', false, false, 0, false, false, false);
		// Set font
		$this->SetFont('helvetica', 'B', 15);
		// Title
		$this->SetX(45);
		$this->Cell(0, 15, 'PT. PELABUHAN INDONESIA II (PERSERO)', 0, true, 'L', 0, '', 0, false, 'M', 'M');
		$this->SetX(45);
		$this->Cell(0, 15, 'CURRICULUM VITAE', 0, false, 'L', 0, '', 0, false, 'M', 'M');
		$this->SetLineStyle(array('width' => 1, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => 0));
		$this->SetY(23);
		$this->SetX(5);
		$this->Cell(200, 1, '', 'T', 0, 'C');*/
	}

	// Page footer
	public function Footer() {
		// Position at 15 mm from bottom
		//$this->SetY(-15);
		// Set font
		//$this->SetFont('helvetica', 'I', 8);
		// Page number
		//$this->Cell(0, 10, 'Page '.$this->getAliasNumPage().'/'.$this->getAliasNbPages(), 0, false, 'C', 0, '', 0, false, 'T', 'M');
	}
	
	public function newPDF($fontsize="9") {
		$this->factory=mainFactory::getInstance();
		$this->factory->Utils->load("pdfhelper");
		$pdf = new pdf("P", "mm", "A4", true, 'UTF-8', false);
		
		// set document information
		$pdf->SetCreator("shelow18@yahoo.com");
		$pdf->SetAuthor('Sativa');
		
		$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
		
		//set margins
		$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
		$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
		$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);
		
		//set auto page breaks
		$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);
		
		//set image scale factor
		$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
		
		$pdf->SetFont('helvetica', '', $fontsize);
		
		$pdf->AddPage();
		return $pdf;
	}
	
	
}
?>