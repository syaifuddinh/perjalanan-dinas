<div class="row-fluid">
<?php 
	$bt='<button class="btn btn-primary" id="bt-refresh"><i class="icon-refresh"></i>&nbsp;refresh</button>';
	$bt .='&nbsp;<button class="btn btn-primary" id="bt-new"><i class="icon-pencil"></i>&nbsp;new </button>';
	$this->factory->Skins->Workers->container->boxOpen("Daftar Karyawan","12",$closeButton=false,$colapse=false,$height="0",$color="",$icon="icon-wrench",$bt);
?>

	<div id="dg"></div>

<?php $this->factory->Skins->Workers->container->boxClose();?>
</div>
<div id="popupWindow" class="row-fluid">
            <div>New Data</div>
            
            <div style="overflow: hidden;">
            	<form action="#"  method="post" id="entri" name="form-nilai" class="form-horizontal">
            	<?php $this->factory->Skins->Workers->form->inputText("NIP","","nip_karyawan","span12",'data-rule-required="true"');?>
            	<?php $this->factory->Skins->Workers->form->inputText("Nama","","nama_karyawan","span12",'data-rule-required="true"');?>
            	
            	<?php $this->factory->Skins->Workers->form->inputSelect("Golongan","gol_karyawan",$this->factory->golList,"","span6","Pilih ...",'data-rule-required="true"',"gol","gol");?>
            	
            	<?php $this->factory->Skins->Workers->form->inputText("Jabatan","","jabatan_karyawan","span12");?>
            	<?php $this->factory->Skins->Workers->form->inputText("Lokasi Kerja","","kota_karyawan","span12");?>
            	
                <div class="form-actions">
					<input type="submit" class="btn btn-primary" value="Save">
					<input class="btn btn-cancel" id="Cancel" type="button" value="Cancel" />
  				 </div>
           
                </form>   
            </div>
           
</div>