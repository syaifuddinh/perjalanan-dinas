<div class="row-fluid">
<?php 
	$bt='<button class="btn btn-primary" id="bt-refresh"><i class="icon-refresh"></i>&nbsp;refresh</button>';
	$bt .='&nbsp;<button class="btn btn-primary" id="bt-new"><i class="icon-pencil"></i>&nbsp;new </button>';
	$this->factory->Skins->Workers->container->boxOpen("Daftar Biaya","12",$closeButton=false,$colapse=false,$height="0",$color="",$icon="icon-wrench",$bt);
?>
<div class="row-fluid">
	<div class="span7">
		
			<h4>Petunjuk</h4><p></p>
				<p>Klik New untuk menambah data</p>
				<p>Untuk mengedit data, klik pada kolom yang akan diedit, ketikkan data yang diinginkan kemudian tekan enter</p>
				<p>Klik Refresh untuk merefresh tampilan data</p>
	
	</div>
	<div class="span5"><div id="dg"></div></div>
	
</div>
<?php $this->factory->Skins->Workers->container->boxClose();?>
</div>
<div id="popupWindow" class="row-fluid">
            <div>New Data</div>
            
            <div style="overflow: hidden;">
            	<form action="#"  method="post" id="entri" name="form-nilai" class="form-horizontal">
            	<?php $this->factory->Skins->Workers->form->inputText("Tingkat Biaya","","tingkat_biaya","span12",'data-rule-required="true"');?>
            	<?php $this->factory->Skins->Workers->form->inputText("Uang Harian","","u_harian","span12",'data-rule-required="true" data-rule-number="true"');?>
            	<?php $this->factory->Skins->Workers->form->inputText("Uang Penginapan","","u_inap","span12",'data-rule-required="true" data-rule-number="true"');?>
                <div class="form-actions">
					<input type="submit" class="btn btn-primary" value="Save">
					<input class="btn btn-cancel" id="Cancel" type="button" value="Cancel" />
  				 </div>
           
                </form>   
            </div>
           
</div>