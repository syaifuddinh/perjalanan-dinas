<?php
	class session {
		protected $prefixtoreplace=array("STV_","JS5_");
		
		public function __construct() {
			
		}
		
		public function setSession($name,$value) {
			//$name=str_replace("STV_", "JS5_", $name);
			$name=str_replace($this->prefixtoreplace,"",$name);
			$name=SESS_PREFIX.$name;
			$_SESSION[$name] = $value;
		}
		public function getSession($name) {
			$name=str_replace($this->prefixtoreplace,"",$name);
			$name=SESS_PREFIX.$name;
			if (isset($_SESSION[$name])) {
				return $_SESSION[$name];
			} else {
				return "";
			}
		}
		public function clearSession($name) {
			$name=str_replace($this->prefixtoreplace,"",$name);
		
			$name=$name.",";
			$arr=explode(",",$name);
			for ($i=0;$i<count($arr);$i++) {
				$name=$arr[$i];
				if ($name != "") {
					$name=SESS_PREFIX.$name;
					if (isset($_SESSION[$name])) unset($_SESSION[$name]);
				}
			}
			
		}
		
		public function setFlashData($msg,$judul="Informasi",$tipe="info") {
			$this->setSession("ff_flashdata", $msg."|".$judul."|".$tipe);
			
		}
		public function setCookieData($cookiename,$value,$period=3) {
			$name=str_replace($this->prefixtoreplace,"",$cookiename);
			$name=SESS_PREFIX.$name;
			$expire = time() + (60*60*$period) ; //3 jam
			setcookie($name, $value, $expire,'/',$_SERVER['SERVER_NAME']); 
			
		}
		public function getCookieData($name) {
			$name=str_replace($this->prefixtoreplace,"",$name);
			$name=SESS_PREFIX.$name;
			if (isset($_COOKIE[$name])) {
				return $_COOKIE[$name];
			} else {
				return "";
			}
		}
		public function clearCookieData($name) {
			$name=str_replace($this->prefixtoreplace,"",$name);
			$name=$name.",";
			$arr=explode(",",$name);
			for ($i=0;$i<count($arr);$i++) {
				$name=$arr[$i];
				if ($name != "") {
					$name=SESS_PREFIX.$name;
					setcookie($name,"",time()-3600,'/',$_SERVER['SERVER_NAME']);
				}
			}
			
		}
		public function sessionToCookie($name) {
			$name=$name.",";
			$arr=explode(",",$name);
			for ($i=0;$i<count($arr);$i++) {
				$name=$arr[$i];
				if ($name != "") {
					$this->setCookieData($name,$this->getSession($name));
				}
			}
			
		}
		public function cookieToSession($name) {
			$name=$name.",";
			$arr=explode(",",$name);
			for ($i=0;$i<count($arr);$i++) {
				$name=$arr[$i];
				if ($name != "") $this->setSession($name,$this->getCookieData($name));
			}
		}
		public function getFlashData() {
			$msg=$this->getSession("ff_flashdata");
			if ($msg != "") $this->clearSession("ff_flashdata");
			return $msg;
		}
		public function setTempData($data) {
			$this->setSession("ff_tempdata", $data);
			
		}
		public function getTempData() {
			$msg=$this->getSession("ff_tempdata");
			//if ($msg != "") $this->clearSession("ff_tempdata");
			return $msg;
		}
	}
	
?>