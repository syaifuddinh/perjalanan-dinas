<?php
class auth {

	var $factory;
	public function __construct() {
		$this->factory=mainFactory::getInstance();
	}
	public function index() {
		if ($this->factory->Utils->session->getSession("LOGIN")=="1") {
			
			if ($this->factory->Utils->session->getSession("HAK")=="admin") $this->factory->Utils->general->redirect("padmin");
			if ($this->factory->Utils->session->getSession("HAK")=="user") $this->factory->Utils->general->redirect("opr");
			return true;
		}
		$this->factory->setupUI();
		$this->factory->Component->load("jqwidgets"); //widgets
		$this->factory->Component->jqwidgets->setThemes("metro");
		$this->factory->Component->jqwidgets->load("validator");
		$this->factory->Skins->addJSPlugins("bootbox/bootbox.min.js");
		$this->factory->Units->loadJSVar("login");
		$this->factory->Units->loadJS("login");
		$this->factory->Units->loadUI("loginform");
		$this->factory->Skins->load("login",false);
			
	}
	public function login() {
	   
		$this->factory->Models->load("authentification");
		echo $this->factory->Models->authentification->identifyUser($_POST);
	}
	public function logoff() {
		$this->factory->Utils->session->clearSession("LOGIN,ID_USER,REAL_NAME,HAK,COOKIE");
		$this->factory->Utils->session->clearCookieData("LOGIN,ID_USER,REAL_NAME,HAK,COOKIE");
		$this->factory->Utils->general->redirect("");
	}

}
?>
