/*********************** For Strategies **************************/

/** Loading table's elements and data**/
var editor_strat;

$(document).ready(function () {

    editor_strat = new $.fn.dataTable.Editor( {
        ajax: {
            remove: {
                url: server_url + strat_url + 'strategies/archive/_id_/',
                type: 'DELETE'
            }
        },
        table: '#archive_table',
        idSrc: 'id',
        fields: [ {
            label: "Strategy name:",
            name: "name"
        }, {
            label: "Version",
            name: "version"
        }, {
            label: "Date start",
            name: "dateStart"
        }, {
            label: "Date begin",
            name: "dateBegin"
        }, {
            label: "Date end",
            name: "dateEnd"
        }, {
            label: "Graph",
            name: "graph"
        }
        ]
    });


    $('#archive_table').DataTable( {
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
        ajax: server_url + strat_url + 'strategies/archive/',
        columns: [
            {data: "checked"},
            {data: "name"},
            {data: "version"},
            {data: "dateTest"},
            {data: "dateBegin"},
            {data: "dateEnd"},
            {data: "graph"}
        ],
        select: true,
        buttons: [
            {extend: "remove", editor: editor_strat}
        ]

    });

});


/** Uploading strategy in editor**/
function loadStrategyInEditor() {
    let file = document.getElementById("inputFile-1").files[0];
    if (file !== undefined) {
        let reader = new FileReader();
        reader.onload = function (e) {
            //let textArea = document.getElementsByClassName("ace_text-input");
            editor.setValue(e.target.result.toString());
            console.log(editor.getValue());
        };

        reader.readAsText(file);
        let str = file.name;
        document.req_form.fileName.value = str;
        if (str.indexOf('.txt',1) !== -1) {
            document.req_form.stratName.value = str.slice(0, str.indexOf('.txt',1));
        } else if (str.indexOf('.py',1) !== -1)  {
            document.req_form.stratName.value = str.slice(0, str.indexOf('.py',1));
        } else {}
    } else {
        editor.setValue('');
        document.req_form.fileName.value = '';
    }
}

/** Change strategy and description **/
function changeStrategy() {
    let strategyName = document.getElementById("stratSelect");
    let description = document.getElementById("descriptionSelect");
    let index = strategyName.selectedIndex;
    document.req_form.stratName.value = strategyName.value;
    document.req_form.stratDescription.value = description.options[index].value;
}

/** Clear result console **/
function clearResults() {
    document.res_form.resultText.value = '';
}

/** Changing style of editor **/
function changeEditorStyle() {
    var editor = ace.edit("editor");
    editor.setTheme(document.req_form.seletTheam.value);
    editor.session.setMode("ace/mode/python");
}

/******************************************************************
 ************************ dataInput block *************************
 ******************************************************************/

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

/******************************************************************
 ************************ pageLoader block ************************
 ******************************************************************/

/** Uploading strategySelector **/
async function uploadStrategies() {
    sendUploadingRequest('strategies');
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
    fetch (server_url + strat_url + 'strategies/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: blob
    })
        .then(res => {
            if (res.status == 200  || res.status == 201) {
                uploadStrategies();
                writeString('Strategy uploaded');
            } else if (res.status == 204) {
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
    fetch (server_url + strat_url +'strategies/' + stat_name, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: blob
    })
        .then(res => {
            if (res.status == 200  || res.status == 201) {
                uploadStrategies();
                writeString('Strategy updated');
            } else if (res.status == 204) {
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
    fetch (server_url + strat_url + 'strategies/' + stat_name, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.status == 200  || res.status == 201) {
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
    fetch (server_url + strat_url + req_name + '/', {
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
            } /*else if (req_name == 'data') {
                updateDataTable(res);
                console.log('Data updated');
            }*/ else {
                console.log('Error: Incorrect code');
            }
        })
        .catch(e => {
            console.log('Error: ' + e.message);
        })
}