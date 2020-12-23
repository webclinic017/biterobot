/************************************ For Data *****************************/

/** Loading table's elements and data**/
var editor;

$(document).ready(function () {

    editor = new $.fn.dataTable.Editor( {
        processing: false,
        serverSide: false,
        ajax: {
            remove: {
                url: server_url + data_url + 'instruments/_id_/',
                type: 'DELETE'
            }
        },
        table: '#data_table',
        idSrc: 'id'
    });


    $('#data_table').DataTable( {
        select: {
            style: 'os',
            selector: 'td:first-child'
        },
        order: [[ 1, 'asc' ]],

        dom: "lfrtBip",
        ajax: server_url + data_url + 'instruments/',
        columns: [
            {
                "className":      'select-checkbox select-checkbox-all',
                "orderable":      false,
                "data":           null,
                "defaultContent": '',
                targets: 0,
                width: "15px"
            },
            {data: "ticker"},
            {data: "candleLength"},
            {data: "dateBegin"},
            {data: "dateEnd"}
        ],
        select: true,
        buttons: [
            {extend: "remove", editor: editor}
        ]

    });

    if (getCookie('token') !== undefined && getCookie('token') !== '') {
        document.getElementById('token').style.backgroundColor = "#89ff7f";
        document.getElementById('token').value = getCookie('token');
    } else {
        document.getElementById('token').style.backgroundColor = "white";
    }

    sendGetTickers();
});


/******************************************************************
 ********************** messageBroker block ***********************
 ******************************************************************/

/** Creating json for data **/
function loadData(frdate, todate, ticker, candle) {
    let request = {
        token: getCookie('token'),
        frDate: frdate,
        toDate: todate,
        ticker: ticker,
        candleLength: candle
    };

    let json = JSON.stringify(request);
    console.log(json)
    return (json);
}


/** Load new data **/
function addData () {
    let frdate = document.data_form.date_begin.value;
    let todate = document.data_form.date_end.value;
    let ticker = document.data_form.ticker.value;
    let candleLength = document.data_form.candleLengthSelect.value;
    if (getCookie('token') == undefined || getCookie('token') == '') {
        alert('You need to set token firstly!')
    } else {
        if (frdate !== '' && todate !== '' && ticker !== '' && candleLength !== '') {
            sendData(loadData(frdate, todate, ticker, candleLength));
        } else {
            if (ticker == '') {
                showEmptyField(document.data_form.ticker);
            }
            if (frdate == '' || todate == '') {
                showEmptyField(document.data_form.date_begin);
                showEmptyField(document.data_form.date_end);
            }
            if (candleLength == '') {
                showEmptyField(document.data_form.candleLengthSelect);
            }
        }

    }

}


/******************************************************************
 ************************ pageUpdater block ***********************
 ******************************************************************/

/** Update ticker list**/
function updateTickerList(data) {
    let tickerList = document.getElementById("tickers");
    tickerList.innerHTML = '';
    data.forEach((item) => {
        $("#tickers").append($("<option>").text(item.ticker));
    });
}

/** Show message after sendData **/
function showAddMessage(message, sucess) {
    let field = document.getElementById('add_result_message');
    if (sucess) {
        message = '<div style="color: #1e7e34">' + message + '</div>';
    } else {
        message = '<div style="color: #a71d2a">' + message + '</div>'
    }
    field.innerHTML = message;
    setTimeout(function () {
        field.innerHTML = '';
    },10000);


}

/******************************************************************
 ********************** messageBroker block ***********************
 ******************************************************************/

/** Send request to load data **/
function sendData(blob) {
    fetch (server_url + data_url + 'instruments/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: blob
    })
        .then(res => {
            if (res.status == 200  || res.status == 201) {
                //uploadData();
                $('#data_table').DataTable().ajax.reload(null, false);
                showAddMessage('Data loaded', true);
                sendGetTickers();
            }  else if (res.status == 500) {
                showAddMessage('There are some problems with request! Check inserted data or token and try again.', false);
            } else {
                //console.log(res);
                let error = new Error(res.statusText);
                error.response = res;
                throw error;
            }
        })
        .catch(e => {
            showAddMessage('HTTP request error: ' + e.status, false);
        })
}


/** Send request to load tickers**/
function sendGetTickers() {
    fetch (server_url + data_url + 'instruments/tickers', {
        method: 'GET'
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
            if (res.headers['Content-Type'] !== 'application/json') {
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
            updateTickerList(res);
            //console.log('Tickers updated');
        })
        .catch(e => {
            //console.log('Error: ' + e.message);
            null
        })
}