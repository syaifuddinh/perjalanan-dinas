<div class="row-fluid">
<?php $this->factory->Skins->Workers->container->boxOpen("Quick Info","12",false,false,"0",$color="",$icon="icon-home");?>
<ul class="things-to-do">
	<li>
		<p><i class="icon-bell"></i> 
		<span class="value"><?php echo date('Y')?></span>
		Tahun  
			
		</p>
	</li>
	<li>
		<p><i class="icon-calendar"></i><span class="value"><?php echo number_format($this->factory->Models->spdstatistik->results["spdaktif"],0,",",".")?></span>
		
		SPD Aktif
			
		</p>
	</li>
	<li>
		<p><i class="icon-calendar-empty"></i><span class="value"><?php echo number_format($this->factory->Models->spdstatistik->results["spdrampung"],0,',','.')?></span>
		SPD Rampung
			
		</p>
	</li>
		<li>
		<p><i class="icon-group"></i><span class="value"><?php echo number_format($this->factory->Models->spdstatistik->results["spdpegawai"],0,',','.')?></span>
		Pegawai SPD
			
		</p>
	</li>
	<li>
		<p><i class="icon-money"></i><span class="value"><?php echo $this->factory->Utils->string->moneyId(($this->factory->Models->spdstatistik->results["spdbiaya"]))?></span>
		Total Biaya SPD
		</p>
	</li>
	
	
</ul>
<?php $this->factory->Skins->Workers->container->boxClose();?>

</div>
