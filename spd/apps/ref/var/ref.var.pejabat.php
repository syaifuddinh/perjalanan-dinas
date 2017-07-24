$(document).ready(function () {
<?php 
$this->factory->Component->jqwidgets->createPopUP("popupWindow");
$this->factory->Component->jqgrid->createUpdateFunction("f_update", $this->factory->Utils->general->getService('ref','disp/pejabat/update'),"id,nama,nip");

$this->factory->Component->jqgrid->initgrid("dg",$this->factory->Utils->general->getService('ref','disp/pejabat/get'));

$this->factory->Component->jqgrid->addColumn("jabatan","","text: 'Jabatan',width: '40%',noedit");
$this->factory->Component->jqgrid->addColumn("nama","","text: 'Nama', width: '40%'");
$this->factory->Component->jqgrid->addColumn("nip","","text: 'NIP', cellsalign:'center',align:'center',width:'20%'");
$this->factory->Component->jqgrid->addColumn("id","");


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
					   url: "<?php echo $this->factory->Utils->general->getService('ref','disp/pejabat/add') ?>",
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