$(document).ready(function () {
var goleditor= function (row, column, editor) {
                           var list = [<?php echo $this->factory->Utils->string->recordsetToJsArray( $this->factory->golList,"gol");?>];
                            editor.jqxComboBox({ autoDropDownHeight: true, source: list, promptText: "Pilih" });
                        };
var cellchange = function (row, column, columntype, oldvalue, newvalue) {
                           if (newvalue == "") return oldvalue;
                        };
             

<?php 
$this->factory->Component->jqwidgets->createPopUP("popupWindow","500","400");
$this->factory->Component->jqgrid->createUpdateFunction("f_update", $this->factory->Utils->general->getService('ref','disp/karyawan/update'),"id_karyawan,nip_karyawan,nama_karyawan,jabatan_karyawan,gol_karyawan,kota_karyawan");
$this->factory->Component->jqgrid->createDeleteFunction("f_remove","dg",$this->factory->Utils->general->getService('ref','disp/karyawan/remove'));
$this->factory->Component->jqgrid->initgrid("dg",$this->factory->Utils->general->getService('ref','disp/karyawan/get'));

$this->factory->Component->jqgrid->addColumn("id_karyawan","","");
$this->factory->Component->jqgrid->addColumn("nip_karyawan","","text: 'NIP',width: '15%'");
$this->factory->Component->jqgrid->addColumn("nama_karyawan","","text: 'Nama',width: '20%'");
$this->factory->Component->jqgrid->addColumn("gol_karyawan","","text: 'Gol.',width: '5%',columntype: 'combobox',createeditor:goleditor,cellvaluechanging:cellchange");
                     
$this->factory->Component->jqgrid->addColumn("jabatan_karyawan","","text: 'Jabatan',width: '40%'");
$this->factory->Component->jqgrid->addColumn("kota_karyawan","","text: 'Lokasi',width: '15%'");
$this->factory->Component->jqgrid->addColumn("Delete","delete","text: 'Manage', width:'5%',columntype: 'button', align:'center',cellsrenderer: function () {
	return 'Delete';},filterable:false,sortable:false,buttonclick: f_remove");

$this->factory->Component->jqgrid->addSetting('selectionmode: "none"');
$this->factory->Component->jqgrid->addSetting('editable: true');

$this->factory->Component->jqgrid->createGrid(true,"","f_update");
$this->factory->Skins->Workers->form->formValidation("entri");
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
					   url: "<?php echo $this->factory->Utils->general->getService('ref','disp/karyawan/add') ?>",
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