<?php
/**
 * @author sativa
 * nama kelas : jqgrid
 * deskripsi : wrapper untuk komponen jqwidgets grid
 */
class jqgrid {
	var $factory;
	
	var $globalVar; /* flag untuk deklarasi variable array colection,jika true harus dideklarassikan sendiri, defaultnya false*/
	protected $cols=array();
	protected $props=array();
	protected $datafields=array();
	
	protected $idgrid;
	protected $url;
	protected $updateRow;
	protected $datefield;
	
	public function __construct() {
		$this->factory=mainFactory::getInstance();
		$this->globalVar=false;
	}
	
	public function fetchDataModel($modelname="",$funcname="",$datefield="",$menu="",$fdmenu="",$initWhere="") {
		if ($funcname=="") $funcname="get";
		$res=array();
		$this->datefield=$datefield;
		
		$this->factory->Models->load($modelname);
			
		$this->factory->Models->$modelname->limit=$this->gridLimit();
		$this->factory->Models->$modelname->where=$this->gridFilter();
		$this->factory->Models->$modelname->order=$this->gridOrder();
		if ($initWhere != "") {
			if ($this->factory->Models->$modelname->where != "") $this->factory->Models->$modelname->where .= " AND ";
			$this->factory->Models->$modelname->where .= $initWhere;
		}
		$this->factory->Models->$modelname->$funcname();
		if ($menu != "") {
			foreach ($this->factory->Models->$modelname->results as $fd) {
				$fd["menu"]=str_replace("{".$fdmenu."}", $fd[$fdmenu], $menu);
				$res[]=$fd;
			}
		} else {
			$res=$this->factory->Models->$modelname->results;
		}
		$data[] = array('TotalRows' => $this->factory->Models->$modelname->foundrows,
				'Rows' =>$res);
		echo json_encode($data);
		return true;
	
	}
	
	public function initgrid($idgrid,$url) {
		$this->idgrid=$idgrid;
		$this->url=$url;
		$this->cols=array();
		$this->props=array();
		$this->datafields=array();
	}
	public function addColumn($datafield,$type="string",$def="") {
		if ($type=="") $type="string";
		$this->datafields[]="{name:'".$datafield."',type:'".$type."'}";
		if ($def !="") {
			$def=str_replace("noedit", "cellbeginedit: function (row, datafield, columntype, value) { return false; }", $def);
			$def = "{datafield:'".$datafield."',".$def."}";
			$this->cols[]=$def;
		}
	}
	public function addSetting($prop) {
		$this->props[]=$prop;
	}
	protected function createDataAdapter() {
		if ($this->updateRow != "") $this->updateRow=",updaterow: ".$this->updateRow;
		$v="";
		if ($this->globalVar) $v="var ";
		$df=join($this->datafields,",");
		if ($df != "") $df = "datafields:[".$df."],";
		$sc=$this->idgrid."sc";
		$da=$this->idgrid."da";
		$res= $v.$sc.' =
		{
			datatype: "json",
			cache: false,
			url: "'.$this->url.'",'.$df.'
			filter: function()
			{
				$("#'.$this->idgrid.'").jqxGrid("updatebounddata", "filter");
			},
			sort: function()
			{
				$("#'.$this->idgrid.'").jqxGrid("updatebounddata", "sort");
			},
			root: "Rows",
			beforeprocessing: function(data)
			{
				if (data != null)
				{
					'.$sc.'.totalrecords = data[0].TotalRows;
				}
			}
			'.$this->updateRow.'
		};
		
		var '.$da.' = new $.jqx.dataAdapter('.$sc.', {
			loadError: function(xhr, status, error)
			{
				alert(error);
			}
		}
			);';
		
	return $res;
	}
	public function createFilter() {
		return "updatefilterconditions: function (type, defaultconditions) {
			var stringcomparisonoperators = ['EMPTY', 'NOT_EMPTY', 'CONTAINS', 'CONTAINS_CASE_SENSITIVE',
			'DOES_NOT_CONTAIN', 'DOES_NOT_CONTAIN_CASE_SENSITIVE', 'STARTS_WITH', 'STARTS_WITH_CASE_SENSITIVE',
			'ENDS_WITH', 'ENDS_WITH_CASE_SENSITIVE', 'EQUAL', 'EQUAL_CASE_SENSITIVE', 'NULL', 'NOT_NULL'];
			return stringcomparisonoperators;
		},";
	}
	public function createGrid($paging=TRUE,$height="",$updateRowFunction="") {
		if ($height=="") $height="100%";
		$this->updateRow=$updateRowFunction;
		$customProp=join($this->props,",");
		$pag="";
		
		if ($paging) {
			$pag = 'autoheight: false,
				pageable: true,
				virtualmode: true,
				pagesizeoptions: ["25","30","40", "50", "60"],';
		};
		if ($height != "") $height='height : "'.$height.'",';
		if ($customProp != "") $customProp =  ",".$customProp;
		$res=$this->createDataAdapter();
		$res .= '$("#'.$this->idgrid.'").jqxGrid(
			{		
				width:"100%",
				'.$height.'
				source: '.$this->idgrid.'da,
				theme: "'.$this->factory->widgetTheme.'",
				filterable: true,
				sortable: true,
				altrows: true,
				rendergridrows: function(obj) {return obj.data; },
				'.$pag.'
				columns: ['.join(",",$this->cols).']
				'.$customProp.'
			});';
		
		$this->cols=array();
		$this->props=array();
		echo trim(preg_replace('/\s+/', ' ',$res));
	}
	public function createLinkRenderer($name,$urltarget,$field,$setting) {
		$style='<div style="padding-bottom:2px;margin-left:4px;margin-top:4px">';
		$value="'+value+'";
		$dr="'+datarow.".$field."+'";
		$a='</a></div>';
		$href='<a href="'.$urltarget.'/'.$dr.'" '.$setting.' title="'.$value.'">';
		$html = "var html = '".$style.$href.$value.$a."';";
		
		$res = 'var '.$name.' = function (row, datafield, value) {
			var datarow = $("#'.$this->idgrid.'").jqxGrid("getrowdata", row);';
		$res .= $html.'return html;};';
		echo trim(preg_replace('/\s+/', ' ',$res));
	}
	public function createNumberRenderer($name) {
		$style ='<div style="text-overflow: ellipsis; overflow: hidden; padding-bottom: 2px; text-align: center; margin-top: 5px;">';
		$html = "var html = '".$style."'+x+'</div>';";
		$res = 'var '.$name.' = function (row, datafield, value) {
				var x=value;
				if (x=="0") x= "-";
			'.$html.'
			return html;';
			$res .= '};';
			echo trim(preg_replace('/\s+/', ' ',$res));
		
	}
	public function createUpdateFunction($functionname,$url,$rowdata,$extradata="") {
		$te = explode(",", $rowdata.",");
		$dataku="";
		$td="";
		for ($i=0;$i<count($te);$i++) {
			
			if ($te[$i]!="") $dataku .= '"'.$td.$te[$i].'="+encodeURIComponent(rowdata["'.$te[$i].'"])+';
			$td="&";
		}
		$dataku=rtrim($dataku,"+&");
		if ($extradata != "") $dataku =$dataku."+".$extradata;
		$f= 'var '.$functionname.'=function (rowid, rowdata, commit) {
		 	var dataku= '.$dataku.'; 
		 	
		 	$.ajax({ type: "POST", 
		 		url: "'.$url.'", 
		 		data:dataku, 
		 		success: function(data) { 
		 			
		 			if (data=="-1") { 
		 				commit(false);
		 				bootbox.alert("Update failed, silahkan coba lagi");
		 			} else { 
		 				commit(true); 
		 			} 
		 		}});};';
		echo trim(preg_replace('/\s+/', ' ',$f));
		//echo $f;
		
	}
	public function createDeleteFunction($name,$grid,$url) {
		$f = 'var '.$name.'=function(row) {
				var dataku = $("#'.$grid.'").jqxGrid("getrowdata", row);
				bootbox.confirm("Are you sure?", function(confirmed) {
			                    if (confirmed) {
									$.ajax({ type: "POST", 
								 		url: "'.$url.'", 
								 		data:dataku, 
								 		success: function(data) { 
								 			if (data=="-1") { 
								 				bootbox.alert("Remove failed, silahkan coba lagi");
								 			} else { 
								 				var id = $("#'.$grid.'").jqxGrid("getrowid", row);
								 				$("#'.$grid.'").jqxGrid("deleterow", id );
								 			} 
								 		}});
								};
			                });
			};';
		echo trim(preg_replace('/\s+/', ' ',$f));
	}
	public function createSelectFunction($listener="",$name="",$grid="") {
		if ($name=="") $name="f_select";
		if ($grid=="") $grid="dg";
		if ($listener=="") $listener="onselect";
		$f = 'var '.$name.'=function(row) {
				var dataku = $("#'.$grid.'").jqxGrid("getrowdata", row);
				window.parent.'.$listener.'(dataku);
			};';
		echo trim(preg_replace('/\s+/', ' ',$f));
	}
	protected function changeDateFormat($v) {
		$bl=array("Jan"=>"01","Feb"=>"02","Mar"=>"03","Apr"=>"04","Mei"=>"05","Jun"=>"06","Jul"=>"07","Agust"=>"08","Sep"=>"09","Okt"=>"10","Nop"=>"11","Des"=>"12");
		$s=explode(" ", $v);
		if ((isset($s[2])) && (isset($s[1])) && (isset($s[0])) ) return  $s[2]."-".$bl[$s[1]]."-".$s[0];
		return "1970/01/01";
	}
	public function gridFilter() {
		$where = "";
			
		if (!isset($_GET['filterscount'])) return "";
			
		$filterscount = $_GET['filterscount'];
		if ($filterscount==0) return "";
	
		$where = " (";
		$tmpdatafield = "";
		$tmpfilteroperator = "";
	
		for ($i=0; $i < $filterscount; $i++) {
			// get the filter's value.
			$filtervalue = $_GET["filtervalue" . $i];
			// get the filter's condition.
			$filtercondition = $_GET["filtercondition" . $i];
			// get the filter's column.
			$filterdatafield = $_GET["filterdatafield" . $i];
			// get the filter's operator.
			$filteroperator = $_GET["filteroperator" . $i];
			
			if ($this->datefield != "") {
				
				if (strpos($this->datefield,$filterdatafield) !== false) {
					$filtervalue=$this->changeDateFormat($filtervalue);
					//$filtercondition="GREATER_THAN_OR_EQUAL";
				}
			}
			
			
			if ($tmpdatafield == "")
			{
				$tmpdatafield = $filterdatafield;
			}
			else if ($tmpdatafield <> $filterdatafield)
			{
				$where .= ")AND(";
			}
			else if ($tmpdatafield == $filterdatafield)
			{
				if ($tmpfilteroperator == 0)
				{
					$where .= " AND ";
				}
				else $where .= " OR ";
			}
	
	
			switch($filtercondition) {
				case "NOT_EMPTY":
				case "NOT_NULL": $where .= " " . $filterdatafield . " NOT LIKE '" . "" ."'"; break;
				case "EMPTY":
				case "NULL": $where .= " " . $filterdatafield . " LIKE '" . "" ."'"; break;
				case "CONTAINS_CASE_SENSITIVE": $where .= " BINARY  " . $filterdatafield . " LIKE '%" . $filtervalue ."%'";break;
				case "CONTAINS":$where .= " " . $filterdatafield . " LIKE '%" . $filtervalue ."%'";break;
				case "DOES_NOT_CONTAIN_CASE_SENSITIVE": $where .= " BINARY " . $filterdatafield . " NOT LIKE '%" . $filtervalue ."%'";
				break;
				case "DOES_NOT_CONTAIN": $where .= " " . $filterdatafield . " NOT LIKE '%" . $filtervalue ."%'";
				break;
				case "EQUAL_CASE_SENSITIVE":$where .= " BINARY " . $filterdatafield . " = '" . $filtervalue ."'";
				break;
				case "EQUAL":$where .= " " . $filterdatafield . " = '" . $filtervalue ."'";break;
				case "NOT_EQUAL_CASE_SENSITIVE": $where .= " BINARY " . $filterdatafield . " <> '" . $filtervalue ."'";break;
				case "NOT_EQUAL":$where .= " " . $filterdatafield . " <> '" . $filtervalue ."'";break;
				case "GREATER_THAN":$where .= " " . $filterdatafield . " > '" . $filtervalue ."'";break;
				case "LESS_THAN":$where .= " " . $filterdatafield . " < '" . $filtervalue ."'";break;
				case "GREATER_THAN_OR_EQUAL":$where .= " " . $filterdatafield . " >= '" . $filtervalue ."'";break;
				case "LESS_THAN_OR_EQUAL":$where .= " " . $filterdatafield . " <= '" . $filtervalue ."'";break;
				case "STARTS_WITH_CASE_SENSITIVE":$where .= " BINARY " . $filterdatafield . " LIKE '" . $filtervalue ."%'";break;
				case "STARTS_WITH":$where .= " " . $filterdatafield . " LIKE '" . $filtervalue ."%'";break;
				case "ENDS_WITH_CASE_SENSITIVE":$where .= " BINARY " . $filterdatafield . " LIKE '%" . $filtervalue ."'";break;
				case "ENDS_WITH":$where .= " " . $filterdatafield . " LIKE '%" . $filtervalue ."'";break;
			}
	
			if ($i == $filterscount - 1) $where .= ")";
			$tmpfilteroperator = $filteroperator;
			$tmpdatafield = $filterdatafield;
		}
		//echo $where;
		return $where;
	}
	
	public function gridLimit() {
		$pagenum = $_GET['pagenum'];
		$pagesize = $_GET['pagesize'];
		$start = $pagenum * $pagesize;
		return $start.",".$pagesize;
	}
	
	public function gridOrder() {
			
		if (!isset($_GET['sortdatafield'])) return "";
			
		$sortfield = $_GET['sortdatafield'];
		$sortorder = $_GET['sortorder'];
	
		return $sortfield." ".strtoupper($sortorder);
	}
	public function createLocalization($fnname="getLocalization") {
		$f= ' var '.$fnname.' = function () {
                var localizationobj = {};
                localizationobj.firstDay = 1;
                localizationobj.percentsymbol = "%";
                localizationobj.currencysymbol = "Rp ";
                localizationobj.currencysymbolposition = "before";
                localizationobj.decimalseparator = ",";
                localizationobj.thousandsseparator = ".";
                var days = {
                   names: ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"],
                   namesAbbr: ["Minggu","Sen","Sel","Rabu","Kamis","Jumat","Sabtu"],
                   namesShort: ["M","S","S","R","K","J","S"]
                };
                localizationobj.days = days;
                var months = {
                   names: ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","Nopember","Desember",""],
                   namesAbbr: ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agust","Sep","Okt","Nop","Des",""]
                };
                var patterns = {
                    d: "dd/MM/yyyy",
                    D: "dd MMMM yyyy",
                    t: "HH:mm",
                    T: "HH:mm:ss",
                    f: "dddd, d. MMMM yyyy HH:mm",
                    F: "dddd, d. MMMM yyyy HH:mm:ss",
                    M: "dd MMMM",
                    Y: "MMMM yyyy"
                }
                localizationobj.patterns = patterns;
                localizationobj.months = months;
                return localizationobj;
            };';
		//echo trim(preg_replace('/\s+/', ' ',$f));
		echo $f;
	}
	
}