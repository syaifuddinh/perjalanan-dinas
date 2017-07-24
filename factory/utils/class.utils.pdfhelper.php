<?php
class pdfhelper {
	var $pdf;
	public function __construct() {
			
	}
	public function printField($caption,$data,$capwidth="20%",$datawidth="60%") {
		return '<tr>
    	<td width="'.$capwidth.'">'.$caption.'</td>
		<td width="2%">:</td>
        <td width="'.$datawidth.'" align="left">'.$data.'</td>
    </tr>';
	}
	
	public function printTable($judul,$header,$detail) {
		$jumcol=count($header);
		$tbl = '<p><table border="1" cellpadding="3" cellspacing="0"><thead>
			 <tr style="background-color:#ddd">
			  <td colspan="'.$jumcol.'" align="center"><strong>'.$judul.'</strong></td>
			 </tr>
			<tr style="background-color:rgb(199,189,189);">';
		foreach ($header as $head) {
			$tbl .= '<td '.$head["prop"].'><strong>'.$head["label"].'</strong></td>';
		}
		$tbl .= '</tr></thead>';
		$no=0;
		$odd=true;
		foreach ($detail as $field) {
			if ($odd) {
				$c='"background-color:#ddd;"';
				$odd=false;
			} else {
				$c='"background-color:#fff;"';
				$odd=true;
			}
	
			$tbl .= '<tr style='.$c.'>';
			foreach ($header as $head) {
				$tbl .= '<td '.$head["prop"].'>'.$field[$head["field"]].'</td>';
			}
			$tbl .= '</tr>';
		}
		$tbl .= '</table></p>';
		return $tbl;
	}
	public function renderHTML($html) {
		$this->pdf->writeHTMLCell($w=0, $h=0, $x='', $y='', $html, $border=0, $ln=1, $fill=0, $reseth=true, $align='', $autopadding=true);
	}
	
	public function printCell($text="",$align="L",$newline=true,$sp="8",$pos="0") {
		$this->pdf->Cell($pos, $sp, $text, 0, $newline, $align, 0, '', 0, false, 'M', 'M');
	}
	public function printCellPair($textleft,$textright,$x,$jarak="20") {
		
		if ($x != 0) $this->pdf->setX($x);
		$this->printCell($textleft,"L",false,8,$jarak);
		$this->printCell(":","L",false,8,3);
		$this->printCell($textright,"L",true,8);
	}
}