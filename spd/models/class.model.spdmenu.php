<?php
class spdmenu {
	var $factory;
	public function __construct() {
		$this->factory = mainFactory::getInstance ();
	}
	public function getMenu($hak = "") {
		$data = array ();
		$data [0] [] = array (
				"id" => "1",
				"cmd" => "front/disp/home",
				"icone" => "home",
				"nama" => "Home" 
		);
		$data [0] [] = array (
				"id" => "2",
				"cmd" => "front/disp/spdlist",
				"icone" => "credit-card",
				"nama" => "Daftar SPD" 
		);
		$data [0] [] = array (
				"id" => "5",
				"cmd" => "rekap/disp/rekkegiatan",
				"icone" => "external-link",
				"nama" => "Rekap"
		);
		if ($this->factory->Utils->session->getSession("HAK")== "admin") {
			$data [0] [] = array (
					"id" => "3",
					"cmd" => "#",
					"icone" => "keyboard",
					"nama" => "Input Data" 
			);
			
			$data [0] [] = array (
					"id" => "4",
					"cmd" => "#",
					"icone" => "wrench",
					"nama" => "Referensi" 
			);
			
			$data [3] [] = array (
					"id" => "30",
					"cmd" => "ent/disp/kegiatan",
					"icone" => "calendar",
					"nama" => "Kegiatan" 
			);
			$data [3] [] = array (
					"id" => "31",
					"cmd" => "ent/disp/tugas",
					"icone" => "ok",
					"nama" => "Surat Tugas" 
			);
			
			$data [4] [] = array (
					"id" => "40",
					"cmd" => "ref/disp/biaya",
					"icone" => "ok",
					"nama" => "Tingkat Biaya" 
			);
			$data [4] [] = array (
					"id" => "41",
					"cmd" => "ref/disp/gol",
					"icone" => "ok",
					"nama" => "Golongan" 
			);
			$data [4] [] = array (
					"id" => "42",
					"cmd" => "ref/disp/pejabat",
					"icone" => "ok",
					"nama" => "Pejabat" 
			);
			$data [4] [] = array (
					"id" => "43",
					"cmd" => "ref/disp/karyawan",
					"icone" => "ok",
					"nama" => "Karyawan" 
			);
			$data [4] [] = array (
					"id" => "44",
					"cmd" => "ref/disp/user",
					"icone" => "key",
					"nama" => "User Aplikasi" 
			);
		}
		return $data;
	}
}