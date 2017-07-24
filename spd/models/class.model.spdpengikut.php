<?php
class spdpengikut {
	var $factory;
	var $results;
	var $foundrows;
	var $limit;
	var $order;
	var $where;
	var $tb;
	public function __construct() {
		$this->factory = mainFactory::getInstance();
		$this->tb="spd_pengikut";
	}
	public function get($fields="*") {
		if ($this->order=="") $this->order = "id_pengikut desc";
		$this->results=$this->factory->DB->readAll($this->tb,"SQL_CALC_FOUND_ROWS ".$fields,$this->order,$this->where,$this->limit);
		$this->foundrows=$this->factory->DB->getFoundRows();
		return true;
	}
	public function add($data,$update=FALSE) {
		if ($update) return $this->factory->DB->update($this->tb,$data,"id_pengikut=".$data["id_pengikut"]." and id_pelaksana=".$data["id_pelaksana"]);
		return $this->factory->DB->insert($this->tb,$data);
	}
	public function del($id) {
		return $this->factory->DB->setNonQuery("Delete from ".$this->tb." where id_pengikut=".$id["id_pengikut"]." and id_pelaksana=".$id["id_pelaksana"]);
	}
	public function getDetail($idpelaksana) {
		return $this->factory->DB->setQuery("select * from ".$this->tb." where id_pelaksana =".$idpelaksana);
	}
}