/*********************** For Strategies **************************/

/** Loading table's elements and data**/

var editor_strat; // Editor for strategies
var editor_data; // Editor for data
var editor_strategy;
var last_message = new Date();
var data_id = '';
var strategy_id = '';
var strat_action = '';

$(document).ready(function () {
    $('table.display').DataTable();

    editor_strat = new $.fn.dataTable.Editor( {
        ajax: server_url + test_url + 'tests/' + strategy_id + '/',
        table: '#archive_table',
        idSrc: 'id',
        fields: [ {
                label: "Strategy name:",
                name: "name"
            }, {
                label: "Version:",
                name: "version"
            }, {
                label: "Date start:",
                name: "dateStart"
            }, {
                label: "Date begin:",
                name: "dateBegin"
            }, {
                label: "Date end:",
                name: "dateEnd"
            }, {
                label: "files:",
                name: "files[].id",
                type: "uploadMany",
                display: function (fileId, counter) {
                    if (fileId !== null) {
                        return fileId ?
                            '<img src="'+ editor_strat.file( 'files', fileId ).web_path + '" style="width=50%; height=50%;"/>' :
                            null;
                    }
                },
                clearText: "Clear",
            noFileText: 'No images'
            }
        ]
    });

    editor_data = new $.fn.dataTable.Editor( {
        processing: false,
        serverSide: false,
        ajax:  server_url + data_url + 'instruments/_id_/',
        table: '#data_table',
        idSrc: 'id'
    });

    editor_strategy = new $.fn.dataTable.Editor( {
        processing: false,
        serverSide: false,
        ajax:  {
            remove: {
                url: server_url + strat_url + 'strategies/_id_/',
                type: 'DELETE'
            }
        },
        table: '#strategy_table',
        idSrc: 'id'
    });

    function format (d) {
        var rows = '';
        var i;

        for (i = 0; i < (d.files.length); i++) {
            //console.log(editor_strat.file( 'files', id = d.files[i].id ).web_path);
            rows = rows + '<tr>' +
                '<iframe src="'+ editor_strat.file( 'files', id = d.files[i].id ).web_path + '" height="550px" scrolling="auto"></iframe>' +
                /*'<img src="'+ editor_strat.file( 'files', id = d.files[i].id ).web_path + '" style="width=50%; height=50%;"/>' +*/
                '</tr>' +
                '<tr><h4>Start cash: ' + editor_strat.file( 'files', id = d.files[i].id ).startCash + '</h4></tr>' +
                '<tr><h4>End cash: ' + editor_strat.file( 'files', id = d.files[i].id ).endCash + '</h4></tr>' +
                '<tr>' +
                '<textarea class="form-control" style="min-height: 150px;width: 100%;background: rgb(24,24,24);color: rgb(255,255,255);">' + editor_strat.file( 'files', id = d.files[i].id ).resultData + '</textarea>' +
            '</tr>';

        }
        return ('<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
            rows +
            '</table>');
    }

    var table = $('#archive_table').DataTable( {
        select: { style: 'single',
            selector: 'td:not(:first-child)'
        },
        responsive: {
            "details": {
                "type": 'column',
                "target": 'tr'
            }
        },
        dom: "lfrtBip",
        order: [ 1, 'asc' ],
        ajax: /*server_url + test_url + 'tests/'*/'',
        columns: [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": '',
                "render": function () {
                    return '<i class="fa fa-plus-square" aria-hidden="true"></i>';
                },
                width: "15px"
            },
            {data: "name"},
            {data: "version"},
            {data: "dateTest"},
            {data: "dateBegin"},
            {data: "dateEnd"},
            {
                data: "files",
                render: function ( d ) {
                    return d.length ?
                        d.length+' result(s)' :
                        'No result';
                },
                title: "Result"
            }
        ],
        select: true,
        scrollY: true,
        buttons: [],

        initComplete: function() {
            // Add event listener for opening and closing details
            $('#archive_table').on('click', 'td.details-control', function () {
                var tr = $(this).closest('tr');
                var tdi = tr.find("i.fa");
                var row = table.row(tr);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                    tdi.first().removeClass('fa-minus-square');
                    tdi.first().addClass('fa-plus-square');
                }
                else {
                    // Open this row
                    row.child(format(row.data())).show();
                    tr.addClass('shown');
                    tdi.first().removeClass('fa-plus-square');
                    tdi.first().addClass('fa-minus-square');
                }
            });
        }
    });

    var data_table = $('#data_table').DataTable( {
        select: {
            style: 'os',
            selector: 'td:first-child'
        },
        order: [[ 1, 'asc' ]],

        dom: "lfrtBip",
        ajax: server_url + data_url + 'instruments/',
        rowId: 'id',
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
        buttons: [],
        scrollY: true,
    });

    var strategy_table = $('#strategy_table').DataTable( {
        select: {
            style: 'os',
            selector: 'td:first-child'
        },
        order: [[ 1, 'asc' ]],

        dom: "lfrtBip",
        ajax: server_url + strat_url + 'strategies/',
        rowId: 'id',
        columns: [
            {
                "className":      'select-checkbox select-checkbox-all',
                "orderable":      false,
                "data":           null,
                "defaultContent": '',
                targets: 0,
                width: "15px"
            },
            {data: "name"},
            {data: "version"},
            {data: "description"}
        ],
        select: true,
        buttons: [
            {
                text: "Add",
                className: 'btn-dark-control',
                action: function () {
                    setStrategyData('', '', 'add');
                    strat_action = 'load';
                    showEditor();
                }
            },
            {
                extend: "selectedSingle",
                text: "Replace",
                className: 'btn-dark-control',
                action: function () {
                    let rowIdx = strategy_table.row( {selected: true } ).index();
                    setStrategyData(strategy_table.cell( rowIdx, 1 ).data(),
                                    strategy_table.cell( rowIdx, 3 ).data(),
                                    'replace');
                    strat_action = 'update';
                    showEditor();
                }
            },
            {
                extend: "selectedSingle",
                text: "View",
                className: 'btn-dark-control',
                action: function () {
                    table.ajax.url(server_url + test_url + 'tests/' + strategy_id + '/').load();
                    //$('#archive_table').DataTable().ajax.reload(null, false);
                }
            },
            {   extend: "remove",
                className: 'btn-red-control',
                editor: editor_strategy
            },
            {
                extend: "selectedSingle",
                text: "Test",
                className: 'btn-dark-control',
                action: function () {
                    strat_action = 'test';
                    chooseAction();
                }
            }
        ],
        scrollY: true,
    });

    $('#data_table').on('click', 'tr', function () {
        if (data_id == data_table.row(this).id()) {
            data_id = '';
        } else {
            data_id = data_table.row(this).id();
        }
        //alert('Clicked row id '+ data_id);
    });

    $('#strategy_table').on('click', 'tr', function () {
        if (strategy_id == strategy_table.row(this).id()) {
            strategy_id = '';
        } else {
            strategy_id = strategy_table.row(this).id();
        }
        //alert('Clicked row id '+ strategy_id);
    });

    uploadStrategies();

    if ($(window).width() <= 716) {
        document.getElementById('strategy-editor-block').removeAttribute("style");
        document.getElementById('strategy-editor-block').setAttribute("style", 'width: 100%');
        document.getElementById('strategy-result-block').removeAttribute("style");
        document.getElementById('strategy-result-block').setAttribute("style", 'width: 100%');
    } else {
        document.getElementById('strategy-editor-block').removeAttribute("style");
        document.getElementById('strategy-editor-block').setAttribute("style", 'width: 50%');
        document.getElementById('strategy-result-block').removeAttribute("style");
        document.getElementById('strategy-result-block').setAttribute("style", 'width: 50%');
    }
});


$(window).resize(function () {
    if ($(window).width() <= 716) {
        document.getElementById('strategy-editor-block').removeAttribute("style");
        document.getElementById('strategy-editor-block').setAttribute("style", 'width: 100%');
        document.getElementById('strategy-result-block').removeAttribute("style");
        document.getElementById('strategy-result-block').setAttribute("style", 'width: 100%');
    } else {
        document.getElementById('strategy-editor-block').removeAttribute("style");
        document.getElementById('strategy-editor-block').setAttribute("style", 'width: 50%');
        document.getElementById('strategy-result-block').removeAttribute("style");
        document.getElementById('strategy-result-block').setAttribute("style", 'width: 50%');
    }
})

function showEditor() {
    document.getElementById('strategy-editor-add').removeAttribute("class");
    document.getElementById('strategy-editor-add-button').setAttribute("class", 'd-none');
}

function hideEditor() {
    document.getElementById('strategy-editor-add').setAttribute("class", 'd-none');
    document.getElementById('strategy-editor-add-button').setAttribute("class", 'btn btn-dark');
}

function setStrategyData(name, description, type) {
    if (type == 'add') {
        document.getElementById("stratName").value = name;
        document.getElementById("stratName").removeAttribute("readonly");
        document.getElementById("stratDescription").value = description;
    } else if (type == 'replace') {
        document.getElementById("stratName").value = name;
        document.getElementById("stratName").setAttribute("readonly", "");
        document.getElementById("stratDescription").value = description;
    }

}

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
function loadStrategy(stratName, stratFile, description) {
    let request = {
        name: stratName,
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
function updateStrategy(stratFile, description) {
    let request = {};
    if (stratFile !== '') {
        request = {
            id: strategy_id,
            description: description,
            file: {
                name: document.req_form.stratFile.files[0].name,
                body: stratFile
            }
        };
    } else {
        request = {
            id: strategy_id,
            description: description
        }
    }

    let json = JSON.stringify(request);
    console.log(json)
    return (json);
}


/** Creating json for testing **/
function testStrategy(data, strategy, uuid) {
    /*let req_id = uuidv4();
    console.log(uuidv4)
    if (frdate !== '' && todate !== '') {
        let request = {};
        if (stratFile != null && (stratSelect == '' || stratName !== stratSelect)) {
            request = {
                code: 1201,
                id: req_id,
                frDate: frdate,
                toDate: todate,
                name: stratName,
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
        }*/
        let request = {
            id: uuid,
            id_data: data,
            id_strat: strategy
        }
        let json = JSON.stringify(request);
        console.log(json)
        return (json);
        //sendRequest(json, 1201, req_id, false);
    /*} else {
        return('Dates must be chosen!!!');
    }*/
}


/** Choosing action **/
async function chooseAction () {
    //let frdate = document.req_form.date_begin.value;
    //let todate = document.req_form.date_end.value;
    //let stratSelect = document.req_form.stratSelect.value;
    //let desriptionSelect = document.req_form.descriptionSelect.value;
    let description = document.req_form.stratDescription.value;
    //let stratText = document.forma.textar.value;
    let stratName = document.req_form.stratName.value;
    let stratFile = document.req_form.stratFile.files[0];
    //let action = document.req_form.stratAction.value;

    let strRes = '';

    if (strat_action == 'load') { // Loading strategy
        if (stratFile !== undefined && stratName !== '' && description !== '') {
            let reader = new FileReader();

            reader.readAsDataURL(stratFile); // конвертирует Blob в base64 и вызывает onload

            reader.onload = function() {
                console.log(reader.result)
                if (reader.result != null) {
                    sendLoadStrategyRequest(loadStrategy(stratName, reader.result, description));
                } else {
                    writeString('Error: File is empty', new Date());
                    showEmptyField(document.req_form.fileName);
                }
            };
        } else {
            if (stratFile == undefined) {
                writeString('Error: Choose file with strategy', new Date());
                showEmptyField(document.req_form.fileName);
            }
            if (stratName == '') {
                writeString('Error: Strategy name is empty', new Date());
                showEmptyField(document.req_form.stratName);
            }
            if (description == '') {
                writeString('Error: Strategy description is empty', new Date());
                showEmptyField(document.req_form.stratDescription);
            }
        }

    } else if (strat_action == 'update') { // Updating strategy
        if (strategy_id !== '') {
            if (stratFile !== undefined && description !== '') {
                let reader = new FileReader();

                reader.readAsDataURL(stratFile); // конвертирует Blob в base64 и вызывает onload

                reader.onload = function() {
                    console.log(reader.result)

                    if (reader.result != null) {
                        sendUpdateStrategyRequest(updateStrategy(reader.result, description), strategy_id);
                    } else {
                        writeString('Error: File is empty', new Date());
                        showEmptyField(document.req_form.fileName);
                    }
                };
            } else if (description !== '' && stratFile == undefined) {
                sendUpdateStrategyRequest(updateStrategy('', description), strategy_id);
            } else {
                if (description == '') {
                    writeString("Error: Description can't be empty", new Date());
                    showEmptyField(document.req_form.stratDescription);
                }
                if (document.req_form.fileName.value == '') {
                    writeString('Error: Choose file to replace', new Date());
                    showEmptyField(document.req_form.fileName);
                }
            }
        } else {
            writeString('Error: Choose strategy firstly', new Date());
        }

    } /*else if (action == 'delete') { // Deleting strategy
        if (stratSelect !== '') {
            if (stratSelect == stratName) {
                sendDeleteStrategyRequest(stratSelect);
            } else {
                writeString('Error: Incorrect strategy name',  new Date());
                writeString('Strategy name should be the same with chosen strategy',  new Date());
                showEmptyField(document.req_form.stratName);
            }
        } else {
            writeString('Error: Choose strategy firstly', new Date());
            showEmptyField(document.req_form.stratSelect);
        }

    }*/ else if (strat_action == 'test') { // Testing strategy
        if (data_id !== '') {
            let uuid = uuidv4();
            workStrategyRequest(testStrategy(data_id, strategy_id, uuid), uuid);
        } else {
            writeString('Error: Choose data to start test', new Date());
        }
        /*if (frdate !== '' && todate !== '' && stratName !== '') {
            if (document.req_form.stratFile.files[0] !== undefined) {
                let reader = new FileReader();

                reader.readAsDataURL(stratFile); // конвертирует Blob в base64 и вызывает onload

                reader.onload = function () {
                    console.log(reader.result)
                    let uuid = uuidv4();
                    strRes = testStrategy(frdate, todate, stratSelect, stratName, reader.result, uuid);
                    workStrategyRequest(strRes, 1201, '', 0, uuid);
                };
            } else if (stratSelect !== '') {
                let uuid = uuidv4();
                strRes = testStrategy(frdate, todate, stratSelect, stratName, '', uuid);
                workStrategyRequest(strRes, 1202, '', 0, uuid);
            } else {
                writeString('Error: Choose or upload strategy to start test', new Date());
            }
        } else {
            if (stratName == '') {
                showEmptyField(document.req_form.stratName);
                writeString("Error: Strategy name can't be empty", new Date());
                writeString("Choose or upload strategy to start test", new Date());
            }
            if (frdate == '' || todate == '') {
                showEmptyField(document.req_form.date_begin);
                showEmptyField(document.req_form.date_end);
                writeString('Error: Dates fields must be filled', new Date());
            }
        }*/

    } else {
        writeString('Error: Choose action firstly', new Date());
    }

}


/******************************************************************
 ************************ dataOutput block ************************
 ******************************************************************/

/** Write string in output **/
function writeString(str, now) {
    let strRes = document.res_form.resultText.value;
    //let now = new Date();
    if (strRes !== '') {
        strRes = strRes + '\n';
    }
    if (now.getSeconds() === last_message.getSeconds()) {
        strRes = strRes + str;
    } else {
        strRes = strRes + now.getHours() + ':' + now.getMinutes() + ':' +now.getSeconds() + ' BR> ' + str;
        last_message = now;
    }
    document.res_form.resultText.value = strRes;
}


/******************************************************************
 ************************ pageUpdater block ***********************
 ******************************************************************/

/** Update strategySelector **/
/*
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
*/
/******************************************************************
 ************************ pageLoader block ************************
 ******************************************************************/

/** Uploading strategySelector **/
async function uploadStrategies() {
    /*sendUploadingRequest('strategies');*/
    $('#strategy_table').DataTable().ajax.reload(null, false);
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


function getTestResult (uuid) {
    fetch (server_url + test_url + 'testres/' + uuid + '/', {
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
        .then(res => {
            return res.json();
        })
        .then(res => {
            document.getElementById('result_graph_iframe').setAttribute("src", res.file);
            writeString('Test finished!', new Date());
            writeString('Results:', new Date());
            writeString('Start cash: ' + res.startCash, new Date());
            writeString('End cash: ' + res.endCash, new Date());
            writeString(res.resultData, new Date());
        })
        .catch(e => {
            writeString('Error: ' + e.message, new Date());
        })
}


function getTestStatus (uuid) {
    fetch (server_url + test_url + 'check/' + uuid + '/', {
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
        .then(res => {
            return res.json();
        })
        .then(res => {
            if (res.tstStatus !== 'DONE' && res.tstStatus !== 'ERROR') {
                writeString('Status: ' + res.tstStatus, new Date());
                setTimeout(getTestStatus(uuid), 3000);
            } else if (res.tstStatus == 'DONE') {
                writeString('Status: ' + res.tstStatus, new Date());
                getTestResult(uuid);
            } else if (res.tstStatus == 'ERROR') {
                writeString('Status: ' + res.tstStatus, new Date());
                writeString('Message: ' + res.message, new Date());
            }
        })
        .catch(e => {
            writeString('Error: ' + e.message, new Date());
        })
}





/** Send request to test strategy **/
function workStrategyRequest (blob, uuid) {
    fetch (server_url + test_url + 'tests/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: blob
    })
        .then(res => {
            if (res.status >= 200 && res.status <= 300) {
                writeString('Test started', new Date());
                getTestStatus(uuid);
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
            writeString('Error: ' + e.message, new Date());
            writeString(e.response, new Date());
        })
}


/** Send request to load strategy **/
function sendLoadStrategyRequest(blob) {
    writeString('Start uploading', new Date());
    fetch (server_url + strat_url + 'strategies/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: blob
    })
        .then(res => {
            if (res.status == 200  || res.status == 201) {
                return res;
            } else if (res.status == 204) {
                uploadStrategies();
                writeString('Error: Content was not send', new Date());
            } else if (res.status == 500) {
                writeString(res.message, new Date());
            } else {
                let error = new Error(res.statusText);
                error.response = res;
                throw error;
            }
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            if (res.success == "true") {
                writeString('Strategy uploaded', new Date());
                uploadStrategies();
            } else if (res.success == "false") {
                writeString('Error: Validation error', new Date());
                writeString('Check yor strategy text and retry', new Date());
            }
        })
        .catch(e => {
            writeString('Error: ' + e.message, new Date());
        })
}


/** Send request to update strategy **/
function sendUpdateStrategyRequest(blob, strat_id) {
    writeString('Start updating', new Date());
    fetch (server_url + strat_url +'strategies/' + strat_id + '/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: blob
    })
        .then(res => {
            if (res.status == 200  || res.status == 201) {
                return res;
            } else if (res.status == 204) {
                uploadStrategies();
                writeString('Error: Content was not send', new Date());
            } else if (res.status == 500) {
                writeString(res.message, new Date());
            } else {
                let error = new Error(res.statusText);
                error.response = res;
                throw error;
            }
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            if (res.success == "true") {
                uploadStrategies();
                writeString('Strategy updated', new Date());
            } else if (res.success == "false") {
                writeString('Error: Validation error', new Date());
                writeString('Check yor strategy text and retry', new Date());
            }
        })
        .catch(e => {
            writeString('Error: ' + e.message, new Date());
        })
}


/** Send request to delete strategy **/
/*
function sendDeleteStrategyRequest(stat_name) {
    writeString('Start deleting');
    fetch (server_url + strat_url + 'strategies/' + stat_name, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.status == 200  || res.status == 201) {
                uploadStrategies();
                writeString('Strategy deleted', new Date());
            }  else if (res.status == 500) {
                writeString(res.message, new Date());
            } else {
                let error = new Error(res.statusText);
                error.response = res;
                throw error;
            }
        })
        .catch(e => {
            writeString('Error: ' + e.message, new Date());
        })
}
*/

/** Send request to update data/strategies **/
/*
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
        .then(res => {
            return res.json();
        })
        .then(res => {
            if (req_name == 'strategies') {
                updateStrategySelector(res);
                console.log('Strategy updated');
            } else {
                console.log('Error: Incorrect code');
            }
        })
        .catch(e => {
            console.log('Error: ' + e.message, new Date());
        })
}*/