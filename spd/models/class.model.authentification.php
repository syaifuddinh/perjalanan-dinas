<?php
	class authentification {
		protected $_loginInfo;
		var $factory;
		var $resLogin;
		var $tb;
		public function __construct() {
	  		$this->factory = mainFactory::getInstance();
	  		$this->tb="stvuser";
		}
		public function identifyUser($loginInfo) {
			$this->_loginInfo=$loginInfo;
			$nip=$this->factory->DB->escape($this->_loginInfo["login_name"]);
			$pass=$this->factory->DB->escape($this->_loginInfo["login_password"]);
			$this->resLogin=$this->factory->DB->setQuery("select * from ".$this->tb."
					where id='".$nip."' and passwd=PASSWORD('".$pass."')",false);
				
			if ($this->resLogin["id"]==$nip) {
				$this->setLoginSession();
				return "1";
			} else {
				return -1;
			}
		}
	
		protected function setLoginSession() {
			$this->factory->Utils->session->setSession("LOGIN","1");
			$this->factory->Utils->session->setSession("LOGIN_TIME",time());
			$this->factory->Utils->session->setSession("ID_USER",$this->resLogin["id"]);
			$this->factory->Utils->session->setSession("REAL_NAME",$this->resLogin["real_name"]);
			$this->factory->Utils->session->setSession("HAK",$this->resLogin["role"]);
			$this->factory->Utils->session->setSession("COOKIE","cook");
			$this->factory->Utils->session->sessionToCookie("LOGIN_TIME,LOGIN,ID_USER,REAL_NAME,HAK,COOKIE");
		}
		public function get() {
			if ($this->order=="") $this->order = "id";
			$this->results=$this->factory->DB->readAll($this->tb,"SQL_CALC_FOUND_ROWS *",$this->order,$this->where,$this->limit);
			$this->foundrows=$this->factory->DB->getFoundRows();
			return true;
		}
		public function add($data,$update=FALSE) {
			if ($update) return $this->factory->DB->update($this->tb,$data,"id='".$data["id"]."'");
			return $this->factory->DB->insert($this->tb,$data);
		}
		public function del($id) {
			return $this->factory->DB->setNonQuery("Delete from ".$this->tb." where id='".$id."'");
		}
	}
?>