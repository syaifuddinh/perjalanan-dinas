<?php
class dbmysql{

	// debug flag for showing error messages
	public $DBLOG=FALSE;
	public  $rows=array();
	
	public	$link_id;
	private	$query_id = 0;
	

#-#############################################
# desc: constructor
public function __construct(){
	
}
public function __destruct(){
	$this->close();
}

public function connect($host="",$user="",$pass="",$database=""){
	if (!isset($this->link_id)) {
		$this->link_id=@mysql_pconnect($host,$user,$pass);
		if ($this->link_id) @mysql_select_db($database, $this->link_id);
	}
	
	return true;
	
}




public function close(){
	//echo $this->link_id;
	@mysql_close($this->link_id);
}#-#close()

public function escape($string){
	if (!get_magic_quotes_gpc()) {
			return addslashes($string);
		} else {
			return $string;
		}
}

protected function writeLog($stat) {
	if ($this->DBLOG) $this->_myconn->query("insert into stvlog(msg) values('".$this->escape($stat)."')");
	return true;
}

public function setQuery($stat,$getAllRow=true) {
	
	$this->connect();
	$this->query_id = @mysql_query($stat, $this->link_id);
	$this->rows=array();
	if ($this->query_id){
				if ($getAllRow==true) {
					while ($row=mysql_fetch_array($this->query_id)) {
						$this->rows[]=$row;
					}
					$this->free_result($this->query_id);
					return $this->rows;
					
				} else {
					$this->rows= @mysql_result($this->query_id, 0);
					return $this->rows;
				}
	} else {
		$this->writeLog($stat);
		return -1;
	}
}

public function setNonQuery($stat) {
	$this->connect();
	$this->query_id = @mysql_query($stat, $this->link_id);
	if ($this->query_id=="") {
		$this->writeLog($stat);
		return "-1";
	} else {
		return true;
	}
	
}
public function getRecordset($sqlstat,$JSON=false) {
	$sqlstat=strtolower($sqlstat);
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
	//var_dump($this->rows);
	
	return $this->rows["found_rows"];
}

private function free_result($query_id=-1){
	if ($query_id!=-1){
		$this->query_id=$query_id;
	}
	@mysql_free_result($this->query_id);
}
}
?>