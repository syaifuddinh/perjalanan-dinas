<?php
	class modelsFactory extends mainFactory{
		
		public function load($utilsname) {
			$this->loadMultiClass(DIR_MODELS,"class.model.",$utilsname);
		}
		
		
	}
?>