<?php
class container {
	public function __construct() {
	  		
	}
	
	public function boxOpen($boxTitle="",$boxWidth="4",$closeButton=false,$colapse=false,$height="0",$color="",$icon="icon-desktop",$boxtool="") {
		$c="";
		$cl="";
		$ch="up";
		$ns="";
		
		if ($height != "0") {
			$height=' style="height: '.$height.'px"';
			$ns=' nice-scroll';
			$colapse=false;
		} else {
			$height="";
		}
		if ($color !="") $color = "box-".$color;
		if ($closeButton) $c='<a data-action="close" href="#"><i class="icon-remove"></i></a>';
		if ($colapse) {
			$cl=' style="display:none"';
			$ch="down";
		}
		if ($icon!="") $icon='<i class="'.$icon.'"></i> ';
		echo '<div class="span'.$boxWidth.'">
				<div class="box '.$color.'">
					<div class="box-title">
						<h3>'.$icon.$boxTitle.'</h3>
						<div class="box-tool">
							'.$boxtool.'
							<a data-action="collapse" href="#"><i class="icon-chevron-'.$ch.'"></i></a>
							'.$c.'
						</div>
					</div>
					<div class="box-content '.$ns.'"'.$cl.$height.'>';
	}
	public function boxClose() {
		echo '</div></div></div>';
	}
	public function boxTabOpen($boxTitle="",$boxWidth="4",$tabTitle="",$color="",$icon="icon-folder-close") {
		$c=explode("|", $tabTitle);
		$tt="";
		$ak=' class="active"';
		for ($t=0;$t<count($c);$t++) {
			$tt .= '<li'.$ak.'><a href="#'.strtolower(str_replace(" ","-",$c[$t])).'" data-toggle="tab">'.$c[$t].'</a></li>';
			$ak="";
			
		}
		if ($color !="") $color = "box-".$color;
		echo '<div class="span'.$boxWidth.'">
				<div class="box '.$color.'">
					<div class="box-title">
						<h3><i class="'.$icon.'"></i> '.$boxTitle.'</h3>
						<div class="box-tool">
							<a data-action="collapse" href="#"><i class="icon-chevron-up"></i></a>
						</div>
						<ul class="nav nav-tabs">
						'.$tt.'
						</ul>
					</div>
					<div class="box-content">
						<div class="tab-content">';
	}
	public function boxTabClose() {
		echo '</div></div></div></div>';
	}
	public function boxAlert($judul,$msg,$tipe="success") {
		echo '<div class="alert alert-'.$tipe.'">
<button class="close" data-dismiss="alert">&times;</button>
<h4>'.$judul.'</h4>
<p>'.$msg.'</p>
</div>';
	}
}
?>