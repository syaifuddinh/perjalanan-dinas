var dur=<?php echo $this->factory->formData["durasi"]?>;
var u_harian=<?php echo $this->factory->refData["u_harian"]?>;
var u_inap=<?php echo $this->factory->refData["u_inap"]?>;
$(document).ready(function () {

 var h_transport=function() {
 	$('#total_transport').val($('#tiket_pergi').val() + $('#tiket_pulang').val() 
 	+ $('#tax_asal').val() + $('#tax_tujuan').val() + $('#transport_asal').val() + $('#transport_tujuan').val());
 };
 var h_harian=function() {
 	$('#total_harian').val($('#jml_harian').val()*$('#harga_harian').val());
 };
 var h_inap=function() {
 	$('#total_inap').val($('#jml_inap').val()*$('#harga_inap').val());
 };
 var h_total=function() {
 	$('#total_biaya').val($('#total_harian').val()+$('#total_inap').val()+$('#total_transport').val());
 	$('#sisa_bayar').val($('#total_biaya').val()-$('#total_kasbon').val());
 };
 
 $(".cur").jqxNumberInput({ digits: 10,decimalDigits :0 , width:'150px',height: '30px', min: -9999999999, max: 9999999999, symbol: 'Rp. ', groupSeparator: '.',theme: "<?php echo WIDGET_THEMES?>"});
 $(".qty").jqxNumberInput({ digits: 3,decimalDigits :0 , width:'50px',height: '30px', min: 0, max: 999, spinButtons:true,symbol: '', groupSeparator: '.',theme: "<?php echo WIDGET_THEMES?>"});
 <?php 
 	$fd=array("jml_inap","harga_inap","total_inap","jml_harian","harga_harian","total_harian",
			"tiket_pergi","tiket_pulang","tax_asal","tax_tujuan","transport_asal",
			"transport_tujuan","total_transport","total_biaya","total_kasbon","sisa_bayar");
 	$c=count($fd);
 	for ($i=0;$i<$c;$i++) {
		echo "$('#".$fd[$i]."').val(".$this->factory->formData[$fd[$i]].");";
	}
 ?>
 
 $('.harian').on('valuechanged', function (event) {
    h_harian();
 });

 $('.inap').on('valuechanged', function (event) {
    h_inap();
 });
 $('.trans').on('valuechanged', function (event) {
    h_transport();
 });
 $('.total').on('valuechanged', function (event) {
    h_total();
 });
$("#bt-hitung").on("click",function(e) {
	$("#jml_harian").val(dur);
	$("#jml_inap").val(dur-1);
	$("#harga_harian").val(u_harian);
	$("#harga_inap").val(u_inap);
	h_total();

});
$("#entri").submit(function(e) {
e.preventDefault();
		$.ajax({
					   type: "POST",
					   url: "<?php echo $this->factory->Utils->general->getService('ent','disp/biayaspd/add') ?>",
					   data: $("#entri").serialize(),
					   success: function(data) {
					   		if (data =="-1") {
					   			bootbox.alert("Save Failed,Please try again");
							} else {
								window.parent.refreshgrid();
								
							}
							
						}
		});
	
});
});