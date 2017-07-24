$(document).ready(function () {
<?php
$this->factory->Component->jqwidgets->createPopUP("popupWindow"); 
$this->factory->Component->jqgrid->createUpdateFunction("f_update", $this->factory->Utils->general->getService('ref','disp/gol/update'),"gol,nama_gol,tingkat_biaya");
$this->factory->Component->jqgrid->createDeleteFunction("f_remove","dg",$this->factory->Utils->general->getService('ref','disp/gol/remove'));
$this->factory->Component->jqgrid->initgrid("dg",$this->factory->Utils->general->getService('ref','disp/gol/get'));

$this->factory->Component->jqgrid->addColumn("gol","","text: 'Golongan',width: '20%',cellsalign:'center',align:'center',noedit");
$this->factory->Component->jqgrid->addColumn("nama_gol","","text: 'Nama', width: '40%'");
$this->factory->Component->jqgrid->addColumn("tingkat_biaya","","text: 'Tingkat Biaya', cellsalign:'center',align:'center',width:'20%'");

$this->factory->Component->jqgrid->addColumn("Delete","delete","text: 'Manage', width:'20%',columntype: 'button', align:'center',cellsrenderer: function () {
	return 'Delete';},filterable:false,sortable:false,buttonclick: f_remove");

$this->factory->Component->jqgrid->addSetting('selectionmode: "none"');
$this->factory->Component->jqgrid->addSetting('editable: true');

$this->factory->Component->jqgrid->createGrid(false,"","f_update");
$this->factory->Skins->Workers->form->formValidation("entri");
?>

$("#bt-new").on("click",function() {
	$("#entri")[0].reset();
	$("#popupWindow").jqxWindow('open');
	$("#gol").focus();
});



$("#bt-refresh").on("click",function() {
	$("#dg").jqxGrid('updatebounddata', 'cells');
});
$("#entri").submit(function(e) {
	if ($("#entri").valid()) {
		e.preventDefault();
		$.ajax({
					   type: "POST",
					   url: "<?php echo $this->factory->Utils->general->getService('ref','disp/gol/add') ?>",
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