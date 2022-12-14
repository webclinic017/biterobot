var server_url = '/';
var strat_url = 'strategyManager/';//for strategies
var data_url = 'dataManager/'; //for data
var test_url = 'testManager/'; //for testing
var auth_url = 'auth/'; // for login/logout/register
//var server_url = 'https://biterobot-smxpln76pq-ez.a.run.app/'
//var server_url = 'https://a51d6b62-1920-45e4-b298-e0c28a5e20f9.mock.pstmn.io/';


/** Set user token for testing **/
function setToken() {
    document.cookie = "token=" + document.getElementById('token').value + '; samesite';

    if (getCookie('token') !== undefined && getCookie('token') !== '') {
        document.getElementById('token').style.backgroundColor = "#89ff7f";
        document.getElementById('token').value = getCookie('token');
    } else {
        document.getElementById('token').style.backgroundColor = "white";
    }
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {

  options = {
    /*path: '/',*/
    // при необходимости добавьте другие значения по умолчанию
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    console.log(updatedCookie);
  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }
  console.log(updatedCookie);
  document.cookie = updatedCookie;
}

function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  })
}

/** Restriction for dates **/
function setMinDate () {
    let dtbegin = document.getElementById("date_begin");
    let dtend = document.getElementById("date_end");
    if (dtbegin.value !== '') {
        dtend.setAttribute("min", dtbegin.value);
    } else {
        dtend.removeAttribute("min");
    }
}

function setMaxDate () {
    let dtbegin = document.getElementById("date_begin");
    let dtend = document.getElementById("date_end");
    if (dtend.value !== '') {
        dtbegin.setAttribute("max", dtend.value);
    } else {
        dtbegin.removeAttribute("max");
    }
}

function setMaxSysDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    document.getElementById("date_begin").setAttribute("max", today);
    document.getElementById("date_end").setAttribute("max", today);
}

function showEmptyField(field) {
    field.style.backgroundColor = "#ff3535";
    setTimeout(function () {
        field.style.backgroundColor = "white";
    },3000);
}

function showErrorMsg(message, fieldName) {
     let field = document.getElementById(fieldName);
     message = '<div style="color: #a71d2a">' + message + '</div>'
    field.innerHTML = message;
    setTimeout(function () {
        field.innerHTML = '';
    },10000);
}