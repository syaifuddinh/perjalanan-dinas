$(document).ready(function () {
<?php
$this->factory->Component->jqwidgets->createPopUP("popupWindow","400","300"); 
$this->factory->Component->jqgrid->createUpdateFunction("f_update", $this->factory->Utils->general->getService('ent','disp/pengikutspd/update'),"id_pelaksana,id_pengikut,nama_pengikut,tgl_lahir,keterangan");
$this->factory->Component->jqgrid->createDeleteFunction("f_remove","dg",$this->factory->Utils->general->getService('ent','disp/pengikutspd/remove'));
$this->factory->Component->jqgrid->initgrid("dg",$this->factory->Utils->general->getService('ent','disp/pengikutspd/get')."?p=".$_GET["p"]);

$this->factory->Component->jqgrid->addColumn("nama_pengikut","","text: 'Nama',width: '30%'");
$this->factory->Component->jqgrid->addColumn("tgl_lahir","","text: 'Tgl Lahir', width: '15%',cellsalign:'center',align:'center'");
$this->factory->Component->jqgrid->addColumn("keterangan","","text: 'Keterangan', width:'35%'");
$this->factory->Component->jqgrid->addColumn("id_pengikut","","");
$this->factory->Component->jqgrid->addColumn("id_pelaksana","","");

$this->factory->Component->jqgrid->addColumn("Delete","delete","text: 'Manage', width:'20%',columntype: 'button', align:'center',cellsrenderer: function () {
	return 'Delete';},filterable:false,sortable:false,buttonclick: f_remove");
$this->factory->Component->jqgrid->addSetting('height: "250"');
$this->factory->Component->jqgrid->addSetting('selectionmode: "none"');
$this->factory->Component->jqgrid->addSetting('editable: true');

$this->factory->Component->jqgrid->createGrid(false,"","f_update");
$this->factory->Skins->Workers->form->formValidation("entri");
?>

$("#bt-new").on("click",function() {
	$("#entri")[0].reset();
	$("#popupWindow").jqxWindow('open');
	$("#nama_pengikut").focus();
});



$("#bt-refresh").on("click",function() {
	$("#dg").jqxGrid('updatebounddata', 'cells');
});
$("#entri").submit(function(e) {
	if ($("#entri").valid()) {
		e.preventDefault();
		$.ajax({
					   type: "POST",
					   url: "<?php echo $this->factory->Utils->general->getService('ent','disp/pengikutspd/add') ?>",
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