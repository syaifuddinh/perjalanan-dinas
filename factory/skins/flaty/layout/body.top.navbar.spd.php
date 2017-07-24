<div id="navbar" class="navbar navbar-fixed">
	<div class="navbar-inner">
		<div class="container-fluid">
			<a href="#" class="brand"><small><?php echo APP_LOGO?></small></a>
			<a href="#" class="btn-navbar collapsed" data-toggle="collapse" data-target=".nav-collapse"><i class="icon-reorder"></i></a>
			<?php if ($this->factory->Utils->session->getSession("LOGIN")=="1") { ?>
			<ul class="nav flaty-nav pull-right">
				<li class="user-profile">
					<a data-toggle="dropdown" href="#" class="user-menu dropdown-toggle">
						<!-- <img class="nav-user-photo" src="img/demo/avatar/avatar1.jpg" alt="Penny's Photo" /> -->
						<span class="hidden-phone" id="user_info"><?php echo $this->factory->Utils->session->getSession("JS5_REAL_NAME")?></span>
						<i class="icon-caret-down"></i>
					</a>
					<ul class="dropdown-menu dropdown-navbar" id="user_menu">
						<li class="nav-header"><i class="icon-time"></i>Logined From <?php echo date("H:i", $this->factory->Utils->session->getSession("STV_LOGIN_TIME"))?></li>
						<li class="divider visible-phone"></li>
						<li class="divider"></li>
						<li><a href="<?php echo $this->factory->Utils->general->getService('auth','logoff','sadd');?>"><i class="icon-off"></i>Logout</a></li>
					</ul>
				</li>
			</ul>
			<?php } else {?>
				<a href="<?echo $this->factory->Utils->general->getHref("auth");?>" class="btn btn-primary pull-right"><small>Login</small></a>
			<?php }?>
		</div>
	</div>
</div>