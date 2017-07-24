<div class="row-fluid">
<?php 
	$bt='<button class="btn btn-primary" id="bt-browse"><i class="icon-folder-open"></i>&nbsp;browse kegiatan</button>';
	$bt .='&nbsp;<button class="btn btn-primary" id="bt-refresh"><i class="icon-refresh"></i>&nbsp;refresh</button>';
	$bt .='&nbsp;<button class="btn btn-primary" id="bt-new"><i class="icon-pencil"></i>&nbsp;new </button>';
	$this->factory->Skins->Workers->container->boxOpen("Daftar Surat Tugas","12",$closeButton=false,$colapse=false,$height="0",$color="",$icon="icon-keyboard",$bt);
?>
	
	<div class="span12" id="keg">
		<pre><?php echo ($this->factory->namakegiatan !="" ? $this->factory->namakegiatan : "Pilih Kegiatan dengan mengklik <small>browse kegiatan</small>") ?></pre>
	</div>
	<div id="dg"></div>

<?php $this->factory->Skins->Workers->container->boxClose();?>
</div>