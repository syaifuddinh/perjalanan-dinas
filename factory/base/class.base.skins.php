<?php
	class skinsFactory extends mainFactory{
		var $factory;
		var $pathSkin;
		var $Workers;
		var $skinName;
		
		/*skin property */
		var $dir_worker;
		var $dir_js;
		var $url_skin;
		var $url_js;
		var $url_css;
		var $url_img;
		var $url_font;
		var $url_css_plugins;
		
		public function __construct($skin="") {
		 	$this->factory=mainFactory::getInstance();
		 	$this->Workers = new workersFactory();
		 	$this->skinName=$skin;
		 	if ($this->skinName=="") $this->skinName=ACTIVE_SKIN;
		 	$this->setSkin();
		}
		public function setSkin() {
			$this->pathSkin=DIR_SKINS.$this->skinName.DIRECTORY_SEPARATOR;
			$this->dir_worker=$this->pathSkin."worker".DIRECTORY_SEPARATOR;
			$this->dir_js=$this->pathSkin."js".DIRECTORY_SEPARATOR;
			
			$this->url_skin=URL_BASE_SKIN.$this->skinName."/";
			$this->url_js=$this->url_skin."js/";
			$this->url_css=$this->url_skin."css/";
			$this->url_img=$this->url_skin."img/";
			$this->url_font=$this->url_skin."font/";
			$this->url_css_plugins=$this->url_skin."js/plugins/";
		}
		
		public function load($skinname="",$createNavi=true) {
			if ($createNavi) {
				$this->factory->Utils->load("html");
				$this->factory->Utils->html->createNavigation();
			}
			if ($skinname=="") $skinname="index";
			$path=$this->pathSkin;
			$this->loadMultiCode($path,"skin.".$this->skinName.".",$skinname);
		}
		public function loadLayout($layoutname) {
			$path = $this->pathSkin."layout".DIRECTORY_SEPARATOR;
			$this->loadMultiCode($path,"",$layoutname);
		}
		
		public function getJS($jslist,$folder="",$path="") {
			if ($path=="") $path=base64_encode($this->dir_js);
			if ($folder !="") $folder = "&fd=".base64_encode(base64_encode($folder));
			if ($path !="") $path = "&pt=".base64_encode($path);
			$jslist=base64_encode(base64_encode($jslist));
			echo '<script src="'.URL_COMMON.'getjs.php?f='.$jslist.$folder.$path.'"></script>';
		}
		
		public function addJSPlugins($pluginName) {
			if (strpos($this->factory->JSPlugins,$pluginName)) return "";
			if ($this->factory->JSPlugins != "") $this->factory->JSPlugins .= ",";
			$this->factory->JSPlugins .= $pluginName;
		}
		public function addCSSPlugins($cssName) {
			if ($this->factory->CSSPlugins != "") $this->factory->CSSPlugins .= ",";
			$this->factory->CSSPlugins .= $cssName;
		}
		public function loadJSPlugins($plugDir,$plugList="",$path="") {
			if ($plugList == "") $plugList=$this->factory->JSPlugins;
			if ($plugList != "") $this->getJS($plugList,$plugDir,$path);
		}
		public function addCSSWidgets($cssName) {
			if ($this->factory->CSSWidgets != "") $this->factory->CSSWidgets .= ",";
			$this->factory->CSSWidgets .= $cssName;
		}
		public function loadWidgetPlugins() {
			$this->getJS($this->factory->Widgets,$this->factory->activeWidget,base64_encode(DIR_WIDGETS));
		}
		
		public function loadCSSPlugins() {
			if ($this->factory->CSSPlugins != "") {
				$temp=explode(",",$this->factory->CSSPlugins);
				for ($ix=0;$ix<count($temp);$ix++) {
					echo '<link rel="stylesheet" href="'.$this->url_css_plugins.$temp[$ix].'.css">'.PHP_EOL;
				}
			}
		}
		public function loadCSSWidgets() {
			if ($this->factory->CSSWidgets != "") {
				$temp=explode(",",$this->factory->CSSWidgets);
				for ($ix=0;$ix<count($temp);$ix++) {
					echo '<link rel="stylesheet" href="'.URL_WIDGETS.$temp[$ix].'.css">'.PHP_EOL;
				}
			}
		}
	}
?>