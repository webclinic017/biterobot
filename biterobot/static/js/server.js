var server_url = 'http://127.0.0.1:8000/';
//var server_url = 'https://a51d6b62-1920-45e4-b298-e0c28a5e20f9.mock.pstmn.io/strategyManager/';

/******************************************************************
 ************************ dataInput block *************************
 ******************************************************************/

/*********************** For Strategies **************************/

/** Id generation **/
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


/** Creating json for loading **/
function loadStrategy(startName, stratFile, description) {
    let request = {
        code: 1101,
        name: startName,
        description: description,
        file: {
            name: document.req_form.stratFile.files[0].name,
            body: stratFile
        }
    };

    let json = JSON.stringify(request);
    console.log(json)
    return (json);
}


/** Creating json for updating **/
function updateStrategy(startName, stratFile, description) {
    let request = {};
    if (description !== document.req_form.descriptionSelect.value && stratFile !== '') {
        request = {
            code: 1101,
            name: startName,
            description: description,
            file: {
                name: document.req_form.stratFile.files[0].name,
                body: stratFile
            }
        };
    } else if (description !== document.req_form.descriptionSelect.value && stratFile == '') {
        request = {
            code: 1101,
            name: startName,
            description: description
        };
    } else if (description == document.req_form.descriptionSelect.value && stratFile !== '') {
        request = {
            code: 1101,
            name: startName,
            file: {
                name: document.req_form.stratFile.files[0].name,
                body: stratFile
            }
        };
    } else {
        return '';
    }

    let json = JSON.stringify(request);
    console.log(json)
    return (json);
}


/** Creating json for testing **/
function testStrategy(frdate, todate, stratSelect, startName, stratFile) {
    let req_id = uuidv4();
    console.log(uuidv4)
    if (frdate !== '' && todate !== '') {
        let request = {};
        if (stratFile != null && (stratSelect == '' || startName !== stratSelect)) {
            request = {
                code: 1201,
                id: req_id,
                frDate: frdate,
                toDate: todate,
                name: startName,
                isNew: false,
                file: {
                    name: document.req_form.stratFile.files[0].name,
                    body: stratFile
                }
            };
        } else if (stratSelect !== '') {
            request = {
                code: 1201,
                id: req_id,
                frDate: frdate,
                toDate: todate,
                name: stratSelect,
                isNew: true
            };
        } else {
            return 'Error: File is empty!!!'
        }

        let json = JSON.stringify(request);
        console.log(json)
        return (json);
        //sendRequest(json, 1201, req_id, false);
    } else {
        return('Dates must be chosen!!!');
    }
}


/** Choosing action **/
async function chooseAction () {
    let frdate = document.req_form.date_begin.value;
    let todate = document.req_form.date_end.value;
    let stratSelect = document.req_form.stratSelect.value;
    let desriptionSelect = document.req_form.descriptionSelect.value;
    let description = document.req_form.stratDescription.value;
    //let stratText = document.forma.textar.value;
    let startName = document.req_form.stratName.value;
    let stratFile = document.req_form.stratFile.files[0];
    let action = document.req_form.stratAction.value;

    let strRes = '';

    if (action == 'load') { // Loading strategy
        if (stratFile !== undefined) {
            let reader = new FileReader();

            reader.readAsDataURL(stratFile); // конвертирует Blob в base64 и вызывает onload

            reader.onload = function() {
                console.log(reader.result)
                if (reader.result != null) {
                    sendLoadStrategyRequest(loadStrategy(startName, reader.result, description));
                } else {
                    writeString('Error: File is empty');
                }
            };
        } else {
            writeString('Error: File is empty');
        }

    } else if (action == 'update') { // Updating strategy
        if (stratFile !== undefined) {
            let reader = new FileReader();

            reader.readAsDataURL(stratFile); // конвертирует Blob в base64 и вызывает onload

            reader.onload = function() {
                console.log(reader.result)
                if (reader.result != null) {
                    sendUpdateStrategyRequest(updateStrategy(stratSelect, reader.result, description), stratSelect);
                } else {
                    writeString('Error: File is empty');
                }
            };
        } else if (description !== '' && stratFile == undefined) {
            sendUpdateStrategyRequest(updateStrategy(stratSelect, '', description), stratSelect);
        } else {
            writeString('Error: Choose strategy firstly');
        }

    } else if (action == 'delete') { // Deleting strategy
        if (stratSelect !== '') {
            sendDeleteStrategyRequest(stratSelect);
        } else {
            writeString('Error: Choose strategy');
        }

    } else if (action == 'test') { // Testing strategy
        if (frdate !== '' && todate !== '') {
            if (document.req_form.stratFile.files[0] !== undefined) {
                let reader = new FileReader();

                reader.readAsDataURL(stratFile); // конвертирует Blob в base64 и вызывает onload

                reader.onload = function () {
                    console.log(reader.result)
                    strRes = testStrategy(frdate, todate, stratSelect, startName, reader.result);
                    workStrategyRequest(strRes, 1201, '', 0, 'validate');
                };
            } else if (stratSelect !== '') {
                strRes = testStrategy(frdate, todate, stratSelect, startName, '');
                workStrategyRequest(strRes, 1202, '', 0, 'test');
            } else {
                writeString('Error: No strategy to test');
            }
        } else {
            writeString('Error: Date fields must be filled');
            document.req_form.date_begin.style.backgroundColor = "#ff3535";
            document.req_form.date_end.style.backgroundColor = "#ff3535";
            setTimeout(function () {
                document.req_form.date_begin.style.backgroundColor = "white";
                document.req_form.date_end.style.backgroundColor = "white";
            },1000);
        }

    } else {
        writeString('Error: Choose action firstly');
    }

}


/************************************ For Data *****************************/

/** Creating json for data **/
function loadData(frdate, todate, ticker, candle) {
    let request = {
        code: 1301,
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

function setToken() {
    document.cookie = "token=" + document.getElementById('token').value + '; samesite';
}


/******************************************************************
 ************************ dataOutput block ************************
 ******************************************************************/

/** Write string in output **/
function writeString(str) {
    let strRes = document.res_form.resultText.value;
    if (strRes !== '') {
        strRes = strRes + '\n';
    }
    strRes = strRes + 'BR:> ' + str;
    document.res_form.resultText.value = strRes;
}

/******************************************************************
 ************************ pageUpdater block ***********************
 ******************************************************************/

/** Update strategySelector **/
function updateStrategySelector(strategies) {
    let strategyName = document.getElementById("stratSelect");
    let description = document.getElementById("descriptionSelect");
    console.log(strategyName.length);
    strategyName.innerHTML = '';
    description.innerHTML = '';
    console.log(strategyName.length);
    let option = document.createElement("option");
    let option1 = document.createElement("option");
    option.text = '';
    option1.text = '';
    strategyName.appendChild(option);
    description.appendChild(option1);
    console.log(strategyName.length);
    strategies.forEach((item) => {
        let option = document.createElement("option");
        option.text = item.name;
        strategyName.add(option);

        let option1 = document.createElement("option");
        option1.text = item.description;
        description.add(option1);
    });
}

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

/******************************************************************
 ************************ pageLoader block ************************
 ******************************************************************/

/** Generating upload request **/
function generateUpdateRequest(code) {
    let request = {
        code: code
    };

    let json = JSON.stringify(request);
    console.log(json)
    return (json);
}


/** Uploading strategySelector **/
async function uploadStrategies() {
    sendUploadingRequest('strategyManager/strategies');
}


/** Uploading data **/
async function uploadData() {
    sendUploadingRequest('dataManager/instruments');
}

/******************************************************************
 ********************** messageBroker block ***********************
 ******************************************************************/

/** Generating test steps **/
function testStep(code, req_id) {
    let request = {
        code: code,
        id: req_id
    };

    let json = JSON.stringify(request);
    console.log(json)
    return (json);
}


/** Send request to test strategy **/
function workStrategyRequest (blob, reqCode, session, endConnetion, str) {
    fetch (document.req_form.url_address.value/*'/strategy/' + str*/, {
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
        .then(res => {
            if (res.headers['Content-Type'] !== 'application/json') {
                let error = new Error('Incorrect server response');
                error.response = res;
                throw error
            }
            return res;
        })
        .then(res => res.json())
        .then(data => {
            if (data.code == 2201) {
                writeString('Strategy validated');
                workStrategyRequest(testStep(1202, session), 1202, session, endConnetion, 'test');
            } else if (data.code == 2202) {
                writeString('Start test');
                while (endConnetion == workStrategyRequest(testStep(1203, session), 1203, session, endConnetion, 'isredy') !== true) {
                    setTimeout('', 5000);
                };
                if (endConnetion !== 2) {
                    workStrategyRequest(testStep(1204, session), 1204, session, 0, 'result');
                } else {
                    return endConnetion;
                }
            } else if (data.code == 2203) {
                return endConnetion;
            } else if (data.code == 2213) {
                writeString('Test finished');
                return 1;
            } else if (data.code == 2204) {
                writeString('Results');
                //getTestResults();
            }else if (data.code == 4001) {
                writeString('Error: ' + data.errMsg);
                endConnetion = 2;
            } else {
                endConnetion = 2;
                writeString('Error: Incorrect code');
            }
        })
        .catch(e => {
            writeString('Error: ' + e.message);
            writeString(e.response);
            endConnetion = 2;
        })
    return endConnetion;
}


/** Send request to load strategy **/
function sendLoadStrategyRequest(blob) {
    writeString('Start uploading');
    fetch (server_url + 'strategyManager/' + 'strategies/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: blob
    })
        .then(res => {
            if (res.code == 200  || res.code == 201) {
                uploadStrategies();
                writeString('Strategy uploaded');
            } else if (res.code == 204) {
                writeString('Error: Content was not send');
            } else if (res.status == 500) {
                writeString(res.message);
            } else {
                let error = new Error(res.statusText);
                error.response = res;
                throw error;
            }
        })
        .catch(e => {
            writeString('Error: ' + e.message);
        })
}


/** Send request to update strategy **/
function sendUpdateStrategyRequest(blob, stat_name) {
    writeString('Start updating');
    fetch (server_url + 'strategyManager/' + 'strategies/' + stat_name, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: blob
    })
        .then(res => {
            if (res.code == 200  || res.code == 201) {
                uploadStrategies();
                writeString('Strategy updated');
            } else if (res.code == 204) {
                uploadStrategies();
                writeString('Error: Content was not send');
            } else if (res.status == 500) {
                writeString(res.message);
            } else {
                let error = new Error(res.statusText);
                error.response = res;
                throw error;
            }
        })
        .catch(e => {
            writeString('Error: ' + e.message);
        })
}


/** Send request to delete strategy **/
function sendDeleteStrategyRequest(stat_name) {
    writeString('Start deleting');
    fetch (server_url + 'strategyManager/' + 'strategies/' + stat_name, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.code == 200  || res.code == 201) {
                uploadStrategies();
                return 'Strategy deleted';
            }  else if (res.status == 500) {
                writeString(res.message);
            } else {
                let error = new Error(res.statusText);
                error.response = res;
                throw error;
            }
        })
        .catch(e => {
            writeString('Error: ' + e.message);
        })
}


/** Send request to update data/strategies **/
function sendUploadingRequest (req_name) {
    fetch (server_url + req_name + '/', {
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
            if (req_name == 'strategies') {
                updateStrategySelector(res);
                console.log('Strategy updated');
            } else if (req_name == 'data') {
                updateDataTable(res);
                console.log('Data updated');
            } else {
                console.log('Error: Incorrect code');
            }
        })
        .catch(e => {
            console.log('Error: ' + e.message);
        })
}


/** Send request to load data **/
function sendData(blob) {
    fetch (server_url + 'dataManager' + 'instruments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: blob
    })
        .then(res => {
            if (res.code == 200  || res.code == 201) {
                uploadData();
                console.log('Data loaded');
            }  else if (res.status == 500) {
                console.log(res.message);
            } else {
                let error = new Error(res.statusText);
                error.response = res;
                throw error;
            }
        })
        .catch(e => {
            console.log('Error: ' + e.message);
        })
}var server_url = 'http://127.0.0.1:8000/';
//var server_url = 'https://a51d6b62-1920-45e4-b298-e0c28a5e20f9.mock.pstmn.io/strategyManager/';

/******************************************************************
 ************************ dataInput block *************************
 ******************************************************************/

/*********************** For Strategies **************************/

/** Id generation **/
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


/** Creating json for loading **/
function loadStrategy(startName, stratFile, description) {
    let request = {
        code: 1101,
        name: startName,
        description: description,
        file: {
            name: document.req_form.stratFile.files[0].name,
            body: stratFile
        }
    };

    let json = JSON.stringify(request);
    console.log(json)
    return (json);
}


/** Creating json for updating **/
function updateStrategy(startName, stratFile, description) {
    let request = {};
    if (description !== document.req_form.descriptionSelect.value && stratFile !== '') {
        request = {
            code: 1101,
            name: startName,
            description: description,
            file: {
                name: document.req_form.stratFile.files[0].name,
                body: stratFile
            }
        };
    } else if (description !== document.req_form.descriptionSelect.value && stratFile == '') {
        request = {
            code: 1101,
            name: startName,
            description: description
        };
    } else if (description == document.req_form.descriptionSelect.value && stratFile !== '') {
        request = {
            code: 1101,
            name: startName,
            file: {
                name: document.req_form.stratFile.files[0].name,
                body: stratFile
            }
        };
    } else {
        return '';
    }

    let json = JSON.stringify(request);
    console.log(json)
    return (json);
}


/** Creating json for testing **/
function testStrategy(frdate, todate, stratSelect, startName, stratFile) {
    let req_id = uuidv4();
    console.log(uuidv4)
    if (frdate !== '' && todate !== '') {
        let request = {};
        if (stratFile != null && (stratSelect == '' || startName !== stratSelect)) {
            request = {
                code: 1201,
                id: req_id,
                frDate: frdate,
                toDate: todate,
                name: startName,
                isNew: false,
                file: {
                    name: document.req_form.stratFile.files[0].name,
                    body: stratFile
                }
            };
        } else if (stratSelect !== '') {
            request = {
                code: 1201,
                id: req_id,
                frDate: frdate,
                toDate: todate,
                name: stratSelect,
                isNew: true
            };
        } else {
            return 'Error: File is empty!!!'
        }

        let json = JSON.stringify(request);
        console.log(json)
        return (json);
        //sendRequest(json, 1201, req_id, false);
    } else {
        return('Dates must be chosen!!!');
    }
}


/** Choosing action **/
async function chooseAction () {
    let frdate = document.req_form.date_begin.value;
    let todate = document.req_form.date_end.value;
    let stratSelect = document.req_form.stratSelect.value;
    let desriptionSelect = document.req_form.descriptionSelect.value;
    let description = document.req_form.stratDescription.value;
    //let stratText = document.forma.textar.value;
    let startName = document.req_form.stratName.value;
    let stratFile = document.req_form.stratFile.files[0];
    let action = document.req_form.stratAction.value;

    let strRes = '';

    if (action == 'load') { // Loading strategy
        if (stratFile !== undefined) {
            let reader = new FileReader();

            reader.readAsDataURL(stratFile); // конвертирует Blob в base64 и вызывает onload

            reader.onload = function() {
                console.log(reader.result)
                if (reader.result != null) {
                    sendLoadStrategyRequest(loadStrategy(startName, reader.result, description));
                } else {
                    writeString('Error: File is empty');
                }
            };
        } else {
            writeString('Error: File is empty');
        }

    } else if (action == 'update') { // Updating strategy
        if (stratFile !== undefined) {
            let reader = new FileReader();

            reader.readAsDataURL(stratFile); // конвертирует Blob в base64 и вызывает onload

            reader.onload = function() {
                console.log(reader.result)
                if (reader.result != null) {
                    sendUpdateStrategyRequest(updateStrategy(stratSelect, reader.result, description), stratSelect);
                } else {
                    writeString('Error: File is empty');
                }
            };
        } else if (description !== '' && stratFile == undefined) {
            sendUpdateStrategyRequest(updateStrategy(stratSelect, '', description), stratSelect);
        } else {
            writeString('Error: Choose strategy firstly');
        }

    } else if (action == 'delete') { // Deleting strategy
        if (stratSelect !== '') {
            sendDeleteStrategyRequest(stratSelect);
        } else {
            writeString('Error: Choose strategy');
        }

    } else if (action == 'test') { // Testing strategy
        if (frdate !== '' && todate !== '') {
            if (document.req_form.stratFile.files[0] !== undefined) {
                let reader = new FileReader();

                reader.readAsDataURL(stratFile); // конвертирует Blob в base64 и вызывает onload

                reader.onload = function () {
                    console.log(reader.result)
                    strRes = testStrategy(frdate, todate, stratSelect, startName, reader.result);
                    workStrategyRequest(strRes, 1201, '', 0, 'validate');
                };
            } else if (stratSelect !== '') {
                strRes = testStrategy(frdate, todate, stratSelect, startName, '');
                workStrategyRequest(strRes, 1202, '', 0, 'test');
            } else {
                writeString('Error: No strategy to test');
            }
        } else {
            writeString('Error: Date fields must be filled');
            document.req_form.date_begin.style.backgroundColor = "#ff3535";
            document.req_form.date_end.style.backgroundColor = "#ff3535";
            setTimeout(function () {
                document.req_form.date_begin.style.backgroundColor = "white";
                document.req_form.date_end.style.backgroundColor = "white";
            },1000);
        }

    } else {
        writeString('Error: Choose action firstly');
    }

}


/************************************ For Data *****************************/

/** Creating json for data **/
function loadData(frdate, todate, ticker, candle) {
    let request = {
        code: 1301,
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

function setToken() {
    document.cookie = "token=" + document.getElementById('token').value + '; samesite';
}


/******************************************************************
 ************************ dataOutput block ************************
 ******************************************************************/

/** Write string in output **/
function writeString(str) {
    let strRes = document.res_form.resultText.value;
    if (strRes !== '') {
        strRes = strRes + '\n';
    }
    strRes = strRes + 'BR:> ' + str;
    document.res_form.resultText.value = strRes;
}

/******************************************************************
 ************************ pageUpdater block ***********************
 ******************************************************************/

/** Update strategySelector **/
function updateStrategySelector(strategies) {
    let strategyName = document.getElementById("stratSelect");
    let description = document.getElementById("descriptionSelect");
    console.log(strategyName.length);
    strategyName.innerHTML = '';
    description.innerHTML = '';
    console.log(strategyName.length);
    let option = document.createElement("option");
    let option1 = document.createElement("option");
    option.text = '';
    option1.text = '';
    strategyName.appendChild(option);
    description.appendChild(option1);
    console.log(strategyName.length);
    strategies.forEach((item) => {
        let option = document.createElement("option");
        option.text = item.name;
        strategyName.add(option);

        let option1 = document.createElement("option");
        option1.text = item.description;
        description.add(option1);
    });
}

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

/******************************************************************
 ************************ pageLoader block ************************
 ******************************************************************/

/** Generating upload request **/
function generateUpdateRequest(code) {
    let request = {
        code: code
    };

    let json = JSON.stringify(request);
    console.log(json)
    return (json);
}


/** Uploading strategySelector **/
async function uploadStrategies() {
    sendUploadingRequest('strategyManager/strategies');
}


/** Uploading data **/
async function uploadData() {
    sendUploadingRequest('dataManager/instruments');
}

/******************************************************************
 ********************** messageBroker block ***********************
 ******************************************************************/

/** Generating test steps **/
function testStep(code, req_id) {
    let request = {
        code: code,
        id: req_id
    };

    let json = JSON.stringify(request);
    console.log(json)
    return (json);
}


/** Send request to test strategy **/
function workStrategyRequest (blob, reqCode, session, endConnetion, str) {
    fetch (document.req_form.url_address.value/*'/strategy/' + str*/, {
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
        .then(res => {
            if (res.headers['Content-Type'] !== 'application/json') {
                let error = new Error('Incorrect server response');
                error.response = res;
                throw error
            }
            return res;
        })
        .then(res => res.json())
        .then(data => {
            if (data.code == 2201) {
                writeString('Strategy validated');
                workStrategyRequest(testStep(1202, session), 1202, session, endConnetion, 'test');
            } else if (data.code == 2202) {
                writeString('Start test');
                while (endConnetion == workStrategyRequest(testStep(1203, session), 1203, session, endConnetion, 'isredy') !== true) {
                    setTimeout('', 5000);
                };
                if (endConnetion !== 2) {
                    workStrategyRequest(testStep(1204, session), 1204, session, 0, 'result');
                } else {
                    return endConnetion;
                }
            } else if (data.code == 2203) {
                return endConnetion;
            } else if (data.code == 2213) {
                writeString('Test finished');
                return 1;
            } else if (data.code == 2204) {
                writeString('Results');
                //getTestResults();
            }else if (data.code == 4001) {
                writeString('Error: ' + data.errMsg);
                endConnetion = 2;
            } else {
                endConnetion = 2;
                writeString('Error: Incorrect code');
            }
        })
        .catch(e => {
            writeString('Error: ' + e.message);
            writeString(e.response);
            endConnetion = 2;
        })
    return endConnetion;
}


/** Send request to load strategy **/
function sendLoadStrategyRequest(blob) {
    writeString('Start uploading');
    fetch (server_url + 'strategyManager/' + 'strategies/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: blob
    })
        .then(res => {
            if (res.code == 200  || res.code == 201) {
                uploadStrategies();
                writeString('Strategy uploaded');
            } else if (res.code == 204) {
                writeString('Error: Content was not send');
            } else if (res.status == 500) {
                writeString(res.message);
            } else {
                let error = new Error(res.statusText);
                error.response = res;
                throw error;
            }
        })
        .catch(e => {
            writeString('Error: ' + e.message);
        })
}


/** Send request to update strategy **/
function sendUpdateStrategyRequest(blob, stat_name) {
    writeString('Start updating');
    fetch (server_url + 'strategyManager/' + 'strategies/' + stat_name, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: blob
    })
        .then(res => {
            if (res.code == 200  || res.code == 201) {
                uploadStrategies();
                writeString('Strategy updated');
            } else if (res.code == 204) {
                uploadStrategies();
                writeString('Error: Content was not send');
            } else if (res.status == 500) {
                writeString(res.message);
            } else {
                let error = new Error(res.statusText);
                error.response = res;
                throw error;
            }
        })
        .catch(e => {
            writeString('Error: ' + e.message);
        })
}


/** Send request to delete strategy **/
function sendDeleteStrategyRequest(stat_name) {
    writeString('Start deleting');
    fetch (server_url + 'strategyManager/' + 'strategies/' + stat_name, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.code == 200  || res.code == 201) {
                uploadStrategies();
                return 'Strategy deleted';
            }  else if (res.status == 500) {
                writeString(res.message);
            } else {
                let error = new Error(res.statusText);
                error.response = res;
                throw error;
            }
        })
        .catch(e => {
            writeString('Error: ' + e.message);
        })
}


/** Send request to update data/strategies **/
function sendUploadingRequest (req_name) {
    fetch (server_url + req_name + '/', {
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
            if (req_name == 'strategies') {
                updateStrategySelector(res);
                console.log('Strategy updated');
            } else if (req_name == 'data') {
                updateDataTable(res);
                console.log('Data updated');
            } else {
                console.log('Error: Incorrect code');
            }
        })
        .catch(e => {
            console.log('Error: ' + e.message);
        })
}


/** Send request to load data **/
function sendData(blob) {
    fetch (server_url + 'dataManager/' + 'instruments/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: blob
    })
        .then(res => {
            if (res.code == 200  || res.code == 201) {
                uploadData();
                console.log('Data loaded');
            }  else if (res.status == 500) {
                console.log(res.message);
            } else {
                let error = new Error(res.statusText);
                error.response = res;
                throw error;
            }
        })
        .catch(e => {
            console.log('Error: ' + e.message);
        })
}