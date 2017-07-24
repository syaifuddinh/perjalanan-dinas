$(document).ready(function () {
var roleeditor= function (row, column, editor) {
                           var list = ['admin','user'];
                            editor.jqxComboBox({ autoDropDownHeight: true, source: list, promptText: "Pilih" });
                        };
var cellchange = function (row, column, columntype, oldvalue, newvalue) {
                           if (newvalue == "") return oldvalue;
                        };
var f_password = function(row) {
	var dataku = $("#dg").jqxGrid("getrowdata", row);
	$("#setpasswd").val("");
	$("#setid").val(dataku.id);
	
	$("#popupPass").jqxWindow('open');
	$("#popupPass").jqxWindow('focus');
	$("#setpasswd").focus();
};

<?php 
$this->factory->Component->jqwidgets->createPopUP("popupWindow","500","450");
$this->factory->Component->jqwidgets->createPopUP("popupPass","400","200","CancelPass");
$this->factory->Component->jqgrid->createUpdateFunction("f_update", $this->factory->Utils->general->getService('ref','disp/user/update'),"id,real_name,role");
$this->factory->Component->jqgrid->createDeleteFunction("f_remove","dg",$this->factory->Utils->general->getService('ref','disp/user/remove'));
$this->factory->Component->jqgrid->initgrid("dg",$this->factory->Utils->general->getService('ref','disp/user/get'));


$this->factory->Component->jqgrid->addColumn("id","","text: 'User ID',width: '20%',noedit");
$this->factory->Component->jqgrid->addColumn("real_name","","text: 'Real Name',width: '30%'");
$this->factory->Component->jqgrid->addColumn("role","","text: 'Role',width: '15%',columntype: 'combobox',createeditor:roleeditor,cellvaluechanging:cellchange");
                     

$this->factory->Component->jqgrid->addColumn("Delete","delete","text: 'Manage', width:'10%',columntype: 'button', align:'center',cellsrenderer: function () {
	return 'Delete';},filterable:false,sortable:false,buttonclick: f_remove");
$this->factory->Component->jqgrid->addColumn("Set Password","password","text: 'Password', width:'10%',columntype: 'button', align:'center',cellsrenderer: function () {
	return 'Set Password';},filterable:false,sortable:false,buttonclick: f_password");

$this->factory->Component->jqgrid->addSetting('selectionmode: "none"');
$this->factory->Component->jqgrid->addSetting('editable: true');

$this->factory->Component->jqgrid->createGrid(false,"","f_update");
$this->factory->Skins->Workers->form->formValidation("entri");
$this->factory->Skins->Workers->form->formValidation("form-pass");
?>

$("#bt-new").on("click",function() {
	$("#entri")[0].reset();
	$("#popupWindow").jqxWindow('open');
	$("#nip_karyawan").focus();
});



$("#bt-refresh").on("click",function() {
	$("#dg").jqxGrid('updatebounddata', 'cells');
});
$("#entri").submit(function(e) {
	if ($("#entri").valid()) {
		e.preventDefault();
		$.ajax({
					   type: "POST",
					   url: "<?php echo $this->factory->Utils->general->getService('ref','disp/user/add') ?>",
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
$("#form-pass").submit(function(e) {
e.preventDefault();

	if ($("#form-pass").valid()) {
		
		$.ajax({
					   type: "POST",
					   url: "<?php echo $this->factory->Utils->general->getService('ref','disp/user/update') ?>",
					   data: "id="+$("#setid").val()+"&passwd="+$("#setpasswd").val(),
					   success: function(data) {
					   		if (data =="-1") {
					   			$("#popupPass").jqxWindow('close');
					   			bootbox.alert("Set Password Failed,Please try again");
							} else {
								$("#popupPass").jqxWindow('close');
								
							}
							
						}
		});
	}
});
});