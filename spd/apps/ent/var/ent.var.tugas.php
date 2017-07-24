var idk="<?php echo $this->factory->idkegiatan?>";
var url="<?php echo $this->factory->Utils->general->getService('ent','disp/tugas/get')?>";
var dgsc;
function onkegiatanselect(data) {
	idk =data["id_kegiatan"];
	$("#keg").html('<pre>'+data["nama_kegiatan"]+'</pre>');
	$.colorbox.close();
	dgsc.url = url+"?idk="+idk;
	$("#dg").jqxGrid('updatebounddata', 'cells');
};
function refreshgrid() {
	$("#dg").jqxGrid('updatebounddata', 'cells');
	$.colorbox.close();
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
$this->factory->Component->jqgrid->globarVar=true;
$this->factory->Component->jqgrid->initgrid("dg",$this->factory->Utils->general->getService('ent','disp/tugas/get')."?idk=".$this->factory->idkegiatan);
$this->factory->Component->jqgrid->addColumn("id_pelaksana","","");
$this->factory->Component->jqgrid->addColumn("menu","","text: 'Action',width: '200',filterable:false,sortable:false,pinned:true");
$this->factory->Component->jqgrid->addColumn("status","","text: 'Status',width: '50',filterable:false,cellsrenderer:statusrenderer,pinned:true");
$this->factory->Component->jqgrid->addColumn("no_surat","","text: 'No. Surat',width: '180',pinned:true");
$this->factory->Component->jqgrid->addColumn("nama_karyawan","","text: 'Nama',width: '200'");
$this->factory->Component->jqgrid->addColumn("nip_karyawan","","text: 'NIP',width: '150'");

$this->factory->Component->jqgrid->addColumn("tgl_surat","date","text: 'Tgl. Surat',width: '120', filtertype:'date',align:'center',cellsalign:'center',columntype: 'datetimeinput',cellsformat:'dd MMM yyyy'");
$this->factory->Component->jqgrid->addColumn("jenis_spd","","text: 'Tipe',width: '100'");
$this->factory->Component->jqgrid->addColumn("tgl_berangkat","date","text: 'Berangkat',width: '120', filtertype:'date', align:'center',cellsalign:'center',columntype: 'datetimeinput',cellsformat:'dd MMM yyyy'");
$this->factory->Component->jqgrid->addColumn("tgl_kembali","date","text: 'Kembali',width: '120', filtertype:'date', align:'center',cellsalign:'center',columntype: 'datetimeinput',cellsformat:'dd MMM yyyy'");
$this->factory->Component->jqgrid->addColumn("durasi","number","text: 'Durasi',width: '80',align:'center',cellsalign:'center'");

$this->factory->Component->jqgrid->addColumn("tempat_asal","","text: 'Dari',width: '200'");
$this->factory->Component->jqgrid->addColumn("tempat_tujuan","","text: 'Ke',width: '200'");
$this->factory->Component->jqgrid->addColumn("total_biaya","number","text: 'Total Biaya',width: '200',align:'right',cellsalign:'right',cellsformat:'c'");


$this->factory->Component->jqgrid->addSetting('pagesize: 30');
$this->factory->Component->jqgrid->addSetting('showfilterrow: true');
$this->factory->Component->jqgrid->addSetting('localization: getLocalization()');
$this->factory->Component->jqgrid->addSetting('editable: false');
$this->factory->Component->jqgrid->addSetting('columnsresize: true');
		
$this->factory->Component->jqgrid->createGrid(true);
$this->factory->Skins->Workers->form->formValidation("entri");
?>
$("#bt-refresh").on("click",function() {
	$("#dg").jqxGrid('updatebounddata', 'cells');
});
$("#bt-new").on("click",function() {
	if (idk != "") {
		$.colorbox({title:"Surat Tugas",href:"<?php echo $this->factory->Utils->general->getHref('ent/disp/tugas/viewdetail/')?>?idk="+idk,
		width:"90%",height:"90%", iframe:true});
	}
			
});
$("#bt-browse").on("click",function() {
	
		$.colorbox({title:"Daftar Kegiatan",href:"<?php echo $this->factory->Utils->general->getHref('browse/disp/lkegiatan')?>",
		width:"90%",height:"90%", iframe:true});
		
});
$("#l_delete").live("click",function(e) {
	e.preventDefault();
	var id= this.href.replace(/.+\/([^\/]+)/,'$1');;
	bootbox.confirm("Are you sure?", function(confirmed) {
                    if (confirmed) {
						$.ajax({ type: "POST", 
					 		url: "<?php echo $this->factory->Utils->general->getService('ent','disp/tugas/remove')?>", 
					 		data:"id_pelaksana="+ id, 
					 		success: function(data) { 
					 			if (data=="-1") { 
					 				bootbox.alert("Remove failed, silahkan coba lagi");
					 			} else { 
					 				$("#dg").jqxGrid('updatebounddata', 'cells');
					 			} 
					 		}});
					};
                });
});
$("#l_edit").live("click",function(e) {
	e.preventDefault();
	var id= this.href.replace(/.+\/([^\/]+)/,'$1');;
	$.colorbox({title:"Surat Tugas",href:"<?php echo $this->factory->Utils->general->getHref('ent/disp/tugas/viewdetail')?>?idk="+idk+"&p="+id,
		width:"90%",height:"90%", iframe:true});
});
$("#l_rampung").live("click",function(e) {
	e.preventDefault();
	var id= this.href.replace(/.+\/([^\/]+)/,'$1');;
	$.colorbox({title:"Biaya SPD",href:"<?php echo $this->factory->Utils->general->getHref('ent/disp/biayaspd/viewbiaya')?>?idk="+idk+"&p="+id,
		width:"600",height:"100%", iframe:true});
});
$("#l_ikut").live("click",function(e) {
	e.preventDefault();
	var id= this.href.replace(/.+\/([^\/]+)/,'$1');;
	$.colorbox({title:"Pengikut",href:"<?php echo $this->factory->Utils->general->getHref('ent/disp/pengikutspd/view')?>?p="+id,
		width:"800",height:"500", iframe:true});
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