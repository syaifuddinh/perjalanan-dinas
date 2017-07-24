<?php
class surattugas  {
	var $mgr;
	var $mypdf;
	var $info;
	var $pejabat;
	var $pengikut;
	var $pangkat;
	public function __construct($obj) {
		if (!isset($_GET["p"])) die();
		
		$this->mgr=$obj;
		$this->prepareData();
		
		$this->mgr->createPDF();
		$this->printHeader();
		$this->printDetail();
		$this->printFooter();
		//$this->mgr->helper->renderHTML($html);
		$this->mgr->pdf->Output('surat_tugas.pdf', 'I');
				
	}
	protected function prepareData() {
		$this->mgr->factory->Models->load("spdpelaksana,refall,spdpengikut");
		$this->mgr->factory->Utils->load("string");
		
		$this->info=$this->mgr->factory->Models->spdpelaksana->getDetail($_GET["p"]);
		if ($this->info["id_pelaksana"]=="") die();
		$this->pejabat=$this->mgr->factory->Models->refall->getPejabat("1");
		$this->pengikut=$this->mgr->factory->Models->spdpengikut->getDetail($_GET["p"]);
		$this->pangkat=$this->mgr->factory->Models->refall->getNamaGol($this->info["gol_karyawan"]);
	}
	protected function printHeader() {
		$this->mgr->helper->printCell("Peraturan Menteri Keuangan Nomor 113/PMK.05/2012","R");
		$this->mgr->helper->printCell("Tanggal 3 Juli 2012","R");
		$this->mgr->pdf->ln(5);
		
		$this->mgr->helper->printCellPair("Lembar ke","1",135);
		$this->mgr->helper->printCellPair("Kode No.",$this->info["no_kegiatan"],135);
		$this->mgr->helper->printCellPair("Nomor",$this->info["no_surat"],135);
		$this->mgr->helper->printCell();
		$this->mgr->setSize(15,"B");
		$this->mgr->helper->printCell("Surat Perjalanan Dinas ( SPD )","C");
		$this->mgr->pdf->ln(3);
		$this->mgr->setNormalSize();
	}
	protected function printDetail() {
	
		$w2="35%";
		$w3="65%";
		$spasi= "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		$html = '<p><table border="1" cellpadding="3" cellspacing="0">
			 <tr>
				<td width="'.$w2.'">1. Pejabat Pembuat Komitmen</td>
				<td width="'.$w3.'">Sekretariat PT. Maju Lancar</td>
			 </tr>
			 <tr>
				<td width="'.$w2.'">2. Nama Pegawai yang diperintahkan/NIP</td>
				<td width="'.$w3.'">'.$this->info["nama_karyawan"].' / '.$this->info["nip_karyawan"].'</td>
			 </tr>
			 <tr >
				<td width="'.$w2.'">3.&nbsp;&nbsp;&nbsp;a. Pangkat dan Golongan ruang gaji'.$spasi.'b. Jabatan / instansi'.$spasi.'c. Tingkat Biaya Perjalanan Dinas</td>
				<td width="'.$w3.'">a. '.$this->pangkat.' Gol '.$this->info["gol_karyawan"].'<br/>b. '.$this->info["jabatan_karyawan"].'<br/>c. '.$this->info["tingkat_biaya"].'</td>
			 </tr>		
			
			<tr >
				<td width="'.$w2.'">4. Maksud Perjalanan Dinas</td>
				<td width="'.$w3.'">'.$this->info["agenda"].'</td>
			 </tr>	
			<tr >
				<td width="'.$w2.'">5. Alat angkut yang digunakan</td>
				<td width="'.$w3.'">'.$this->info["alat_angkut"].'</td>
			 </tr>
			<tr >
				<td width="'.$w2.'">6.&nbsp;&nbsp;&nbsp;a. Tempat berangkat'.$spasi.'b. Tempat tujuan</td>
				<td width="'.$w3.'">a. '.$this->info["tempat_asal"].'<br/>b. '.$this->info["tempat_tujuan"].'</td>
			 </tr>	
			 <tr >
				<td width="'.$w2.'">7.&nbsp;&nbsp;&nbsp;a. Lama perjalanan dinas'.$spasi.'b. Tanggal berangkat'.$spasi.'c. Tanggal harus kembali</td>
				<td width="'.$w3.'">a. '.$this->info["durasi"].' hari<br/>b. '.$this->mgr->factory->Utils->string->dateId($this->info["tgl_berangkat"]).'<br/>c. '.$this->mgr->factory->Utils->string->dateId($this->info["tgl_kembali"]).'</td>
			 </tr>	
			
			<tr>
				<td colspan="2">8. Pengikut'.$this->printPengikut().'</td>
			</tr>
			<tr >
				<td width="'.$w2.'">9. Pembebanan Anggaran'.$spasi.'a. Instansi'.$spasi.'b. Akun</td>
				<td width="'.$w3.'"><br><br/>a. '.$this->info["satuan_kerja"].'<br>b. '.$this->info["akun_anggaran"].'</td>
			 </tr>	
			<tr >
				<td width="'.$w2.'">10. Keterangan lain-lain</td>
				<td width="'.$w3.'"></td>
			 </tr>				
			</table></p>';
		$this->mgr->helper->renderHTML($html);
	}
	protected function printPengikut() {
		$w1="35%";
		$w2="15%";
		$w3="40%";
		$tb="";
		$i=1;
		foreach ($this->pengikut as $row) {
			if ($i==1) {
				$tb .='<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
				$tb .='<table border="0" cellpadding="3" cellspacing="0">';
				$tb .='<tr><td width="'.$w1.'"><b>Nama</b></td><td width="'.$w2.'"><b>Tgl Lahir</b></td><td width="'.$w3.'"><b>Keterangan</b></td></tr>';
			}
			$tb .='<tr><td width="'.$w1.'">'.$i.'. '.$row["nama_pengikut"].'</td><td width="'.$w2.'">'.$row["tgl_lahir"].'</td><td width="'.$w3.'">'.$row["keterangan"].'</td></tr>';
			$i++;
		}
		if ($tb != "") $tb .= '</table>';
		return $tb;
	}
	protected function printFooter() {
		$this->mgr->helper->printCellPair("Dikeluarkan di","Jakarta",120,25);
		$this->mgr->helper->printCellPair("Tanggal",$this->mgr->factory->Utils->string->dateId($this->info["tgl_surat"]),120,25);
		$this->mgr->setSize("","B");
		$this->mgr->pdf->setX(120);
		$this->mgr->helper->printCell("Pejabat Pembuat Komitmen Bagian Keuangan");
		$this->mgr->pdf->ln(15);
		$this->mgr->pdf->setX(120);
		$this->mgr->helper->printCell($this->pejabat["nama"]);
		$this->mgr->pdf->setX(120);
		$this->mgr->helper->printCell("NIP. ".$this->pejabat["nip"]);
		$this->mgr->setNormalSize();
	}
}