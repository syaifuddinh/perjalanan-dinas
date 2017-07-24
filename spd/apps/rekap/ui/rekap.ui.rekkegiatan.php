<div class="row-fluid">
<?php 
	$this->factory->Skins->Workers->container->boxOpen("Rekap","12",$closeButton=false,$colapse=false,$height="0",$color="",$icon="icon-external-link");
?>
<div class="row-fluid">

	<form action="#" id="form-rekap" class="form-horizontal" >
		
		<?php
			$this->factory->Skins->Workers->form->inputSelect("Jenis Rekap","id_rekap",$this->factory->jenisRekap,"","span6","Pilih ...",'data-rule-required="true"');
		?>
		
		<div class="control-group">
			<input type="hidden" nama="idk" id="idk">
			<label class="control-label">No. Kegiatan</label>
			<div class="controls">
				<div class="input-append">
					<input id="no_kegiatan" name="no_kegiatan" type="text" class="span12" placeholder="Pilih kegiatan" disabled>
					<button class="btn btn-primary" type="button" id="bt-browse">Browse</button>
				</div>
			</div>
		</div>
		<div class="control-group">
			<label class="control-label">Nama Kegiatan</label>
			<div class="controls">
				<pre id="keg"></pre>
			</div>
		</div>
		
		<div class="form-actions">
	  
	  		<a class="btn btn-primary" id="bt-rekap" href="rekap" target="_blank">Download</a>
	  	</div>
	</form>
</div>

<?php $this->factory->Skins->Workers->container->boxClose();?>
</div>