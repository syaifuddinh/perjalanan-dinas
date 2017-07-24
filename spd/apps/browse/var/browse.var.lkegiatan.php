
$(document).ready(function () {

<?php 

$this->factory->Component->jqgrid->createLocalization();
$this->factory->Component->jqgrid->createSelectFunction("onkegiatanselect");
$this->factory->Component->jqgrid->initgrid("dg",$this->factory->Utils->general->getService('browse','disp/lkegiatan/get'));
$this->factory->Component->jqgrid->addColumn("id_kegiatan","","");
$this->factory->Component->jqgrid->addColumn("Pilih","pilih","text: '', width:'80',pinned:true,columntype: 'button', align:'center',cellsrenderer: function () {
	return 'Pilih';},filterable:false,sortable:false,buttonclick: f_select");
$this->factory->Component->jqgrid->addColumn("nama_kegiatan","","text: 'Nama Kegiatan',width: '400',pinned:true");
$this->factory->Component->jqgrid->addColumn("no_kegiatan","","text: 'No. Kegiatan',width: '200'");

$this->factory->Component->jqgrid->addColumn("tahun_anggaran","","text: 'Tahun',width: '80'");
$this->factory->Component->jqgrid->addColumn("akun_anggaran","","text: 'Akun Anggaran',width: '200'");
$this->factory->Component->jqgrid->addColumn("tgl_mulai","date","text: 'Tgl. Mulai',width: '120', filtertype:'date',align:'center',cellsalign:'center',columntype: 'datetimeinput',cellsformat:'dd MMM yyyy'");
$this->factory->Component->jqgrid->addColumn("tgl_akhir","date","text: 'Tgl. Akhir',width: '120', filtertype:'date', align:'center',cellsalign:'center',columntype: 'datetimeinput',cellsformat:'dd MMM yyyy'");
$this->factory->Component->jqgrid->addColumn("tempat_kegiatan","","text: 'Lokasi',width: '150'");
$this->factory->Component->jqgrid->addColumn("satuan_kerja","","text: 'Satuan Kerja',width: '200'");

$this->factory->Component->jqgrid->addSetting('showfilterrow: true');
$this->factory->Component->jqgrid->addSetting('localization: getLocalization()');
$this->factory->Component->jqgrid->addSetting('selectionmode: "none"');
$this->factory->Component->jqgrid->addSetting('editable: false');
$this->factory->Component->jqgrid->addSetting('columnsresize: true');
$this->factory->Component->jqgrid->createGrid(true,"100%");
?>
});