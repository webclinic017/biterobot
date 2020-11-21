
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
            name: document.forma.myFile.files[0].name,
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
    if (description !== document.forma.descriptSelect.value && stratFile !== '') {
        request = {
            code: 1101,
            name: startName,
            description: description,
            file: {
                name: document.forma.myFile.files[0].name,
                body: stratFile
            }
        };
    } else if (description !== document.forma.descriptSelect.value && stratFile == '') {
        request = {
            code: 1101,
            name: startName,
            description: description
        };
    } else if (description == document.forma.descriptSelect.value && stratFile !== '') {
        request = {
            code: 1101,
            name: startName,
            file: {
                name: document.forma.myFile.files[0].name,
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
                    name: document.forma.myFile.files[0].name,
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
    let frdate = document.forma.frdt.value;
    let todate = document.forma.todt.value;
    let stratSelect = document.forma.stratSelect.value;
    let desriptionSelect = document.forma.descriptSelect.value;
    let description = document.forma.descript.value;
    //let stratText = document.forma.textar.value;
    let startName = document.forma.strname.value;
    let stratFile = document.forma.myFile.files[0];
    let action = document.forma.action.value;

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
        if (document.forma.myFile.files[0] !== undefined) {
            let reader = new FileReader();

            reader.readAsDataURL(stratFile); // конвертирует Blob в base64 и вызывает onload

            reader.onload = function () {
                console.log(reader.result)
                strRes = testStrategy(frdate, todate, stratSelect, startName, reader.result);
                workStrategyRequest(strRes, 1201, '', 0, 'validate');
                //writeString(strRes);
            };
        } else if (stratSelect !== '') {
            strRes = testStrategy(frdate, todate, stratSelect, startName, null);
            workStrategyRequest(strRes, 1202, '', 0, 'test');
            //writeString(strRes);
        } else {
            writeString('Error: No strategy to test');
        }
    } else {
        writeString('Error: No strategy to test');
    }

}


/************************************ For Data *****************************/

/** Creating json for data **/
function loadData(frdate, todate, ticker) {
    let request = {
        code: 1301,
        frDate: frdate,
        toDate: todate,
        ticker: ticker
    };

    let json = JSON.stringify(request);
    console.log(json)
    return (json);
}


/** Load new data **/
function addData () {
    let frdate = document.dataForm.frdt.value;
    let todate = document.dataForm.todt.value;
    let ticker = document.dataForm.ticker.value;
    let strRes = '';
    if (frdate !== '' && todate !== '') {
        if (ticker !== '') {
            strRes = sendData(loadData(frdate, todate, ticker));
            writeString(strRes);
        } else {
            writeString('Error: Ticker must be chosen');
        }
    } else {
        writeString('Error: Dates must be chosen');
    }
}

/******************************************************************
 ************************ dataOutput block ************************
 ******************************************************************/

/** Write string in output **/
function writeString(str) {
    let strRes = document.resform.res.value;
    if (strRes !== '') {
        strRes = strRes + '\n';
    }
    strRes = strRes + 'BR$> ' + str;
    document.resform.res.value = strRes;
}

/******************************************************************
 ************************ pageUpdater block ***********************
 ******************************************************************/

/** Update strategySelector **/
function updateStrategySelector(strategies) {
    let strategyName = document.getElementById("stratSelect");
    let description = document.getElementById("descriptSelect");
    let option = document.createElement("option");
    strategyName.innerHTML = '';
    description.innerHTML = '';
    option.text = '';
    strategyName.add(option, null);
    description.add(option, null);
    strategies.forEach((item) => {
        option.text = item.name;
        strategyName.add(option, null);
        option.text = item.description;
        description.add(option, null);
    });
}

/** Update data **/
function updateDataTable(data) {
    let tabBody = document.dataTable.item(0);

    tabBody.innerHTML = '';
    data.forEach((item) => {
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
    row=document.createElement("tr");
    cell1 = document.createElement("td");
    cell2 = document.createElement("td");
    textnode1=document.createTextNode(content);
    textnode2=document.createTextNode(morecontent);
    cell1.appendChild(textnode1);
    cell2.appendChild(textnode2);
    row.appendChild(cell1);
    row.appendChild(cell2);
    tabBody.appendChild(row);
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
    sendUploadingRequest(generateUpdateRequest(1001),'strategy');
}


/** Uploading data **/
async function uploadData() {
    sendUploadingRequest(generateUpdateRequest(1011),'data');
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
    fetch (document.forma.url_address.value/*'/strategy/' + str*/, {
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
    fetch (document.forma.url_address.value, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: blob
    })
        .then(res => {
            if (res.code == 200  || res.code == 201) {
                writeString('Strategy loaded');
            } else if (res.code == 204) {
                writeString('Error: Content was not send');
            } else if (res.status = 500) {
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
    fetch (document.forma.url_address.value + stat_name, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: blob
    })
        .then(res => {
            if (res.code == 200  || res.code == 201) {
                return 'Strategy updated';
            } else if (res.code == 204) {
                return 'Error: Content was not send';
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
    fetch (document.forma.url_address.value + stat_name, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.code == 200  || res.code == 201) {
                return 'Strategy deleted';
            }  else if (res.status = 500) {
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


//TODO: Этот блок надо обсудить с Андреем (пока не работает)
/** Send request to update data/strategies **/
function sendUploadingRequest (req_name) {
    fetch (document.forma.url_address.value + req_name, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
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
            if (data.code == 2011) {
                updateStrategySelector(data.strategies);
                writeString('Strategy updated');
            } else if (data.code == 2301) {
                updateDataTable(data.strategies);
                writeString('Data updated');
            } else if (data.code == 4001) {
                writeString('Error: ' + data.errMsg);
            } else {
                writeString('Error: Incorrect code');
            }
        })
        .catch(e => {
            writeString('Error: ' + e.message);
        })
}


/** Send request to load data **/
function sendData(blob) {
    fetch ('/data/load', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: blob
    })
        .then(res => {
            if (res.code == 200  || res.code == 201) {
                return 'Strategy deleted';
            }  else if (res.status = 500) {
                return res.message;
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