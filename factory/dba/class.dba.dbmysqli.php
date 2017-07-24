<?php
class dbmysqli{

	private  $_myconn;	
	public $rows=array();
	public $tesID;
	public $DBLOG=FALSE;
	var $database;
public function __construct(){
	
}
public function __destruct(){
	$this->close();
}

public function connect($host="",$user="",$pass="",$database=""){
	if (!isset($this->_myconn)) {
		$this->database=$database;
		$this->_myconn = new mysqli($host,$user,$pass,$database);
		if($this->_myconn->connect_errno > 0) return false;
		$this->tesID=time();
	}
	return true;
}

public function getConnection() {
	return $this->_myconn;
}
public function close(){
	if (isset($this->_myconn)) {
		$this->_myconn->close();
		unset($this->_myconn);
	}
}
public function setConnection($conn) {
	$this->_myconn=$conn;
	return true;
}
public function escape($string){
	return $this->_myconn->real_escape_string($string);
}

protected function writeLog($stat) {
	if ($this->DBLOG) $this->_myconn->query("insert into stvlog(msg) values('".$this->escape($stat)."')");
	return true;
}
protected function sanitizeInput($stat,$input=array()) {
	if(sizeof($input)!=0){
		$input2 = array();
		foreach($input AS $input1){
			$input2[$i] = $this->escape($input1);
			$i++;
		}
		$stat = vsprintf($stat,$input2);
	}
	return $stat;
}
/*tambahan otomatis sanitizing input */
/*sample : setQuery("select * from anu where fd='%s' and tt='%s'",true,array("unsanitize param1","unsanitize param2"))*/
public function setQuery($stat,$getAllRow=true,$input=array()) {
	//$stmt=$this->_myconn->prepare($stat);
	
	$stat=$this->sanitizeInput($stat,$input);
	
	$result = $this->_myconn->query($stat);
	$this->rows=array();
	if ($result){
		if ($getAllRow) {
			if (method_exists('mysqli_result', 'fetch_all'))  {
				$this->rows= $result->fetch_all(MYSQLI_ASSOC);
			} else {
				# Compatibility layer with PHP < 5.3
				while ($row = $result->fetch_assoc()) {
					$this->rows[]=$row;
				}
			}
			
		} else {
			$this->rows = $result->fetch_assoc();
		}
		
		$result->free();
		return $this->rows;
	} else {
		$this->writeLog($stat);
		return -1;
	}
}

public function setNonQuery($stat,$input=array()) {
	$stat=$this->sanitizeInput($stat,$input);
	$result = $this->_myconn->query($stat);
	
	if (!$result) {
		$this->writeLog($stat);
		return "-1";
	} else {
		return true;
	}

}

public function getRecordset($sqlstat,$JSON=false) {
	
	if ($this->setQuery($sqlstat) !== -1) {
		if (!$JSON) {
			return $this->rows;
		} else {
			return  '{"rows":'.json_encode($this->rows).'}';
		}
	} else {
		return false;
	}
	
	
}


public function insert($table, $data){
	$q="INSERT INTO `$table` ";
	$v=''; $n='';

	foreach($data as $key=>$val){
		if ($val !== "#ignore") {
			$n.="`$key`, ";
			if ($key=="passwd") {
				$v .= "PASSWORD('".$this->escape($val)."'), ";
			} else {
				if ($val != "CURRENT_TIMESTAMP") {
					$v .= "'".$this->escape($val)."', ";
				} else {
					$v .= $val.", ";
				}
			}
			
			
		}
		
	}

	$q .= "(". rtrim($n, ', ') .") VALUES (". rtrim($v, ', ') .");";
	
	return $this->setNonQuery($q); 
}
public function update($table, $data,$where){
	$q="UPDATE `$table` SET ";
	

	foreach($data as $key=>$val){
		if ($val != "#ignore") 	{
			if ($val != "CURRENT_TIMESTAMP") {
				if ($key=="passwd") {
					$q .= $key."= PASSWORD('".$this->escape($val)."'), ";
				} else {
					$q .= $key."= '".$this->escape($val)."', ";
				}
				
			} else {
				$q .= $key."= ".$val.", ";
			}
			
		}
	}

	$q = rtrim($q, ', ')." where ".$where;
	
	return $this->setNonQuery($q);
}

public function readAll($tb="",$field="",$order="",$where="",$limit="",$JSON=false) {
	if ($tb=="") $tb=get_class($this);
	if ($where != "") $where = "Where ".$where;
	if ($order != "") $order = "Order by ".$order;
	if ($field == "") $field = "*";
	if ($limit != "") $limit = "Limit ".$limit;
	return $this->getRecordset("select ".$field." from ".$tb." ".$where." ".$order." ".$limit,$JSON);
}
public function getCount($table,$criteria,$aggr="count(*)") {
	$sql="select ".$aggr." as total from ".$table." where ".$criteria;
	$res=$this->setQuery($sql,false);
	if ($res) return $res["total"];
	return 0;
}
public function isRecordExist($table,$criteria) {
	$sql="select count(*) as total from ".$table." where ".$criteria;
	$res=$this->setQuery($sql,false);
	if ($res) return $res["total"] ==0 ? FALSE : TRUE;
	return FALSE;
}
public function getFoundRows() {
	$this->setQuery("SELECT FOUND_ROWS() AS `found_rows`",false);
	return $this->rows["found_rows"];
}
}
?>
