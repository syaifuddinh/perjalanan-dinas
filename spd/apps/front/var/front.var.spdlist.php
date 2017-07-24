var url="<?php echo $this->factory->Utils->general->getService('ent','disp/spdlist/get')?>";

function refreshgrid() {
	$("#dg").jqxGrid('updatebounddata', 'cells');
}
function closebox() {
$.colorbox.close();
}
$(document).ready(function () {
var statusrenderer=function(row, datafield, value)  {
	if (value=="1") return '<div style="padding-bottom:2px;margin-left:4px;margin-top:4px"><span class="label label-success">Closed</span></div>';
	return '<div style="padding-bottom:2px;margin-left:4px;margin-top:4px"><span class="label label-warning">Active</span></div>';
};

<?php 

$this->factory->Component->jqgrid->createLocalization();
$this->factory->Component->jqgrid->initgrid("dg",$this->factory->Utils->general->getService('front','disp/spdlist/get'));
$this->factory->Component->jqgrid->addColumn("id_pelaksana","","");
$this->factory->Component->jqgrid->addColumn("menu","","text: 'Action',width: '80',filterable:false,sortable:false,pinned:true");
$this->factory->Component->jqgrid->addColumn("status","","text: 'Status',width: '50',filterable:false,cellsrenderer:statusrenderer,pinned:true");
$this->factory->Component->jqgrid->addColumn("nama_karyawan","","text: 'Nama',width: '200',pinned:true");
$this->factory->Component->jqgrid->addColumn("nip_karyawan","","text: 'NIP',width: '150'");
$this->factory->Component->jqgrid->addColumn("gol_karyawan","","text: 'Gol.',width: '50'");
$this->factory->Component->jqgrid->addColumn("jabatan_karyawan","","text: 'Jabatan',width: '200'");

$this->factory->Component->jqgrid->addColumn("no_surat","","text: 'No. Surat',width: '180'");
$this->factory->Component->jqgrid->addColumn("no_kegiatan","","text: 'No. Kegiatan',width: '180'");
$this->factory->Component->jqgrid->addColumn("akun_anggaran","","text: 'No. Akun',width: '180'");


$this->factory->Component->jqgrid->addColumn("tgl_surat","date","text: 'Tgl. Surat',width: '120', filtertype:'date',align:'center',cellsalign:'center',columntype: 'datetimeinput',cellsformat:'dd MMM yyyy'");
$this->factory->Component->jqgrid->addColumn("jenis_spd","","text: 'Tipe SPD',width: '100'");
$this->factory->Component->jqgrid->addColumn("tempat_asal","","text: 'Dari',width: '200'");
$this->factory->Component->jqgrid->addColumn("tempat_tujuan","","text: 'Ke',width: '200'");
$this->factory->Component->jqgrid->addColumn("alat_angkut","","text: 'Angkutan',width: '100'");

$this->factory->Component->jqgrid->addColumn("agenda","","text: 'Agenda',width: '300',filterable:false,sortable:false");
$this->factory->Component->jqgrid->addColumn("tgl_berangkat","date","text: 'Berangkat',width: '120', filtertype:'date', align:'center',cellsalign:'center',columntype: 'datetimeinput',cellsformat:'dd MMM yyyy'");
$this->factory->Component->jqgrid->addColumn("tgl_kembali","date","text: 'Kembali',width: '120', filtertype:'date', align:'center',cellsalign:'center',columntype: 'datetimeinput',cellsformat:'dd MMM yyyy'");
$this->factory->Component->jqgrid->addColumn("durasi","number","text: 'Durasi',width: '80',align:'center',cellsalign:'center',aggregates: ['sum']");

$this->factory->Component->jqgrid->addColumn("total_biaya","number","text: 'Total Biaya',width: '150',align:'right',cellsalign:'right',cellsformat:'c',aggregates: ['sum']");
$this->factory->Component->jqgrid->addColumn("total_kasbon","number","text: 'Kasbon',width: '150',align:'right',cellsalign:'right',cellsformat:'c',aggregates: ['sum']");
$this->factory->Component->jqgrid->addColumn("sisa_bayar","number","text: 'Sisa',width: '150',align:'right',cellsalign:'right',cellsformat:'c',aggregates: ['sum']");
$this->factory->Component->jqgrid->addColumn("user_id","","text: 'User',width: '80'");
$this->factory->Component->jqgrid->addSetting('pagesize: 30');
$this->factory->Component->jqgrid->addSetting('showfilterrow: true');
$this->factory->Component->jqgrid->addSetting('localization: getLocalization()');
$this->factory->Component->jqgrid->addSetting('editable: false');
$this->factory->Component->jqgrid->addSetting('columnsresize: true');
$this->factory->Component->jqgrid->addSetting('pagesizeoptions: ["25","30","40", "50", "60","80","100","150","200"]');
$this->factory->Component->jqgrid->addSetting('showaggregates: true');
$this->factory->Component->jqgrid->addSetting('showstatusbar: true');	
$this->factory->Component->jqgrid->addSetting('statusbarheight: 25');
$this->factory->Component->jqgrid->createGrid(true);
?>
$("#bt-refresh").on("click",function() {
	$("#dg").jqxGrid('updatebounddata', 'cells');
});

$("#l_surat").live("click",function(e) {
	e.preventDefault();
	var id= this.href.replace(/.+\/([^\/]+)/,'$1');;
	$.colorbox({title:this.title,href:"<?php echo $this->factory->Utils->general->getReport('pdf','surattugas')?>?p="+id,
		width:"100%",height:"100%", iframe:true});
});
$("#l_biaya").live("click",function(e) {
	e.preventDefault();
	var id= this.href.replace(/.+\/([^\/]+)/,'$1');;
	$.colorbox({title:this.title,href:"<?php echo $this->factory->Utils->general->getReport('pdf','rincianbiaya')?>?p="+id,
		width:"100%",height:"100%", iframe:true});
});

});