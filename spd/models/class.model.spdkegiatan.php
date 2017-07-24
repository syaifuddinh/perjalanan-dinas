<?php
class spdkegiatan {
	var $factory;
	var $results;
	var $foundrows;
	var $limit;
	var $order;
	var $where;
	var $tb;
	public function __construct() {
		$this->factory = mainFactory::getInstance();
		$this->tb="spd_kegiatan";
	}
	public function get() {
		
		if ($this->order=="") $this->order = "id_kegiatan desc";
		$this->results=$this->factory->DB->readAll($this->tb,"SQL_CALC_FOUND_ROWS *",$this->order,$this->where,$this->limit);
		$this->foundrows=$this->factory->DB->getFoundRows();
		return true;
	}
	
	public function add($data,$update=FALSE) {
		if ($update) return $this->factory->DB->update($this->tb,$data,"id_kegiatan='".$data["id_kegiatan"]."'");
		return $this->factory->DB->insert($this->tb,$data);
	}
	public function del($id) {
		//todo : cek surat tugas dan pelaksana spd, jika ada jangan boleh hapus
		if ($this->factory->DB->isRecordExist("spd_pelaksana","id_kegiatan='".$id."'")) return "-1";
		return $this->factory->DB->setNonQuery("Delete from ".$this->tb." where id_kegiatan='".$id."'");
	}
	public function getDetail($idkegiatan) {
		$this->results=$this->factory->DB->setQuery("select * from ".$this->tb." where id_kegiatan='".$this->factory->DB->escape($idkegiatan)."' limit 0,1",false);
		if ($this->results) return true;
		return false;
	}
}