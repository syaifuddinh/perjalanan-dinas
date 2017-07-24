<!DOCTYPE html>
<?php $this->factory->Skins->loadLayout("head.profil");?>
<body class="skin-<?php echo $this->factory->warna?>">
<!--[if lt IE 7]>
<p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
<![endif]-->
<?php $this->factory->Utils->html->nojs();?>
<div class="container-fluid" id="main-container">
	
	<div id="main-content" style="padding:10px;margin-left:0px">
		<?php $this->factory->Skins->loadLayout("body.top.pagetitle");?>
		<?php $this->factory->Units->loadContentUI(); ?>
		<a id="btn-scrollup" class="btn btn-circle btn-large" href="#"><i class="icon-chevron-up"></i></a>
	</div>
</div>
<script type="text/javascript">
<?php $this->factory->Units->loadContentJSVar(); /*js Variabel declaration */ ?>
<?php $this->factory->Units->loadContentJS(); /*js CUSTOM */?>	
</script>
</body>
</html>