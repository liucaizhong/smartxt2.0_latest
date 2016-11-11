
$(document).ready(function() {
	$('#form-login').submit(function(e) {
        e.preventDefault();

        var $account = $('#account');
        var $password = $('#password');
        var rememberMe = document.getElementById('rememberMe').checked;

        if(!$account.val() || !$password.val()) {
        	$(".login-content").removeClass('shake_effect');  
			setTimeout(function()
			{
			 $(".login-content").addClass('shake_effect')
			},1); 
			return;
		}

		//post
		//username+password
		$.StandardPost('/login', {
			username: $account.val(),
			password: $password.val(),
            remember: rememberMe
		});

    });

    $('#form-login').keydown(function(e) {
    	var keycode = e.keyCode;
    	if(keycode == 13) {
    		$('#form-login').submit();
    	}
    });

    if(window.error && window.error != '[]') {
    	var error = window.error;
    	delete window.error;
    	error = error.replace(/&quot;/g,'"');
    	error = JSON.parse(error)[0];

    	if(0 == error.message) {
    		$('#account-err').show();
    		$('#password-err').hide();
    	}
    	if(1 == error.message) {
    		$('#account-err').hide();
    		$('#password-err').show();
    	}

    	var user = window.user;
    	delete window.user;
    	user = user.replace(/&quot;/g,'"');
    	user = JSON.parse(user);

    	$('#account').val(user.username);
    	$('#password').val(user.password);

    	$(".login-content").removeClass('shake_effect');  
		setTimeout(function()
		{
			$(".login-content").addClass('shake_effect')
		},1); 

        console.log('user', user);
        console.log('error', error);
    }

    $('#account').on('input propertychange', function(e) {
		$('#account-err').hide();
    });

    $('#password').on('input propertychange', function(e) {
		$('#password-err').hide();
    });
});

function rememberMe(e) {
	e.stopPropagation();
	if(e.target.tagName == 'A') {	
		var check = document.getElementById('rememberMe');
		if(check.checked) {
			check.checked = false;
		} else {
			check.checked = true;
		}
	}
}