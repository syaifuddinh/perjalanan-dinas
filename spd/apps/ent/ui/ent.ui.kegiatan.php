<div class="row-fluid">
<?php 
	$bt='<button class="btn btn-primary" id="bt-refresh"><i class="icon-refresh"></i>&nbsp;refresh</button>';
	$bt .='&nbsp;<button class="btn btn-primary" id="bt-new"><i class="icon-pencil"></i>&nbsp;new </button>';
	$this->factory->Skins->Workers->container->boxOpen("Daftar Kegiatan","12",$closeButton=false,$colapse=false,$height="0",$color="",$icon="icon-keyboard",$bt);
?>

	<div id="dg"></div>

<?php $this->factory->Skins->Workers->container->boxClose();?>
</div>
<div id="popupWindow" class="row-fluid">
            <div>New Data</div>
            
            <div style="overflow: hidden;">
            	<form action="#"  method="post" id="entri" name="form-nilai" class="form-horizontal">
            	<?php $this->factory->Skins->Workers->form->inputText("No. Kegiatan","","no_kegiatan","span8",'data-rule-required="true"');?>
            	<?php $this->factory->Skins->Workers->form->inputText("Nama Kegiatan","","nama_kegiatan","span12",'data-rule-required="true"');?>
            	<?php $this->factory->Skins->Workers->form->inputText("Tahun Anggaran","","tahun_anggaran","span4");?>
            	<?php $this->factory->Skins->Workers->form->inputText("Akun Anggaran","","akun_anggaran","span12");?>
            	<?php $this->factory->Skins->Workers->form->inputText("Tgl Mulai","","tgl_mulai","span4",'data-rule-required="true" data-mask="99/99/9999"',"tgl/bln/tahun");?>
            	<?php $this->factory->Skins->Workers->form->inputText("Tgl Akhir","","tgl_akhir","span4",'data-rule-required="true" data-mask="99/99/9999"',"tgl/bln/tahun");?>
            	<?php $this->factory->Skins->Workers->form->inputText("Lokasi Kegiatan","","tempat_kegiatan","span12");?>
            	<?php $this->factory->Skins->Workers->form->inputText("Satuan Kerja","","satuan_kerja","span12");?>
            	
                <div class="form-actions">
					<input type="submit" class="btn btn-primary" value="Save">
					<input class="btn btn-cancel" id="Cancel" type="button" value="Cancel" />
  				 </div>
           
                </form>   
            </div>
           
</div>