<?php
class rekap {
	var $factory;
	public function __construct() {
		$this->factory=mainFactory::getInstance();
	
	}
	protected function setupMenudetail() {
		$this->factory->Models->load("spdmenu");
		$this->factory->Utils->load("html");
		$this->factory->Utils->html->activeMenu =  $this->factory->Utils->general->getCurrentURL();
		$this->factory->menu=$this->factory->Utils->html->getChild($this->factory->Models->spdmenu->getMenu());
		return true;
	}
	protected function defaultInterface() {
		$this->factory->setupUI();
		$this->setupMenudetail();
		$this->factory->Skins->Workers->load("container,form");
		$this->factory->Skins->addJSPlugins("bootbox/bootbox.min.js,colorbox/colorbox.min.js,chosen-bootstrap/chosen.jquery.min.js");
		$this->factory->Skins->addCSSPlugins("chosen-bootstrap/chosen.min,colorbox/colorbox");
		
		return true;
	}
	public function index() {
		$this->disp("rekkegiatan");
	}
	public function disp($dispname="") {
		if ($dispname=="") {
			$dispname=$this->factory->Utils->general->getManagerName();
		}
		if ($dispname=="") die();
		$this->factory->Units->loadManager($dispname);
	}
}
?>