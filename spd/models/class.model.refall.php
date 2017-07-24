<?php
class refall {
	var $factory;
	var $results;
	var $foundrows;
	var $limit;
	var $order;
	var $where;

	public function __construct() {
		$this->factory = mainFactory::getInstance();
		
	}
	public function getRefBiaya($fields="*") {
		$this->results=$this->factory->DB->readAll("spd_refbiaya","SQL_CALC_FOUND_ROWS ".$fields,$this->order,$this->where,$this->limit);
		$this->foundrows=$this->factory->DB->getFoundRows();
		return true;
	}
	public function getRefBiayaFromTingkat($tingkat) {
		$res = $this->factory->DB->setQuery("select u_harian,u_inap from spd_refbiaya where tingkat_biaya='".$tingkat."'",false);
		if ($res["u_harian"]=="") $res["u_harian"]="0";
		if ($res["u_inap"]=="") $res["u_inap"]="0";
		return $res;
	}
	public function addTingkatBiaya($data,$update=FALSE) {
		if ($update) return $this->factory->DB->update("spd_refbiaya",$data,"tingkat_biaya='".$data["tingkat_biaya"]."'");
		return $this->factory->DB->insert("spd_refbiaya",$data);
	}
	public function delTingkatBiaya($id) {
		return $this->factory->DB->setNonQuery("Delete from spd_refbiaya where tingkat_biaya='".$id."'");
	}
	public function getRefGol() {
		$this->results=$this->factory->DB->readAll("spd_refgol","SQL_CALC_FOUND_ROWS *",$this->order,$this->where,$this->limit);
		$this->foundrows=$this->factory->DB->getFoundRows();
		return true;
	}
	public function addRefGol($data,$update=FALSE) {
		if ($update) return $this->factory->DB->update("spd_refgol",$data,"gol='".$data["gol"]."'");
		return $this->factory->DB->insert("spd_refgol",$data);
	}
	public function delRefGol($id) {
		return $this->factory->DB->setNonQuery("Delete from spd_refgol where gol='".$id."'");
	}
	public function getRefPejabat() {
		$this->results=$this->factory->DB->readAll("spd_refpejabat","SQL_CALC_FOUND_ROWS *",$this->order,$this->where,$this->limit);
		$this->foundrows=$this->factory->DB->getFoundRows();
		return true;
	}
	public function addRefPejabat($data,$update=FALSE) {
		if ($update) return $this->factory->DB->update("spd_refpejabat",$data,"id='".$data["id"]."'");
		return $this->factory->DB->insert("spd_refpejabat",$data);
	}
	public function getPejabat($id) {
		return $this->factory->DB->setQuery("select * from spd_refpejabat where id=".$id,false);
	}
	public function getNamaGol($gol) {
		$t=$this->factory->DB->setQuery("select nama_gol from spd_refgol where gol='".$gol."'",false);
		if ($t) return $t["nama_gol"];
		return "";
	}
	
}