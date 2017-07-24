<?php
class form {
	var $formData=array();
	public function __construct() {
	  		
	}
	public function inputText($label,$value="",$id="",$class="span6",$opt="",$hint="") {
		if ($hint != "") $hint = '<span class="help-inline">'.$hint.'</span>';
		if ($value=="") {
			if (isset($this->formData[$id])) $value = $this->formData[$id];
		}
		echo '<div class="control-group">
				<label class="control-label">'.$label.'</label>
				<div class="controls">
				<input type="text" value="'.$value.'" class="'.$class.'" id="'.$id.'" name="'.$id.'" '.$opt.'>
				'.$hint.'
				</div>
			</div>';
	}
	public function inputRadio($label,$id,$list,$value="",$extra="") {
		if ($value=="") {
			if (isset($this->formData[$id])) $value = $this->formData[$id];
		}
		echo '<div class="control-group">
		<label class="control-label">'.$label.'</label>
		<div class="controls">';
		foreach ($list as $opt) {
			$cek = "";
			if ($value=="") {
				$cek="checked=''";
				$value = "8ujfwjkjefjwjoei";
			}
			if ($value==$opt["value"]) $cek="checked=''";
			
			echo '<label class="radio inline">
		<input type="radio" name="'.$id.'" value="'.$opt["value"].'" '.$cek.' '.$extra.'> '.$opt["label"].'</label>';
			
			
		}
		
		echo '</div>
		</div>';
	}
	public function inputTextArea($label,$value="",$id,$class="span6",$opt="") {
		if ($value=="") {
			if (isset($this->formData[$id])) $value = $this->formData[$id];
		}
		echo '<div class="control-group">
		<label class="control-label">'.$label.'</label>
		<div class="controls">
		<textarea name="'.$id.'" class="'.$class.'" rows="3" '.$opt.'>'.$value.'</textarea>
		</div>
		</div>';
	}
	public function inputSelect($label,$id,$list,$value="",$class="span6",$prompt="Pilih ...",$rule="",$valueField="value",$labelField="label") {
		if ($value=="") {
			if (isset($this->formData[$id])) $value = $this->formData[$id];
		}
		
		if ($class=="") $class="span6";
		echo '<div class="control-group">
  				<label class="control-label">'.$label.'</label>
  					<div class="controls">
 					<select id="'.$id.'" name="'.$id.'" class="'.$class.'" data-placeholder="'.$prompt.'" '.$rule.'><option></option>';
		foreach ($list as $opt) {
					$s="";
					if ($value==$opt[$valueField]) $s="selected";
					echo '<option value="'.$opt[$valueField].'" '.$s.'>'.$opt[$labelField].'</option>';
		}
 		echo '</select></div></div>';
	}
	public function inputDate($label,$id) {
		echo '<div class="control-group">
		<label class="control-label">'.$label.'</label>
		<div class="controls">
		<div class="span6" id="'.$id.'"></div>
		</div>
		</div>';
	}
	public function formValidation($formid) {
		$fv ='$("#'.$formid.'").validate({
			errorElement:"span",
			errorClass:"help-inline",
			focusInvalid:true,
			ignore:"",
			invalidHandler:function(e,t){},
			highlight:function(e){$(e).closest(".control-group").removeClass("success").addClass("error")},
			unhighlight:function(e){$(e).closest(".control-group").removeClass("error");setTimeout(function(){a(e)},3e3)},
			success:function(e){
			e.closest(".control-group").removeClass("error").addClass("success")}});';
		echo trim(preg_replace('/\s+/', ' ',$fv));
		
	}
}
?>