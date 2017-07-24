<?php
class validator{
	public function __construct() {
			
	}
	public  function getNumericValue($nil) {
		if (($nil=="") ||($nil=="0")) {
			return "NULL";
		}
		return $nil;
	}
	public function convertNumber($nil,$min=0,$max=NULL) {
		if (is_numeric($nil)) {
			if ($max != NULL) {
				if ($nil>$max) return $min;
			}
			return $nil;
		}
		return $min;
	}
	public function validNumber($data,$min=NULL,$max=NULL) {
		$ct=count($data);
		if ($ct==0) return FALSE;
		
		for ($it=0;$it<$ct;$it++) {
			if ($data[$it]=="") $data[$it] = 0;
			if ($data[$it]=="null") $data[$it] = 0;
			
			if (!is_numeric($data[$it])) return FALSE;
			if (!(($min == NULL) && ($max == NULL))) {
				if (!(($data[$it] >= $min) && ($data[$it] <= $max))) return FALSE;
			}
		}
		return true;
	}
}