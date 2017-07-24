<?php
class jqwidgets{
	var $factory;
	
	public function __construct() {
	  	$this->factory=mainFactory::getInstance();
	  	if ("ui" ==$this->factory->getRequestType()) {
	  		$this->factory->activeWidget="jqwidgets";
	  		$this->factory->Skins->addCSSWidgets($this->factory->activeWidget."/styles/jqx.base");
	  		$this->addGlobalization();
	  		$this->load("core");
	  		$this->setThemes(WIDGET_THEMES);
	  	}
	}
	public function load($components) {
		$temp=explode(",",$components.",");
		for ($i=0;$i<count($temp);$i++) {
			if ($temp[$i] != "") {
				$p="";
				if ($this->factory->Widgets != "") $p=strpos($this->factory->Widgets,$temp[$i]);
				if ($p=="") {
					if ($this->factory->Widgets != "") $this->factory->Widgets .= ",";
					$this->factory->Widgets .= "jqx".$temp[$i].".js";
					if ($temp[$i]=="grid") $this->factory->Widgets .= ",jqxgrid.sort.js,jqxgrid.pager.js,jqxgrid.selection.js,jqxgrid.columnsresize.js,jqxgrid.filter.js,jqxgrid.edit.js";
				}
			}
		}
		
	}
	public function addGlobalization(){
		$this->factory->Widgets .= "globalization/globalize.js,globalization/globalize.id.js";
	}
	public function setThemes($themesName) {
		if ($this->factory->widgetTheme != "") return;
		$this->factory->widgetTheme=$themesName;
		$this->factory->Skins->addCSSWidgets($this->factory->activeWidget."/styles/jqx.".$themesName);
	}
	
	public function createPopUp($elm,$width="500",$height="300",$cancelButton="Cancel",$setting="resizable:true") {
		if ($setting != "") $setting .= ",";
		echo '$("#'.$elm.'").jqxWindow({
			showCollapseButton: true,width: '.$width.', height:'.$height.','.$setting.' theme: "'.WIDGET_THEMES.'", isModal: true, autoOpen: false, cancelButton: $("#'.$cancelButton.'"), modalOpacity: 0.50
		});';
	}
	public function setJqDate($el,$tgl) {
		if ($tgl=="") return "";
		$t=explode("-", $tgl);
		$tgl = $t[0].",".(intval($t[1])-1).",".$t[2];
		$v1="d".$el;
		echo "var ".$v1."=new Date(".$tgl.");";
		echo '$("#'.$el.'").jqxDateTimeInput("setDate", '.$v1.');';
		return true;
	}
	public function setJqDateRange($el,$tgl1,$tgl2) {
		if (($tgl1=="")||($tgl2=="")) return "";
		$t=explode("-", $tgl1);
		$tgl1 = $t[0].",".(intval($t[1])-1).",".$t[2];
		$v1="d".$el."1";
		$t=explode("-", $tgl2);
		$tgl2 = $t[0].",".(intval($t[1])-1).",".$t[2];
		$v2="d".$el."2";
		echo "var ".$v1."=new Date(".$tgl1.");";
		echo "var ".$v2."=new Date(".$tgl2.");";
		echo '$("#'.$el.'").jqxDateTimeInput("setRange", '.$v1.','.$v2.');';
		return true;
	}
}
?>