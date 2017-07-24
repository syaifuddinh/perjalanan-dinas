<?php
class rincianbiaya  {
	var $mgr;
	var $mypdf;
	var $info;
	var $pejabat1;
	var $pejabat2;
	var $pejabat3;
	var $tgl;
	public function __construct($obj) {
		if (!isset($_GET["p"])) die();
		
		$this->mgr=$obj;
		$this->prepareData();
		
		$this->mgr->createPDF();
		$this->printHeader();
		$this->printDetail();
		$this->printPerhitunganRampung();
		$this->printFooter();
		//$this->mgr->helper->renderHTML($html);
		$this->mgr->pdf->Output('rincian_biaya.pdf', 'I');
				
	}
	protected function prepareData() {
		$this->mgr->factory->Models->load("spdpelaksana,refall");
		$this->mgr->factory->Utils->load("string");
		
		$this->info=$this->mgr->factory->Models->spdpelaksana->getDetail($_GET["p"]);
		if ($this->info["id_pelaksana"]=="") die();
		$this->pejabat1=$this->mgr->factory->Models->refall->getPejabat("1");
		$this->pejabat2=$this->mgr->factory->Models->refall->getPejabat("2");
		$this->pejabat3=$this->mgr->factory->Models->refall->getPejabat("3");
	}
	protected function printHeader() {
		$this->tgl=$this->mgr->factory->Utils->string->dateId($this->info["tgl_update"]);
		$this->mgr->helper->printCellPair("Tahun Anggaran",$this->info["tahun_anggaran"],125,30);
		$this->mgr->helper->printCellPair("Nomor Bukti.","",125,30);
		$this->mgr->helper->printCellPair("Mata Anggaran",$this->info["akun_anggaran"],125,30);
		$this->mgr->helper->printCell();
		$this->mgr->setSize(15,"B");
		$this->mgr->helper->printCell("Rincian Biaya Perjalanan Dinas","C");
		$this->mgr->pdf->ln(3);
		$this->mgr->setNormalSize();
		$this->mgr->helper->printCellPair("Lampiran SPD Nomor",$this->info["no_surat"],0,50);
		$this->mgr->helper->printCellPair("Tanggal",$this->tgl,0,50);
	}
	protected function printBiaya($fd) {
		if ($this->info[$fd]==0) return "-";
		return number_format(abs($this->info[$fd]),0,',','.');
	}
	protected function printDetail() {
		$w1="5%";
		$w2="50%";
		$w3="15%";
		$w4="25%";
		$w5="5%";
		
		$html = '<p><table border="1" cellpadding="3" cellspacing="0">
			<tr>
				<td width="'.$w1.'"><b>No.</b></td>
				<td width="'.$w2.'"><b>Perincian Biaya</b></td>
				<td width="20%" align="center"><b>Jumlah</b></td>
				<td width="'.$w4.'"><b>Keterangan</b></td>
			</tr>
			<tr>
				<td width="'.$w1.'" align="center">1</td>
				<td width="'.$w2.'">Uang Harian ( '.$this->info["jml_harian"].' hr x  Rp. '.$this->printBiaya("harga_harian").' )</td>
				<td width="'.$w5.'">Rp.</td>
				<td width="'.$w3.'" align="right">'.$this->printBiaya("total_harian").'</td>
				<td width="'.$w4.'"></td>
			</tr>
			<tr>
				<td width="'.$w1.'" align="center">2</td>
				<td width="'.$w2.'">Uang Transport</td>
				<td width="'.$w5.'">Rp.</td>
				<td width="'.$w3.'" align="right">'.$this->printBiaya("total_transport").'</td>
				<td width="'.$w4.'"></td>
			</tr>	
			<tr>
				<td width="'.$w1.'" align="center">3</td>
				<td width="'.$w2.'">Uang Penginapan ( '.$this->info["jml_inap"].' hr x  Rp. '.$this->printBiaya("harga_inap").' )</td>
				<td width="'.$w5.'">Rp.</td>
				<td width="'.$w3.'" align="right">'.$this->printBiaya("total_inap").'</td>
				<td width="'.$w4.'"></td>
			</tr>	
			<tr>
				<td width="'.$w1.'" align="center"></td>
				<td width="'.$w2.'"><b>JUMLAH</b></td>
				<td width="'.$w5.'"><b>Rp.</b></td>
				<td width="'.$w3.'" align="right"><b>'.$this->printBiaya("total_biaya").'</b></td>
				<td width="'.$w4.'"></td>
			</tr>	
			<tr><td colspan="5">Terbilang : <b>'.ucwords($this->mgr->factory->Utils->string->terbilang($this->info["total_biaya"])).' Rupiah</b></td></tr>
			</table></p>';
		$w1="35%";
		$w2="35%";
		$w3="30%";
		$html.='<p><table border="0" cellpadding="3" cellspacing="0">
				<tr>
					<td width="'.$w1.'">
						Telah dibayar sejumlah:<br>Rp.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
						.$this->printBiaya("total_biaya").'<br/>
						Bendahara Pengeluaran <br>Sekretariat PT Maju Lancar
						<br><br><br><br><br/>'
						.$this->pejabat2["nama"].'<br/>NIP. '
						.$this->pejabat2["nip"].'
					</td>
					<td width="'.$w2.'">
						<br/><br/>Lunas Dibayar<br/>
						Bagian Keuangan
						<br><br><br><br><br><br/>'
						.$this->pejabat3["nama"].'<br/>NIP. '
						.$this->pejabat3["nip"].'
					</td>
					<td width="'.$w3.'">
						Jakarta, '.$this->tgl.'<br/>
						Telah menerima uang sebesar :<br/>Rp.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
						.$this->printBiaya("total_biaya").'<br/>Yang Menerima
						<br><br><br><br><br>'
						.$this->info["nama_karyawan"].'<br/>NIP. '
						.$this->info["nip_karyawan"].'
					</td>
				</tr>
				
		</table></p>';
		$this->mgr->helper->renderHTML($html);
	}
	protected function printPerhitunganRampung() {
		$rp="Rp.       ";
		$s="Sisa";
		if ($this->info["sisa_bayar"] < 0) $s="Sisa Lebih";
		if ($this->info["sisa_bayar"] > 0) $s="Sisa Kurang";
		$this->mgr->helper->renderHTML("<hr/>");
		$this->mgr->setSize(12,"B");
		$this->mgr->helper->printCell("PERHITUNGAN SPPD RAMPUNG","C");
		$this->mgr->helper->printCell();
		$this->mgr->setSize(0,"");
		
		$w1="25%";
		$w2="5%";
		$w3="8%";
		$w4="10%";
		$html = '<table border="0" cellpadding="3" cellspacing="0">
		<tr>
			<td width="'.$w1.'">Ditetapkan sejumlah</td>
			<td width="'.$w2.'">:</td>
			<td width="'.$w3.'">Rp.</td>
			<td width="'.$w4.'" align="right">'.$this->printBiaya("total_biaya").'</td>
		</tr>
		<tr>
			<td width="'.$w1.'">Yang telah dibayar semula</td>
			<td width="'.$w2.'">:</td>
			<td width="'.$w3.'">Rp.</td>
			<td width="'.$w4.'" align="right">'.$this->printBiaya("total_kasbon").'</td>
		</tr>
		<tr>
			<td width="'.$w1.'">'.$s.'</td>
			<td width="'.$w2.'">:</td>
			<td width="'.$w3.'">Rp.</td>
			<td width="'.$w4.'" align="right">'.$this->printBiaya("sisa_bayar").'</td>
		</tr></table>
		';
		$this->mgr->helper->renderHTML($html);
	}
	protected function printFooter() {
		$this->mgr->pdf->setX(120);
		$this->mgr->helper->printCell("An Kuasa Pengg Anggaran/Pengg. Barang");
		$this->mgr->pdf->setX(125);
		$this->mgr->helper->printCell("Sekretariat PT Maju Lancar");
		$this->mgr->pdf->setX(125);
		$this->mgr->helper->printCell("Pejabat Pembuat Komitmen Bagian Keuangan");
		
		$this->mgr->pdf->ln(20);
		$this->mgr->pdf->setX(125);
		$this->mgr->helper->printCell($this->pejabat1["nama"]);
		$this->mgr->pdf->setX(125);
		$this->mgr->helper->printCell("NIP. ".$this->pejabat1["nip"]);
	
	}
}