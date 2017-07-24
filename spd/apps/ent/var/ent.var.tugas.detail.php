$(document).ready(function () {
$("#nama_karyawan").chosen();
$("#tgl_spd").jqxDateTimeInput({ width: 250, height: 25, theme: "<?php echo WIDGET_THEMES?>", selectionMode: 'range' });
$("#tgl_surat").jqxDateTimeInput({ width: 250, height: 25, theme: "<?php echo WIDGET_THEMES?>" });
var f_setdurasi=function() {
	 var selection = $("#tgl_spd").jqxDateTimeInput('getRange');
                    if (selection.from != null) {
                        var days   = Math.round((selection.to - selection.from)/1000/60/60/24);
    					$("#durasi").val(days);
                    }
};
<?php 
	
	$this->factory->Component->jqwidgets->setJqDate("tgl_surat",$this->factory->Utils->string->getValue($this->factory->formData,"tgl_surat"));
	$tg1=$this->factory->Utils->string->getValue($this->factory->formData,"tgl_berangkat");
	if ($tg1=="") $tg1 = $this->factory->tglmulai;
	$tg2=$this->factory->Utils->string->getValue($this->factory->formData,"tgl_kembali");
	if ($tg2=="") $tg2 = $this->factory->tglakhir;
	$this->factory->Component->jqwidgets->setJqDateRange("tgl_spd",$tg1,$tg2);
	
	if ($this->factory->Utils->string->getValue($this->factory->formData,"durasi")=="") {
		echo 'f_setdurasi();';
	}
?>
$("#tgl_spd").on('change', function (event) {
         f_setdurasi();
});
                
<?php 
$this->factory->Skins->Workers->form->formValidation("entri");
?>
$("#nama_karyawan").on("change",function(e) {
	var idk = $("#nama_karyawan").val();
	if (idk != "") {
		$.get("<?php echo $this->factory->Utils->general->getService('ref','disp/karyawan/getbiayakaryawan')?>?idk="+idk,function(data){
					var t= data.split("|");
					$('#tingkat_biaya').val(t[0]);
					$('#tempat_asal').val(t[1]); 
					$("#alat_angkut").focus();
				});
	}
});
$("#entri").submit(function(e) {
	if ($("#entri").valid()) {
		$("#id_karyawan").val($("#nama_karyawan").val());
		e.preventDefault();
		
		$.ajax({
					   type: "POST",
					   url: "<?php echo $this->factory->Utils->general->getService('ent','disp/tugas/add') ?>",
					   data: $("#entri").serialize(),
					   success: function(data) {
					   		
					   		if (data =="-1") {
					   			
					   			bootbox.alert("Save Failed,Please try again");
							} else {
								window.parent.refreshgrid();
								
							}
							
						}
		});
	}
});
});