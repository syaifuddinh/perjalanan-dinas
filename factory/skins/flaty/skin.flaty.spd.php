<!DOCTYPE html>
<?php $this->factory->Skins->loadLayout("head");?>
<link rel="shortcut icon" href="<?php echo URL_ASSETS?>logo.png">
<body>

<!--[if lt IE 7]>
<p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
<![endif]-->
<?php $this->factory->Skins->loadLayout("body.skinsetting");?>
<?php $this->factory->Skins->loadLayout("body.top.navbar.spd");?>

<div class="container-fluid" id="main-container">
	<div id="sidebar" class="nav-collapse">
	<div id="sidebar-collapse" class="visible-desktop" style="padding-top: 20px">
		<i class="icon-double-angle-left"></i>
	</div>
	<ul class="nav nav-list">
	
	<?php echo $this->factory->menu ;?>
	</ul>
	</div>
	<div id="main-content">
		<?php $this->factory->Utils->html->nojs();?>
		<?php $this->factory->Skins->loadLayout("body.top.pagetitle");?>
		<?php $this->factory->Units->loadContentUI(); ?>
		<footer>
			<p style="line-height:0.9"><small><strong>Copyright 2013. Didin and friends/</strong></small></p>
			<p><small><?php echo $this->factory->Utils->general->copyright(); ?></small></p>
		</footer>
		
		<a id="btn-scrollup" class="btn btn-circle btn-large" href="#"><i class="icon-chevron-up"></i></a>
	</div>
	
</div>

<script type="text/javascript">
<?php $this->factory->Units->loadContentJSVar(); /*js Variabel declaration */ ?>
<?php $this->factory->Units->loadContentJS(); /*js CUSTOM */?>	
</script>
</body>
</html>