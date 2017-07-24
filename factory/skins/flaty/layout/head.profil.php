<!--[if lt IE 7]>  <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]> <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]> <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>Sativa - Sistem Informasi Sekolah V.5.0 </title>
<meta name="description" content="">
<meta name="viewport" content="width=device-width"><!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
<link rel="shortcut icon" href="<?php echo $this->factory->Skins->url_img?>mylogo.png">
<?php 
	$this->factory->Skins->loadLayout("cssmain");
	$this->factory->Skins->loadCSSPlugins(); /*Additional CSS */
	$this->factory->Skins->loadCSSWidgets(); /*Additional CSS */
	
	$this->factory->requiredJS="jquery/jquery-1.10.2.min.js,jquery/jquery-live.js,modernizr/modernizr-2.6.2.min.js,bootstrap/bootstrap.min.js";
	$this->factory->Skins->getJS($this->factory->requiredJS,"plugins"); /*required js lib */
	$this->factory->Skins->loadJSPlugins("plugins"); /*JS plugins */
	if ($this->factory->Widgets != "") $this->factory->Skins->loadWidgetPlugins(); /*Widgets plugins */
?>
<script type="text/javascript">
var cookie_not_handle_user_settings = true;
</script>
	<?php $this->factory->Skins->getJS("flaty.js"); /*COMMON JS FUNCTION */
?>
</head>