<?php
class dbsFactory extends mainFactory{
	var $factory;
	public function __construct(){
		$this->factory=mainFactory::getInstance();
	}
	public function create($dbaname) {
		$this->loadMultiClass(DIR_DBA,"class.dba.",$dbaname);
		return clone $this->factory->Dba->$dbaname;
	}
	

}
?>