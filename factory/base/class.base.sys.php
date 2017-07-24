<?php	
class mainFactory {
	private static $instance;
	
    var $vars = array();
	var $pages;
	var $url_string;
	var $skinColor="";
	
	
	var $Utils;
	var $Models;
	var $Units;
	var $Component;
	var $Dba;
	var $DB;
	
	public function __construct() {
	 // echo "assalamualikum";
	}
	public static function getInstance(){
		if (!self::$instance) self::$instance = new mainFactory(); 
		return self::$instance; 
	}
	
	public function __set($name, $value) {
        $this->vars[$name] = $value;
    }
    public function __get($name) {
        if (isset($this->vars[$name])) return $this->vars[$name];
		return "";
    }
	
	/**
	 * loadcode
	 * fungsi : meload single file dengan include baik itu prosedural ataupun class
	 * codename : nama file yang diload lengkap dengan pathnya
	 * alias : nama kode yang dilewatkan melalui url segment
	 * jika file tidak ada akan di redirect ke private/ 404 dengan pesan page not found
	 */
	protected function loadCode($codename,$alias="",$minimize=false) {
		//echo $codename;
		
		if (file_exists($codename)) {
			if ($minimize) {
				//untuk file-file js langsung di minimize
				$fContent = file_get_contents($codename);
				echo trim(preg_replace('/\s+/', ' ',$fContent));
			} else {
				include $codename;
			}
			return true;
		} else {
			echo "<pre>".$codename." not found </pre>";
			//echo "page ".$_SERVER['PATH_INFO']." not found";
			return false;
		}
	}
	
	/**
	 * loadMulticode
	 * fungsi : meload banyak file yang berisi prosedural code sekaligus, fungsi ini akan memanggil loadCode
	 * path : nama path dimana file yang akan diload berada
	 * prefix : nama awalan file
	 * codelist : list file (tidak dengan prefix) yang akan diload
	 */
	protected function loadMultiCode($path,$prefix,$codelist,$minimize=false,$ext="php") {
		$codelist .= ",";
		$temp=explode(",",$codelist);
		for ($u=0;$u<count($temp);$u++) {
			if ($temp[$u] != "") $this->loadCode($path.$prefix.$temp[$u].".".$ext,$temp[$u],$minimize);
			
		}
	}
	
	/** loadMultiClass
	** fungsi : meload banyak file yang berisi class sekaligus, fungsi ini akan memanggil loadCode
	** path : nama path dimana file yang akan diload berada
	** prefix : nama awalan file
	** codelist : list file (tidak dengan prefix) yang akan diload
	** Desc : setelah file diload, akan langsung diinisialisasi sehingga dapat langsung dipanggil fungsi-fungsinya
	**/
	protected function loadMultiClass($path,$prefix,$codelist) {
		$codelist .= ",";
		$temp=explode(",",$codelist);
		for ($u=0;$u<count($temp);$u++) {
			if ($temp[$u] != "") {
				$className=$temp[$u];
				if (!isset($this->vars[$className])) {
						$this->loadCode($path.$prefix.$temp[$u].".php",$temp[$u]);
						$this->vars[$className]=& instantiate_class(new $className());
						
				}
				
			}
		}
	}
	
	public function initFactory() {
		$this->Dba= new dbsFactory();
		$this->Utils = new utilsFactory();
		$this->Models = new modelsFactory();
		$this->Units = new unitsFactory();
		$this->Component = new componentsFactory();
		
	}
	
    public function init() {
	   $this->initFactory();
	   
	   //load default database
	   $this->DB=$this->Dba->create(DB_DRIVER);
	   $this->DB->DBLOG=TRUE;
	   $this->DB->connect(DB_SERVER,DB_USER,DB_PASS,DB_DATABASE);
	   
	   //load general and session utility
	   $this->Utils->load("general,session");
	 }
	 public function setupUI($skin="") {
	 	$this->vars["JS"] = "";
	 	$this->vars["UI"] = "";
	 	$this->vars["JSPlugins"] = "";
	 	$this->vars["CSSPlugins"] = "";
	 	$this->vars["CSSWidgets"] = "";
	 	$this->vars["Widgets"] = "";
	 	$this->vars["JSVar"] = "";
	 	$this->vars["mainMenu"] = "";
	 	$this->Utils->load("html");
	 	$this->Skins = new skinsFactory($skin);
	 	
	 }
	 public function getRequestType() {
	 
	 	if (strpos($this->Utils->general->getCurrentUrl(),$this->Utils->general->serviceKey()) !== false ) return "svc";
	 	return "ui";
	 }
	 public function doAuth() {
	 	$cookieTocopy = "JS5_LOGIN,JS5_USER,JS5_ID_USER,JS5_REAL_NAME,JS5_HAK,JS5_LOGIN_TIME";
	 	if ($this->Utils->session->getSession("JS5_LOGIN")=="") $this->Utils->session->cookieToSession($cookieTocopy);
	 	
	 	if ($this->Utils->session->getSession("JS5_LOGIN")=="1") {
	 		return true;
	 	} else {
	 		return false;
	 	}
	 	
	 }

	 public function runApp() {
	 	$this->init();
	 	$this->pages= $this->Utils->general->getPages();
	 	if (count($this->pages)==1) $this->pages[1]="index";
	
	 	//cek sudah login apa tidak
	 	$unitToLoad= $this->pages[0];
	 	$pageToload = $this->pages[1];
	 	
	 	if (AUTH_TYPE=="FULL") {
	 		if (!$this->doAuth()) {
	 			if ("ui" ==$this->getRequestType()) {
	 				$unitToLoad="auth";
	 				$pageToload="index";
	 			} else {
	 				if ($unitToLoad != "auth") {
	 					echo "Session expired, please re-login";
	 					die();
	 				}
	 				 
	 			}
	 			 
	 		}
	 	}
	 	
	 	$this->Units->setUnit($unitToLoad);
	 	$this->Units->load($pageToload);
	 }
	
}
?>