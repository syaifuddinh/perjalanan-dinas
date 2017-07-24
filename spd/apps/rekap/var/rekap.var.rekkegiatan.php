function onkegiatanselect(data) {
	$("#idk").val(data["id_kegiatan"]);
	$("#no_kegiatan").val(data["no_kegiatan"]);
	$("#keg").html(data["nama_kegiatan"]);
	$.colorbox.close();
};
$(document).ready(function () {

//$("#id_rekap").chosen();
$("#bt-browse").on("click",function() {
	
		$.colorbox({title:"Daftar Kegiatan",href:"<?php echo $this->factory->Utils->general->getHref('browse/disp/lkegiatan')?>",
		width:"90%",height:"90%", iframe:true});
		
});
$("#form-rekap").submit(function(e) {
	e.preventDefault();
});
$("#bt-rekap").on("click",function(e) {
	var idk = $("#idk").val();
	var idr= $("#id_rekap").val();
	if (idk == "") return false;
	if (idr == "") return false;
	
	this.href=$("#id_rekap").val()+"?idk="+idk;
	return true;
});
});