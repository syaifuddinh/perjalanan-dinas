$(document).ready(function () {

<?php 
$this->factory->Component->jqwidgets->createPopUP("popupWindow","580","520");
$this->factory->Component->jqgrid->createUpdateFunction("f_update", $this->factory->Utils->general->getService('ent','disp/kegiatan/update'),"id_kegiatan,no_kegiatan,nama_kegiatan,akun_anggaran,tahun_anggaran,tgl_mulai,tgl_akhir,satuan_kerja,tempat_kegiatan");

$this->factory->Component->jqgrid->createLocalization();

$this->factory->Component->jqgrid->initgrid("dg",$this->factory->Utils->general->getService('ent','disp/kegiatan/get'));
$this->factory->Component->jqgrid->addColumn("menu","","text: 'Action',width: '180',filterable:false,sortable:false,pinned:true,noedit");
$this->factory->Component->jqgrid->addColumn("id_kegiatan","","");
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
$this->factory->Component->jqgrid->addSetting('editable: true');
$this->factory->Component->jqgrid->addSetting('columnsresize: true');


                
		
$this->factory->Component->jqgrid->createGrid(true,"","f_update");
$this->factory->Skins->Workers->form->formValidation("entri");
?>

$("#bt-new").on("click",function() {
	$("#entri")[0].reset();
	$("#popupWindow").jqxWindow('open');
	$("#no_kegiatan").focus();
});

$("#l_delete").live("click",function(e) {
	e.preventDefault();
	var id= this.href.replace(/.+\/([^\/]+)/,'$1');;
	bootbox.confirm("Are you sure?", function(confirmed) {
                    if (confirmed) {
						$.ajax({ type: "POST", 
					 		url: "<?php echo $this->factory->Utils->general->getService('ent','disp/kegiatan/remove')?>", 
					 		data:"id_kegiatan="+ id, 
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
$("#l_tugas").live("click",function(e) {
	e.preventDefault();
	var id= this.href.replace(/.+\/([^\/]+)/,'$1');;
	window.location.href="<?php echo $this->factory->Utils->general->getHref('ent/disp/tugas/')?>?k="+id;
});
$("#bt-refresh").on("click",function() {
	$("#dg").jqxGrid('updatebounddata', 'cells');
});
$("#entri").submit(function(e) {
	if ($("#entri").valid()) {
		e.preventDefault();
		$.ajax({
					   type: "POST",
					   url: "<?php echo $this->factory->Utils->general->getService('ent','disp/kegiatan/add') ?>",
					   data: $("#entri").serialize(),
					   success: function(data) {
					   		if (data =="-1") {
					   			$("#popupWindow").jqxWindow('close');
					   			bootbox.alert("Save Failed,Please try again");
							} else {
								$("#popupWindow").jqxWindow('close');
								$("#dg").jqxGrid('updatebounddata', 'cells');
							}
							
						}
		});
	}
});
});