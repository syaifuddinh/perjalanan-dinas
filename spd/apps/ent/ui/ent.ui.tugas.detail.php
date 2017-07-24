<div class="row-fluid">
<form action="#"  method="post" id="entri" name="form-nilai" class="form-horizontal">
            	<input type="hidden" id="id_kegiatan" name="id_kegiatan" value="<?php echo $_GET['idk']?>">
            	<input type="hidden" id="id_pelaksana" name="id_pelaksana" value="<?php echo isset($_GET['p']) ? $_GET['p'] : ''?>">
            	<input type="hidden" id="id_karyawan" name="id_karyawan" value="<?php echo $this->factory->Utils->string->getValue($this->factory->formData,'id_karyawan')?>">
           		
            	<?php $this->factory->Skins->Workers->form->inputText("No. Surat","","no_surat","span4",'data-rule-required="true"');?>
            	<?php $this->factory->Skins->Workers->form->inputSelect("Jenis SPD","jenis_spd",array(array("label"=>"Dalam Negeri","value"=>"Dalam Negeri"),array("label"=>"Luar Negeri","value"=>"Luar Negeri")),"Dalam Negeri","span2","Pilih ...",'data-rule-required="true"');?>
            	<?php $this->factory->Skins->Workers->form->inputDate("Tgl. Surat","tgl_surat") ?>
            	
            	<?php 
            		$nama=$this->factory->Utils->string->getValue($this->factory->formData,'id_karyawan');
            		
            		$this->factory->Skins->Workers->form->inputSelect("Nama Karyawan","nama_karyawan",$this->factory->Models->spdkaryawan->results,$nama,"span8","Pilih...",'data-rule-required="true"');
            	?>
            	<?php $this->factory->Skins->Workers->form->inputSelect("Tingkat Biaya","tingkat_biaya",$this->factory->Models->refall->results,"","input-mini","Pilih ...",'data-rule-required="true"',"tingkat_biaya","tingkat_biaya");?>
            	<?php $this->factory->Skins->Workers->form->inputSelect("Alat Angkut","alat_angkut",array(array("label"=>"Umum","value"=>"Umum"),array("label"=>"Pesawat","value"=>"Pesawat")),"","span2","Pilih ...",'data-rule-required="true"');?>
            	<?php $this->factory->Skins->Workers->form->inputDate("Tgl. SPD","tgl_spd") ?>
            	
            	<?php 
            		$nama=$this->factory->Utils->string->getValue($this->factory->formData,'durasi');
            		if ($nama=="") $name= "1";
            		$this->factory->Skins->Workers->form->inputText("Durasi ",$nama,"durasi","input-mini",'data-rule-required="true" data-rule-number="true"',"Hari");
            	?>
            	<?php $this->factory->Skins->Workers->form->inputText("Kasbon Rp.","","total_kasbon","span4",'data-rule-number="true"');?> 
            	
            	<?php $this->factory->Skins->Workers->form->inputText("Kota Asal","","tempat_asal","span4");?>
            	<?php 
            		$kota = $this->factory->Utils->string->getValue($this->factory->formData,'tempat_tujuan');
            		if ($kota=="") $kota=$this->factory->Models->spdkegiatan->results["tempat_kegiatan"];
            		$this->factory->Skins->Workers->form->inputText("Kota Tujuan",$kota,"tempat_tujuan","span4");
            	?>
            	<?php 
            		$agenda = $this->factory->Utils->string->getValue($this->factory->formData,'agenda');
            		if ($agenda=="") $agenda=$this->factory->Models->spdkegiatan->results["nama_kegiatan"];
            		$this->factory->Skins->Workers->form->inputText("Agenda",$agenda,"agenda","span12");
            	?>
                <div class="form-actions">
					<input type="submit" class="btn btn-primary" value="Save">
				</div>
                </form>   	
</div>