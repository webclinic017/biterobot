$(window, document).ready(function() {

    checkSession();

    $('.input').blur(function() {
      var $this = $(this);
      if ($this.val())
        $this.addClass('used');
      else
        $this.removeClass('used');
    });

    $('#confirmsignup').on('click', function () {
        let formData = new FormData(document.getElementById('signup-form'));
        let object = {};
        formData.forEach((value, key) => object[key] = value);
        let blob = JSON.stringify(object);

        fetch (server_url + auth_url + 'users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: blob
        })
            .then(res => {
                if (res.status >= 200 && res.status <= 300) {
                    alert('I was too lazy to create one more modal window. So you are successfully registered!');
                } else {
                    let error = new Error(res.statusText);
                    error.response = res;
                    throw error
                }
            })
            /*.then(res => {
                if (res.headers.get('Content-Type') !== 'application/json') {
                    let error = new Error('Incorrect server response');
                    error.response = res;
                    throw error
                }
                return res;
            })*/
            .catch(e => {
                showErrorMsg('Failed to sign up. Please try again later.', 'register-error-msg');
            })
    });

    $('#signin-btn').on('click', function () {
        let formData = new FormData(document.getElementById('signin-form'));
        let object = {};
        formData.forEach((value, key) => object[key] = value);
        let blob = JSON.stringify(object);

        fetch (server_url + auth_url + 'token/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: blob
        })
            .then(res => {
                if (res.status >= 200 && res.status <= 300) {
                    return res;
                } else {
                    let error = new Error(res.statusText);
                    error.response = res;
                    throw error
                }
            })
            /*.then(res => {
                if (res.headers.get('Content-Type') !== 'application/json') {
                    let error = new Error('Incorrect server response');
                    error.response = res;
                    throw error
                }
                return res;
            })*/
            .then(res => {
                return res.json();
            })
            .then(res => {
                try {
                    document.cookie = "session_id=" + res.auth_token + '; samesite';
                    document.location.reload();
                } catch (e) {
                    showErrorMsg(res.non_field_errors, 'login-error-msg');
                }

                //console.log('Tickers updated');
            })
            .catch(e => {
                showErrorMsg('Failed to sign up. Please try again later.', 'login-error-msg');
            })
    });

    $('#tab1').on('click' , function(){
        $('#tab1').addClass('login-shadow');
        $('#tab1').addClass('active');
        $('#tab2').removeClass('signup-shadow');
        $('#tab2').removeClass('active');
    });

    $('#tab2').on('click' , function(){
        $('#tab2').addClass('signup-shadow');
        $('#tab2').addClass('active')
        $('#tab1').removeClass('login-shadow');
        $('#tab1').removeClass('active');
    });

});

function checkSession() {
    if (getCookie('session_id') !== undefined/* && getCookie('session_id') !== ''*/) {
        document.getElementById('user-var').innerHTML = '<li>\n' +
        '    <div class="nav-item dropdown" id="user-profile" style="align-items: center">\n' +
        '        <img src="../static/biterobot/images/icons/user.svg" style="height: 2.5rem; width: 2.5rem" class="nav-link link dropdown-toggle display-4"\n' +
        '            data-toggle="dropdown-submenu" aria-expanded="false">\n' +
        '        <div class="dropdown-menu">\n' +
        '            <a class="text-white text-primary dropdown-item display-4" href="#">Profile</a>\n' +
        '            <button class="btn btn-primary dropdown-item display-4" style="margin-bottom: 5px; align-self: center" id="logout-btn">\n' +
        '                Logout\n' +
        '            </button>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</li>';
        $('#logout-btn').on('click', function () {
            fetch (server_url + auth_url + 'token/logout/', {
                method: 'POST',
                headers: {
                    'token': getCookie('session_id')
                }
            })
                .then(res => {
                    if (res.status >= 200 && res.status <= 300) {
                        deleteCookie('session_id');
                        document.location.reload();
                    } else {
                        let error = new Error(res.statusText);
                        error.response = res;
                        throw error
                    }
                })
                .catch(e => {
                    deleteCookie('session_id');
                    document.location.reload();
                });
        });
    } else {
        document.getElementById('user-var').innerHTML = '<li class="nav-btn" id="user-log-sign">\n' +
        '    <button class="btn btn-primary login-btn" href="#singup"\n' +
        '        data-toggle="modal" data-target=".log-sign">\n' +
        '        Sign in/Register\n' +
        '    </button>\n' +
        '</li>';
    }
}





