<?php
class componentsFactory extends mainFactory{

	public function load($widname) {
		$this->loadMultiClass(DIR_WIDGETS,"class.components.",$widname);
	}


}
?>