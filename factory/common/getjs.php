<?php
	
	if (!isset($_GET['f'])) die();
	$fold="";
	if (isset($_GET['fd'])) $fold=base64_decode(base64_decode($_GET["fd"])).DIRECTORY_SEPARATOR;
	//$BASEPATH= str_replace("grido".DIRECTORY_SEPARATOR."common","",realpath(dirname(__FILE__)));
	//include $BASEPATH."config.php";
	//include $BASEPATH.DIR_FACTORY.DIRECTORY_SEPARATOR."sysconfig.php";
	//include "../../config.php";
	//include "../sysconfig.php";
	$cache 	  = true;
	//$cachedir = DIR_CACHE;
	$cachedir = "../cache/";
	$base=base64_decode(base64_decode($_GET["pt"]));
	$base =$base.$fold;
	$type = 'javascript';
	
	$files=base64_decode(base64_decode($_GET['f']));
	
	$files=str_replace("/",DIRECTORY_SEPARATOR,$files);
	
	//echo '<p>'.$base.'</p>';
	//echo '<p>'.$files.'</p>';
	//die();
	
	$elements = explode(',', $files);
	
	// Determine last modification date of the files
	$lastmodified = 0;
	while (list(,$element) = each($elements)) {
		$path = $base . $element;
		
		if ($type == 'javascript' && substr($path, -3) != '.js')  {
			header ("HTTP/1.0 403 Forbidden");
			exit;	
		}
	
		$lastmodified = max($lastmodified, filemtime($path));
	}
	
	// Send Etag hash
	$hash = $lastmodified . '-' . md5($files);
	header ("Etag: \"" . $hash . "\"");
	
	if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && 
		stripslashes($_SERVER['HTTP_IF_NONE_MATCH']) == '"' . $hash . '"') 
	{
		// Return visit and no modifications, so do not send anything
		header ("HTTP/1.0 304 Not Modified");
		header ('Content-Length: 0');
	} 
	else 
	{
		// First time visit or files were modified
		if ($cache) 
		{
			
			$encoding="none";
			
			// Try the cache first to see if the combined files were already generated
			$cachefile = 'cache-' . $hash . '.' . $type . ($encoding != 'none' ? '.' . $encoding : '');
			
			if (file_exists($cachedir . '/' . $cachefile)) {
				if ($fp = fopen($cachedir . '/' . $cachefile, 'rb')) {

					if ($encoding != 'none') {
						header ("Content-Encoding: " . $encoding);
					}
				
					header ("Content-Type: text/" . $type);
					header ("Content-Length: " . filesize($cachedir . '/' . $cachefile));
		
					fpassthru($fp);
					fclose($fp);
					exit;
				}
			}
		}
	
		// Get contents of the files
		$contents = '';
		reset($elements);
		while (list(,$element) = each($elements)) {
			$path = realpath($base . '/' . $element);
			$contents .= "\n\n" . file_get_contents($path);
		}
	
		// Send Content-Type
		header ("Content-Type: text/" . $type);
		
		if (isset($encoding) && $encoding != 'none') 
		{
			// Send compressed contents
			$contents = gzencode($contents, 9, $gzip ? FORCE_GZIP : FORCE_DEFLATE);
			header ("Content-Encoding: " . $encoding);
			header ('Content-Length: ' . strlen($contents));
			echo $contents;
		} 
		else 
		{
			// Send regular contents
			header ('Content-Length: ' . strlen($contents));
			echo $contents;
		}

		// Store cache
		if ($cache) {
			//echo $cachedir;
			if ($fp = fopen($cachedir . DIRECTORY_SEPARATOR . $cachefile, 'wb')) {
				fwrite($fp, $contents);
				fclose($fp);
			}
		}
	}
?>