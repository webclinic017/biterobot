var server_url = '/';
var strat_url = 'strategyManager/';//for strategies
var data_url = 'dataManager/'; //for data
var test_url = 'testManager/'; //for testing
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

function showEmptyField(field) {
    field.style.backgroundColor = "#ff3535";
    setTimeout(function () {
        field.style.backgroundColor = "white";
    },3000);
}
