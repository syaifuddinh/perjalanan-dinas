<?php
	class director {
	public function disp($dispname="") {
			if ($dispname=="") {
				$dispname=$this->factory->Utils->general->getManagerName();
			
			}
			if ($dispname=="") die("manager empty");
			$this->factory->mgrname=$dispname;
			$this->factory->Units->loadManager($this->factory->mgrname,"indexmanager");
		
		}
	public function indexmanager() {
			$mt= $this->factory->Utils->general->getManagerMethod();
			
			if ($mt=="") $mt="run";
			if (!method_exists($this,$mt)) die("method ".$mt." of manager ".$this->factory->mgrname." does'nt exist");
			$this->$mt();
	}
	protected function tesme() {
		return "i'am director base";
	}
		
	}
?>