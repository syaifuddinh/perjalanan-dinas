<?php
class spdpelaksana {
	var $factory;
	var $results;
	var $foundrows;
	var $limit;
	var $order;
	var $where;
	var $tb;
	public function __construct() {
		$this->factory = mainFactory::getInstance();
		$this->tb="spd_pelaksana";
	}
	public function get() {
		
		if ($this->order=="") $this->order = "id_pelaksana desc";
		//$this->results = $this->factory->DB->readAll ( $this->tb . " inner join spd_karyawan on spd_pelaksana.id_karyawan=spd_karyawan.id_karyawan", "SQL_CALC_FOUND_ROWS spd_pelaksana.*,spd_karyawan.nip_karyawan,spd_karyawan.nama_karyawan", $this->order, $this->where, $this->limit );
		$this->results = $this->factory->DB->readAll ("v_spd", "SQL_CALC_FOUND_ROWS *", $this->order, $this->where, $this->limit );
		$this->foundrows=$this->factory->DB->getFoundRows();
		return true;
	}
	
	public function add($data,$update=FALSE) {
		$data["tgl_update"] = "CURRENT_TIMESTAMP";
		if ($update) return $this->factory->DB->update($this->tb,$data,"id_pelaksana='".$data["id_pelaksana"]."'");
		$data["user_id"] = $this->factory->Utils->session->getSession("ID_USER");
		return $this->factory->DB->insert($this->tb,$data);
	}
	public function del($id) {
		$this->factory->DB->setNonQuery("Delete from spd_pengikut where id_pelaksana='".$id."'");
		return $this->factory->DB->setNonQuery("Delete from ".$this->tb." where id_pelaksana='".$id."'");
	}
	public function getDetail($id) {
		return $this->factory->DB->setQuery("select * from v_spd where id_pelaksana=".$id,false);
		
	}
	
}