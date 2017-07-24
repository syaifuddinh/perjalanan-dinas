<?php
class spdstatistik {
	var $factory;
	var $results;
	var $foundrows;
	var $limit;
	var $order;
	var $where;
	var $tb;
	public function __construct() {
		$this->factory = mainFactory::getInstance();
		$this->tb = "spd_pelaksana";
	}
	public function getInfo($tahun="") {
		if ($tahun=="") $tahun =date('Y');
		$res=array();
		$res["tahun"]=$tahun;
		$res["spdaktif"] = $this->factory->DB->getCount($this->tb,"year(tgl_berangkat)='".$tahun."' and status='0'","count(id_pelaksana)");
		$res["spdrampung"] = $this->factory->DB->getCount($this->tb,"year(tgl_berangkat)='".$tahun."' and status='1'","count(id_pelaksana)");
		$res["spdpegawai"] = $this->factory->DB->getCount($this->tb,"year(tgl_berangkat)='".$tahun."'","count(distinct id_karyawan)");
		$res["spdbiaya"] = $this->factory->DB->getCount($this->tb,"year(tgl_berangkat)='".$tahun."'","sum(total_biaya)");
		$this->results=$res;
		return true;
	}
	
}