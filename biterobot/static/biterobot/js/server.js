var server_url = 'http://127.0.0.1:8000/';
var strat_url = 'strategyManager/';
var data_url = 'dataManager/';
var test_url = 'testManager/'; //for testing
//var server_url = 'https://a51d6b62-1920-45e4-b298-e0c28a5e20f9.mock.pstmn.io/';


/** Set user token for testing **/
function setToken() {
    document.cookie = "token=" + document.getElementById('token').value + '; samesite';
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
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