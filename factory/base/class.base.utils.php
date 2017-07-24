<?php
	class utilsFactory extends mainFactory{
		
		public function load($utilsname) {
			$this->loadMultiClass(DIR_UTILS,"class.utils.",$utilsname);
			
		}
		
		
	}
?>