<?php
	class general{
	
		public function __construct() {
			
		}
		public function getCurrentURL() {
			 $path = (isset($_SERVER['PATH_INFO'])) ? $_SERVER['PATH_INFO'] : @getenv('PATH_INFO');
			 $path = ltrim($path,"/");
			 $path = rtrim($path,"/");
			 return $path;
		}
		public function getPages() {
			$path = $this->getCurrentURL();
			if ($path == "") $path = DEFAULT_UNIT;
			return explode("/",$path);
		}
		
		public function copyRight() {
			return '&copy; Sativa 2013 | powered by <a href="http://jqwidgets.com" target="_blank">JQWidgets</a>';
		}
		public function getTitle() {
			return APP_NAME." | ".APP_SUBJECT;
		}
		public function redirect($newPage) {
			if ($newPage !== "") {
				$loc=BASEURL.$newPage;
			} else {
				$loc=BASEURL;
			}
		
			header('location: '.$loc);
		}
		public function getHref($pagename) {
			$res="";
			switch ($pagename) {
				case "" : $res= BASEURL;break;
				case "#" : $res="#";break;
				default : $res= BASEURL.$pagename;break;
			}
			return $res;
		}
		public function getService($unitname,$servicename,$urldata="",$extsegment="",$withbase=TRUE) {
			if ($extsegment !="") $extsegment = "/".$extsegment;
			$lk=$unitname."/".$servicename."/".$this->serviceKey()."/".base64_encode($urldata).$extsegment;
			if ($withbase) return $this->getHref($lk);
			return $lk;
		}
		
		public function formatTgl($date,$time="",$format="d-M-Y") {
			if ($date == "")  {
				return "";
			} else {
				return Date($format.$time,strtotime($date));
			}
			
		}
		public function tglIndoToDB($date) {
			return  Date('Y-m-d',strtotime(substr($date, 6)."-".substr($date, 3,2)."-".substr($date, 0,2)));
		}
		public function jsonToArray($res) {
			$res = str_replace('{"rows":[', "", $res);
			$res = str_replace(']}', "", $res);
			return $res;
		}
		public function getPredikat($nilai) {
			$p="";
			if ($nilai >= 91) $p="A - Sangat Baik";
			if (($nilai < 91) && ($nilai >= 76)) $p="B - Baik";
			if (($nilai < 76) && ($nilai >= 61)) $p="C - Cukup";
			if (($nilai < 61) ) $p="D - Kurang";
			return $p;
		}
		public function serviceKey() {
			return md5('services');
		}
		public function getManagerName() {
			$pages=$this->getPages();
			if (isset($pages[2])) return $pages[2];
			return "";
		}
		public function getManagerMethod() {
			$pages=$this->getPages();
			if (isset($pages[3])) return $pages[3];
			return "";
		}
		public function getReport($repType="pdf",$reportName,$param="") {
			if ($param != "") $param .= $param."/";
			return $this->getService("reps","disp/".$repType,"report",$reportName."/".$param);
		}
	}
	
?>