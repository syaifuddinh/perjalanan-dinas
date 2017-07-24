<?php
class files {
	public function __construct(){
		
	}
	
	public function rmdirr($dirname)
	{
    	// Sanity check
    	if (!file_exists($dirname)) {
        	return false;
    	}
  
	    // Simple delete for a file
	    if (is_file($dirname) || is_link($dirname)) {
	        return unlink($dirname);
	    }
  
	    // Loop through the folder
	    $dir = dir($dirname);
	    while (false !== $entry = $dir->read()) {
	        // Skip pointers
	        if ($entry == '.' || $entry == '..') {
	            continue;
	        }
	  
	        // Recurse
	        $this->rmdirr($dirname . DIRECTORY_SEPARATOR . $entry);
	    }
  
    	// Clean up
    	$dir->close();
    	return rmdir($dirname);
	}
}