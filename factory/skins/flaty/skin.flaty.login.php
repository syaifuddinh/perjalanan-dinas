<!DOCTYPE html>
<!--[if lt IE 7]>  <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]> <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]> <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>Login :: <?php echo APP_TITLE?></title>
<meta name="description" content="">
<meta name="viewport" content="width=device-width"><!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
<?php 
	$this->factory->Skins->loadLayout("cssmain");
	$this->factory->Skins->loadCSSWidgets(); /*Additional CSS */
	$this->factory->requiredJS="jquery/jquery-1.10.1.min.js,modernizr/modernizr-2.6.2.min.js,bootstrap/bootstrap.min.js";
	$this->factory->Skins->getJS($this->factory->requiredJS,"plugins"); /*required js lib */
	$this->factory->Skins->loadJSPlugins("plugins"); /*JS plugins */
	if ($this->factory->Widgets != "") $this->factory->Skins->loadWidgetPlugins(); /*Widgets plugins */
?>
</head>
<body class="login-page">
	<!--[if lt IE 7]>
	<p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
	<![endif]-->
	
	<?php $this->factory->Units->loadContentUI(); ?>
	<script type="text/javascript">
	<?php $this->factory->Units->loadContentJSVar(); /*js Variabel declaration */ ?>
	<?php $this->factory->Units->loadContentJS(); /*js CUSTOM */?>	
	</script>
</body>
</html>