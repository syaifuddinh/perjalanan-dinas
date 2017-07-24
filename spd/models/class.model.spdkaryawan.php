<?php
class spdkaryawan {
	var $factory;
	var $results;
	var $foundrows;
	var $limit;
	var $order;
	var $where;
	var $tb;
	public function __construct() {
		$this->factory = mainFactory::getInstance();
		$this->tb="spd_karyawan";
	}
	public function get($fields="*") {
		if ($this->order=="") $this->order = "id_karyawan desc";
		$this->results=$this->factory->DB->readAll($this->tb,"SQL_CALC_FOUND_ROWS ".$fields,$this->order,$this->where,$this->limit);
		$this->foundrows=$this->factory->DB->getFoundRows();
		return true;
	}
	public function add($data,$update=FALSE) {
		if ($update) return $this->factory->DB->update($this->tb,$data,"id_karyawan='".$data["id_karyawan"]."'");
		return $this->factory->DB->insert($this->tb,$data);
	}
	public function del($id) {
		if ($this->factory->DB->isRecordExist("spd_pelaksana","id_karyawan='".$id."'")) return "-1";
		return $this->factory->DB->setNonQuery("Delete from ".$this->tb." where id_karyawan='".$id."'");
	}
	public function getTingkatBiaya($id) {
		$res=$this->factory->DB->setQuery("SELECT tingkat_biaya,kota_karyawan FROM spd_karyawan s inner join spd_refgol r on s.gol_karyawan=r.gol where id_karyawan='".$id."'",false);
		if ($res) return $res["tingkat_biaya"]."|".$res["kota_karyawan"];
		return "|";
	}
}