<?php
class jquery {
	public function createDataTable($id) {
		$f='$("#'.$id.'").dataTable(
			{aLengthMenu:[[10,15,25,30,50,100,-1],[10,15,25,30,50,100,"All"]],
			iDisplayLength:30,
			oLanguage:{sLengthMenu:"_MENU_ Records per page",sInfo:"_START_ - _END_ of _TOTAL_",sInfoEmpty:"0 - 0 of 0",oPaginate:{sPrevious:"Prev",sNext:"Next"}}
			});';
		echo trim(preg_replace('/\s+/', ' ',$f));
	}
}