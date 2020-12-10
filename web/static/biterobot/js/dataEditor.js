/************************************ For Data *****************************/

/** Loading table's elements and data**/
var editor;

$(document).ready(function () {

    editor = new $.fn.dataTable.Editor( {
        ajax: {
            remove: {
                url: server_url + data_url + 'instruments/_id_/',
                type: 'DELETE'
            }
        },
        table: '#data_table',
        idSrc: 'id',
        fields: [ {
            label: "Ticker:",
            name: "ticker"
        }, {
            label: "Candle length",
            name: "candleLength"
        }, {
            label: "Date begin",
            name: "dateBegin"
        }, {
            label: "Date end",
            name: "dateEnd"
        }
        ]
    });


    $('#data_table').DataTable( {
        columnDefs: [{
            orderable: false,
            className: 'select-checkbox select-checkbox-all',
            targets: 0
        }],
        select: {
            style: 'multi',
            selector: 'td:first-child'
        },
        order: [[ 1, 'asc' ]],

        dom: "lfrtBip",
        ajax: server_url + data_url + 'instruments/',
        columns: [
            {data: "checked"},
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

});


/******************************************************************
 ********************** messageBroker block ***********************
 ******************************************************************/

/** Creating json for data **/
function loadData(frdate, todate, ticker, candle) {
    let request = {
        code: 1301,
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
    if (candleLength !== '') {
        if (frdate !== '' && todate !== '') {
            if (ticker !== '') {
                sendData(loadData(frdate, todate, ticker, candleLength));
            } else {
                console.log('Error: Ticker must be chosen');
                document.data_form.ticker.style.backgroundColor = "#ff3535";
                setTimeout(function () {
                    document.data_form.ticker.style.backgroundColor = "white";
                },1000);
            }
        } else {
            console.log('Error: Dates must be chosen');
            document.data_form.date_begin.style.backgroundColor = "#ff3535";
            document.data_form.date_end.style.backgroundColor = "#ff3535";
            setTimeout(function () {
                document.data_form.date_begin.style.backgroundColor = "white";
                document.data_form.date_end.style.backgroundColor = "white";
            },1000);
        }
    } else {
        console.log('Error: Candle length not chosen');
        document.data_form.candleLengthSelect.style.backgroundColor = "#ff3535";
        setTimeout(function () {
            document.data_form.candleLengthSelect.style.backgroundColor = "white";
        },1000);
    }

}


/******************************************************************
 ************************ pageUpdater block ***********************
 ******************************************************************/

/** Update data **/
function updateDataTable(data) {
    let tabBody = document.data_form.dataTable.item(0);
    let tickerList = document.getElementById("tickers");
    tickerList.innerHTML = '';
    tabBody.innerHTML = '';
    let option = document.createElement("option");
    option.text = '';
    tickerList.add(option);
    data.forEach((item) => {
        let option = document.createElement("option");
        option.text = item.ticker;
        tickerList.add(option);

        let newRow = tabBody.insertRow();
        let newCell = newRow.insertCell();
        let newValue = document.createTextNode(item.ticker);
        newCell.appendChild(newValue);

        newCell = newRow.insertCell();
        newValue = document.createTextNode(item.name);
        newCell.appendChild(newValue);

        newCell = newRow.insertCell();
        newValue = document.createTextNode(item.dtBegin);
        newCell.appendChild(newValue);

        newCell = newRow.insertCell();
        newValue = document.createTextNode(item.dtEnd);
        newCell.appendChild(newValue);
    });
}

