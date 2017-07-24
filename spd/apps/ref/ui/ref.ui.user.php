<div class="row-fluid">
<?php 
	$bt='<button class="btn btn-primary" id="bt-refresh"><i class="icon-refresh"></i>&nbsp;refresh</button>';
	$bt .='&nbsp;<button class="btn btn-primary" id="bt-new"><i class="icon-pencil"></i>&nbsp;new </button>';
	$this->factory->Skins->Workers->container->boxOpen("Daftar User","12",$closeButton=false,$colapse=false,$height="0",$color="",$icon="icon-wrench",$bt);
?>

	<div id="dg"></div>

<?php $this->factory->Skins->Workers->container->boxClose();?>
</div>
<div id="popupWindow" class="row-fluid">
            <div>New Data</div>
            
            <div style="overflow: hidden;">
            	<form action="#"  method="post" id="entri" name="form-nilai" class="form-horizontal">
            	<?php $this->factory->Skins->Workers->form->inputText("User ID","","id","span12",'data-rule-required="true"');?>
            	<?php $this->factory->Skins->Workers->form->inputText("Real Name","","real_name","span12",'data-rule-required="true"');?>
            	
            	<?php $this->factory->Skins->Workers->form->inputSelect("Role","role",array(array("label"=>"admin","value"=>"admin"),array("label"=>"user","value"=>"user")),"","span6","Pilih ...",'data-rule-required="true"');?>
            	
            	<?php $this->factory->Skins->Workers->form->inputText("Password","","passwd","span12",'data-rule-required="true"');?>
            
            	
                <div class="form-actions">
					<input type="submit" class="btn btn-primary" value="Save">
					<input class="btn btn-cancel" id="Cancel" type="button" value="Cancel" />
  				 </div>
           
                </form>   
            </div>
           
</div>
<div id="popupPass" class="row-fluid">
            <div>Set Password</div>
            
            <div style="overflow: hidden;">
            	<form action="#"  method="post" id="form-pass" name="form-pass" >
            	<input type="hidden" name="setid" id="setid" value="">
            	
            	<?php $this->factory->Skins->Workers->form->inputText("Password","","setpasswd","span12",'data-rule-required="true"');?>
            
            	
                <div class="form-actions pull-right">
					<input type="submit" class="btn btn-primary" value="Set">
					<input class="btn btn-cancel" id="CancelPass" type="button" value="Cancel" />
  				 </div>
           
                </form>   
            </div>
           
</div>