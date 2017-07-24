<?php
set_time_limit(0);
//set_include_path(get_include_path() . PATH_SEPARATOR . APP_PARTNER.'phpexcel');
include_once 'phpexcel/PHPExcel/IOFactory.php';

class xl {
	var $appExcel;

	/*varible untuk fungsi generatetable*/
	protected $_startCol;
	protected $_startRow;
	protected $_endCol;
	protected $_endRow;
	protected $_listCol;
	protected $_ds;
	protected $_data;
	
	public function __construct() {
		$this->appExcel=new PHPExcel();
		$this->appExcel->getProperties()->setCreator("Talents Mapping")
		->setLastModifiedBy("Talents Mapping")
		->setTitle("sativa reporting")
		->setSubject("PHPExcel Test Document")
		->setDescription("Report generated with phpexcel")
		->setKeywords("office PHPExcel php");
		
	}
	
	public function sendOutput($nf="result-export") {
		header('Content-Type: application/vnd.ms-excel');
		header('Content-Disposition: attachment;filename="'.$nf.'.xls"');
		header('Cache-Control: max-age=0');
		// If you're serving to IE 9, then the following may be needed
		header('Cache-Control: max-age=1');
	
		// If you're serving to IE over SSL, then the following may be needed
		header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
		header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
		header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
		header ('Pragma: public'); // HTTP/1.0*/
		$objWriter = PHPExcel_IOFactory::createWriter($this->appExcel, 'Excel5');
		$objWriter->save('php://output');
	}
	public function writeCell($cell,$value) {
		$this->appExcel->setActiveSheetIndex(0)->setCellValue($cell, $value);
		
		
		return true;
	}
	public function getCol($colsStart="A",$offset=1) {
	
		$maxCol=ord("Z");
		$minCol=ord("A");
		$colsStart=strtoupper($colsStart);
		$col1="0";
	
		if (strlen($colsStart)==2) {
			$col1=ord(substr($colsStart, 0));
			$col2=ord(substr($colsStart, 1));
		} else {
			$col2=ord(substr($colsStart, 0));
		}
	
		$col2=$col2+$offset;
		if ($col2 < $minCol) $col2=$minCol;
		 
		if ($col2>$maxCol) {
			$col2=$minCol+($col2-$maxCol-1);
			if ($col1 !=0) {
				$col1=$col1+1;
			} else {
				$col1=$minCol;
			}
		}
		 
		if ($col1 != 0) {
			return chr($col1).chr($col2);
		} else {
			return chr($col2);
		}
		 
	}
	public function setCellColor($cell,$warna) {
		$this->appExcel->getActiveSheet()->getStyle($cell)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
		$this->appExcel->getActiveSheet()->getStyle($cell)->getFill()->getStartColor()->setARGB($warna);
	}
	public function setAllBorders($cell,$warna="FF000000") {
		$styleArray = array(
				'borders' => array(
						'allborders' => array(
								'style' => PHPExcel_Style_Border::BORDER_THIN,
								'color' => array('argb' => $warna),
						),
				),
		);
		$this->appExcel->getActiveSheet()->getStyle($cell)->applyFromArray($styleArray);
	}
	public function autoFitCol($cols) {
		$col = explode(",", $cols.",");
		for ($i=0;$i<count($col);$i++) {
			if ($col[$i] != "") $this->appExcel->getActiveSheet()->getColumnDimension($col[$i])->setAutoSize(true);
		}
		
	}
	public function alignCenter($cell) {
		$this->appExcel->getActiveSheet()->getStyle($cell)
		->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
	}
	public function alignRight($cell) {
		$this->appExcel->getActiveSheet()->getStyle($cell)
		->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_RIGHT);
	}
	public function setBold($cell) {
		$this->appExcel->getActiveSheet()->getStyle($cell)->getFont()->setBold(true);
	}
	
	public function generateTable($col,$row,$config,$data,$header=TRUE) {
		$this->_startCol=$col;
		$this->_startRow=$row;
		$this->_ds=$config;
		$this->_data=$data;
		$this->_listCol="";
		$this->_endCol=$col;
		$this->_endRow=$row;
	
		$this->printHeader($header);
		$this->printData();
		$res=array("colstart"=>$this->_startCol,"colend"=>$this->_endCol,"rowstart"=>$this->_startRow,"rowend"=>$this->_endRow,"cols"=>$this->_listCol);
		
		return $res;
	}
	public function writeCellPair($col,$row,$caption,$value) {
		$this->writeCell($col.$row, $caption." :");
		$this->writeCell($this->getCol($col).$row, $value);
		$this->alignRight($col.$row);
	}
	public function merge($cell) {
		$this->appExcel->getActiveSheet()->mergeCells($cell);
	}
	public function formatNumber($cell) {
		$this->appExcel->getActiveSheet()->getStyle($cell)->getNumberFormat()->setFormatCode("#,##");
		
	}
	public function setColWidth($col,$width) {
		$this->appExcel->getActiveSheet()->getColumnDimension($col)->setWidth($width);
	}
	public function setRowHeight($row,$height) {
		$this->appExcel->getActiveSheet()->getRowDimension($row)->setRowHeight($height);;
	}
	public function alignMiddle($cell) {
		$this->appExcel->getActiveSheet()->getStyle($cell)
		->getAlignment()->setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
		
	}
	protected function printHeader($header=TRUE) {
		
		$i=0;
		foreach ($this->_ds as $fd)
		{
				
			if ($i > 0) $this->_endCol = $this->getCol($this->_endCol);
			if ($header) $this->writeCell($this->_endCol.$this->_startRow,$fd["text"]);
			if (isset($fd["align"]) && ($fd["align"]=="center") ) $this->alignCenter($this->_endCol.$this->_startRow);
			if (isset($fd["align"]) && ($fd["align"]=="right") ) $this->alignRight($this->_endCol.$this->_startRow);
			$i++;
			$this->_listCol.= $this->_endCol.",";
		}
		return true;
	}
	protected function printData() {
	
		$rs=$this->_startRow;
	
		foreach ($this->_data as $row) {
			$rs++;
			$i=0;
			$this->_endCol=$this->_startCol;
			foreach ($this->_ds as $fd)
			{
				if ($i > 0) $this->_endCol = $this->getCol($this->_endCol);
				$f=strtolower($fd["field"]);
				if ($f !="") {
					
					if ($f=="rownumber") {
						$this->writeCell($this->_endCol.$rs,$rs-$this->_startRow);
						$this->alignCenter($this->_endCol.$rs);
					} else {
						/*todo: baca tipe field, misalnya date/number/etc.*/
						if (!isset($fd["type"])) $fd["type"] = "";
						if (!isset($fd["appendValue"])) $fd["appendValue"] = "";
						if (isset($fd["formulatext"]))  {
							$this->writeCell($this->_endCol.$rs,"=".str_replace("row", $rs, $fd["formulatext"]));
						} else {
							$this->writeCell($this->_endCol.$rs,$this->formatData($row[$f].$fd["appendValue"], $fd["type"]));
						}
						
						if (isset($fd["align"]) && ($fd["align"]=="center") ) $this->alignCenter($this->_endCol.$rs);
						if (isset($fd["align"]) && ($fd["align"]=="right") ) $this->alignRight($this->_endCol.$rs);
						if (isset($fd["type"]) && ($fd["type"]=="number") ) $this->formatNumber($this->_endCol.$rs);
					}
				}
				
				$i++;
			}
		}
	
		$this->_endRow = $rs;
		return true;
	}
	protected function formatData($value,$type) {
		switch ($type) {
			case "text" : return " ".$value;break;
			case "date": return date("d-M-Y",strtotime($value));break;
			default:return $value;
		}
	}
	
	
}