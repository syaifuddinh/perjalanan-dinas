<?php
class string{
	public function __construct() {
		
	}
	public function recordsetToJSArray($data,$key) {
		$res="";
		foreach ($data as $fd) {
			$res .= "'".$fd[$key]."',";
		}
		$res = rtrim($res,",");
		return $res;
	}
	public function monthId($value) {
		$month = array("Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember");
		$value = (int)$value;
		return $month[$value-1];
	}
	
	public function dateId($value, $cut=false) {
		$val = strtotime($value);
		$month = $cut === true ? substr($this->monthId(date('m', $val)), 0, 3) : $this->monthId(date('m', $val));
		return date('d', $val).' '.$month.' '.date('Y', $val);
	}
	public function dateInt($date) {
		return  Date('Y-m-d',strtotime(substr($date, 6)."-".substr($date, 3,2)."-".substr($date, 0,2)));
	}
	
	public function moneyId($val,$spasi=0){
		$sp=" ";
		$u=number_format($val,0,',','.');
		if ($spasi >0) {
			$ct=$spasi-strlen($u);
			for ($ix=0;$ix < $ct;$ix++) {
				$sp .="&nbsp;";
			}
		}
		
		return 'Rp.'.$sp.$u;
	}
	
	public function getValue($object,$key) {
		if (isset($object[$key])) return $object[$key];
		return "";
	}
	public function terbilang($x)
	{
		$abil = array("", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas");
		if ($x < 12)
			return " " . $abil[$x];
		elseif ($x < 20)
		return $this->terbilang($x - 10) . "belas";
		elseif ($x < 100)
		return $this->terbilang($x / 10) . " puluh" . $this->terbilang($x % 10);
		elseif ($x < 200)
		return " seratus" . $this->terbilang($x - 100);
		elseif ($x < 1000)
		return $this->terbilang($x / 100) . " ratus" . $this->terbilang($x % 100);
		elseif ($x < 2000)
		return " seribu" . $this->terbilang($x - 1000);
		elseif ($x < 1000000)
		return $this->terbilang($x / 1000) . " ribu" . $this->terbilang($x % 1000);
		elseif ($x < 1000000000)
		return $this->terbilang($x / 1000000) . " juta" . $this->terbilang($x % 1000000);
	}
}