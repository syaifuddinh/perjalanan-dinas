<?php
	class html{
		var $factory;
		var $activeMenu;
		public function __construct() {
			$this->factory=mainFactory::getInstance();
		}
		
		private function newline() {
			return chr(10);
		}
		public function HTMLtag() {
			echo '<!DOCTYPE HTML>'.$this->newline().'<html lang="en-US">'.$this->newline();
		}
		public function HTMLEnd() {
			echo $this->newline().'</html>';
		}	
	

		public function getChild($data, $parents = 0) {
			$this->activeMenu =  $this->factory->Utils->general->getCurrentURL();
			static $i = 1;
			$html='';
			
			if (isset($data[$parents])) {
				if ($parents !== 0 ) $html = '<ul class="submenu" style="display:block">';
				$i++;
				$f=0;
				foreach ($data[$parents] as $v) {
					$f++;
					$child = $this->getChild($data, $v["id"]);
					$c="";
					$a="";
					if ($v["cmd"]==$this->activeMenu) $a='class="active"';
					$lk=$this->factory->Utils->general->getHref($v["cmd"]);
					
					if ($v["cmd"]=="#") $c='class="dropdown-toggle"';
					$tg="";
					if (isset($v["target"])) $tg='target="'.$v['target'].'"';
					$html .='<li '.$a.'>';
					$html .= '<a id="m'.$v["id"].'" href="'.$lk.'" '.$tg.' '.$c.'>';
					if ($v["cmd"]=="#") $html .= '<b class="arrow icon-angle-down"></b>';
					if ($parents == 0) {
						$html .= '<i class="icon-'.$v["icone"].'"></i><span>'.$v["nama"].'</span></a>';
					} else {
						$html .= $v["nama"].'</a>';
					}
					if ($child) {
						$i--;
						$html .= $child;
							
					}
					$html .= '</li>';
				}
				if ($parents !== 0 ) $html .= "</ul>";
				return $html;
			} else {
				return false;
			}
		}
		public function getChildHorizontal($data, $parents = 0) {
			$this->activeMenu =  $this->factory->Utils->general->getCurrentURL();
			static $i = 1;
			$html='';
				
			if (isset($data[$parents])) {
				if ($parents !== 0 ) $html = '<ul class="dropdown-menu dropdown-navbar">';
				$i++;
				$f=0;
				foreach ($data[$parents] as $v) {
					$f++;
					$child = $this->getChildHorizontal($data, $v["id"]);
					$c="";
					$a="";
					if ($v["cmd"]==$this->activeMenu) $a='class="active"';
					$lk=$this->factory->Utils->general->getHref($v["cmd"]);
						
					if ($v["cmd"]=="#") $c='class="dropdown-toggle"';
					$tg="";
					if (isset($v["target"])) $tg='target="'.$v['target'].'"';
					$html .='<li '.$a.'>';
				
					$html .= '<a id="m'.$v["id"].'" href="'.$lk.'" '.$tg.' '.$c.'>';
					
					if ($parents == 0) {
						$html .= '<i class="icon-'.$v["icone"].'"></i><span>'.$v["nama"].'</span>';
						if ($v["cmd"]=="#") $html .= '<b class="arrow icon-angle-down"></b>';
						$html .= '</a>';
					} else {
						$html .= $v["nama"].'</a>';
					}
					if ($child) {
						$i--;
						$html .= $child;
							
					}
					$html .= '</li>';
				}
				if ($parents !== 0 ) $html .= "</ul>";
				return $html;
			} else {
				return false;
			}
		}
		public function createNavigation() {
			
			$menus = $this->factory->DB->readAll("sys_app","","id_top,seq","role='".$this->factory->Utils->session->getSession("JS5_HAK")."'");
			$data=array();
			foreach ($menus as $row) {
				if ($row["id_top"] == 0) {
					$data[0][] = $row;
				} else {
					$data[$row["id_top"]][] = $row;
				}
					
			}
			$this->factory->mainMenu = $this->getChild($data,0);
			return true;
		}
		public function nojs() {
			echo '<noscript>
			<pre>
			For full functionality of this site it is necessary to enable JavaScript. Here are the
			<a href="http://www.enable-javascript.com/" target="_blank">instructions how to enable JavaScript in your web browser</a>.
			</pre>
			</noscript>';
		}
	}
	
?>