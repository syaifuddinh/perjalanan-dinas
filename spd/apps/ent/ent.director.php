<?php
class ent {
	var $factory;
	var $THEMES=WIDGET_THEMES;
	public function __construct() {
		$this->factory=mainFactory::getInstance();
		if ($this->factory->Utils->session->getSession("HAK")!= "admin") die("You have no rights to access this page");
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
		$this->factory->Skins->Workers->load("container");
		$this->factory->Skins->addJSPlugins("bootbox/bootbox.min.js");
		return true;
	}
	public function index() {
		
		$this->disp("kegiatan");
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