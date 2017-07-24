$(document).ready(function () {
          $('#form-login').jqxValidator({
           	hintType: 'label',
             rules: [
                   { input: '#login_name', message: 'Username is required!', action: 'keyup, blur', rule: 'required' },
                   { input: '#login_password', message: 'Password is required!', action: 'keyup, blur', rule: 'required' }],
             theme: theme
            });
          
          $('#sendButton').on('click', function () {
            	if ($('#form-login').jqxValidator('validate')) {
            		
            		$.ajax({
					   type: "POST",
					   url: urlCheck,
					   data: $("#form-login").serialize(),
					   success: function(data) {
					   		if (data =="-1") {
					   			bootbox.alert("<h3>Invalid User Name or Password</h3>");
							} else {
								window.location.reload();
							}
							
						}
					});
            	};
                return false;
            });
               
});