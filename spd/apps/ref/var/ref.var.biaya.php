$(document).ready(function () {
var numbereditor= function (row, cellvalue, editor) {
                          editor.jqxNumberInput({ decimalDigits: 0,digits : 9,spinButtons: false});
                      };

<?php 
$this->factory->Component->jqwidgets->createPopUP("popupWindow");
$this->factory->Component->jqgrid->createUpdateFunction("f_update", $this->factory->Utils->general->getService('ref','disp/biaya/update'),"tingkat_biaya,u_harian,u_inap");
$this->factory->Component->jqgrid->createDeleteFunction("f_remove","dg",$this->factory->Utils->general->getService('ref','disp/biaya/remove'));
$this->factory->Component->jqgrid->initgrid("dg",$this->factory->Utils->general->getService('ref','disp/biaya/get'));

$this->factory->Component->jqgrid->addColumn("tingkat_biaya","","text: 'Tingkat',editable:'false',width: '20%',cellsalign:'center',align:'center',noedit");
$this->factory->Component->jqgrid->addColumn("u_harian","number","text: 'Uang Harian', width: '30%', cellsalign:'right',align:'right',cellsformat:'n',columntype: 'numberinput',createeditor: numbereditor");
$this->factory->Component->jqgrid->addColumn("u_inap","number","text: 'Uang Penginapan', cellsalign:'right',align:'right',width:'30%',cellsformat:'n',columntype: 'numberinput',createeditor: numbereditor");

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
	$("#tingkat_biaya").focus();
});



$("#bt-refresh").on("click",function() {
	$("#dg").jqxGrid('updatebounddata', 'cells');
});
$("#entri").submit(function(e) {
	if ($("#entri").valid()) {
		e.preventDefault();
		$.ajax({
					   type: "POST",
					   url: "<?php echo $this->factory->Utils->general->getService('ref','disp/biaya/add') ?>",
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