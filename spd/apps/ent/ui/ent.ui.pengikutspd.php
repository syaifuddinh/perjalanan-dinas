<div class="row-fluid">
<?php 
	$bt='<button class="btn btn-primary" id="bt-refresh"><i class="icon-refresh"></i>&nbsp;refresh</button>';
	$bt .='&nbsp;<button class="btn btn-primary" id="bt-new"><i class="icon-pencil"></i>&nbsp;new </button>';
	$this->factory->Skins->Workers->container->boxOpen("Daftar Golongan","12",$closeButton=false,$colapse=false,$height="0",$color="",$icon="icon-group",$bt);
?>

	
	<div class="span12"><div id="dg"></div></div>
	

<?php $this->factory->Skins->Workers->container->boxClose();?>
</div>
<div id="popupWindow" class="row-fluid">
            <div>New Data</div>
            
            <div style="overflow: hidden;">
            	<form action="#"  method="post" id="entri" name="form-nilai" class="form-horizontal">
            	<input type="hidden" name="id_pelaksana" id="id_pelaksana" value="<?php echo $_GET['p']?>">
            	<?php $this->factory->Skins->Workers->form->inputText("Nama","","nama_pengikut","span6",'data-rule-required="true"');?>
            	<?php $this->factory->Skins->Workers->form->inputText("Tgl Lahir","","tgl_lahir","span4");?>
            	<?php $this->factory->Skins->Workers->form->inputText("Keterangan","","keterangan","span12");?>
                <div class="form-actions">
					<input type="submit" class="btn btn-primary" value="Save">
					<input class="btn btn-cancel" id="Cancel" type="button" value="Cancel" />
  				 </div>
           
                </form>   
            </div>
           
</div>