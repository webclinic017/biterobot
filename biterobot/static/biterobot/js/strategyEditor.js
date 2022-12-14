/*********************** For Strategies **************************/

/******************************************************************
 ************************ pageUpdater block ***********************
 ******************************************************************/

/** Loading table's elements and data**/

var editor_strat; // Editor for archive results

var last_message = new Date(); // Time of last message in console

var data_id = ''; // row id in data_table
var strategy_id = ''; // row id in strategy table
var strat_action = ''; // action with strategy (add/replace/test)

// json with current results data
var result_data = {
    data: [],
    files: {
        files: []
    }
};

// structure to link uuid with row id in current result table
var resul_request_data = {
    data: []
};

/** Init tables and editors **/
$(document).ready(function () {

    $('table.display').DataTable();
    $.fn.dataTable.ext.errMode = 'none';

    /** Archive results table editor **/
    /*
    editor_strat = new $.fn.dataTable.altEditor( {
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
            noFileText: 'No results'
            }
        ]
    });
*/

    /** Child row for archive results table **/
    function format (d) {
        var rows = '';
        var i;

        for (i = 0; i < (d.files.length); i++) {
            rows = rows + '<tr>' +
                    '<iframe src="'+ editor_strat.file( 'files', id = d.files[i].id ).web_path + '" height="550px" scrolling="auto"></iframe>' +
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

    /** Child row for current results table **/
    function formatResult (d) {
        var rows = '';
        var i;

        for (i = 0; i < (d.files.length); i++) {
            rows = rows + '<tr>' +
                    '<iframe src="'+ result_data.files.files[d.files[i].id].web_path + '" height="550px" scrolling="auto"></iframe>' +
                '</tr>' +
                '<tr><h4>Start cash: ' + result_data.files.files[d.files[i].id].startCash + '</h4></tr>' +
                '<tr><h4>End cash: ' + result_data.files.files[d.files[i].id].endCash + '</h4></tr>' +
                '<tr>' +
                    '<textarea class="form-control" style="min-height: 150px;width: 100%;background: rgb(24,24,24);color: rgb(255,255,255);">' +
                        result_data.files.files[d.files[i].id].resultData + '</textarea>' +
                '</tr>';

        }
        return ('<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
            rows +
            '</table>');
    }

    /** Archive results table **/
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
        ajax: '',
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
        altEditor: true,
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

    /** Data table **/
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
        scrollY: true,
        altEditor: true,
        buttons: []

    });

    /** Strategy table **/
    var strategy_table = $('#strategy_table').DataTable( {
        /*select: {
            style: 'os',
            selector: 'td:first-child'
        },*/
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
        select: 'single',
        responsive: true,
        scrollY: true,
        altEditor: true,
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
            {   extend: "selected",
                className: 'btn-red-control',
                text: "Delete",
                name: "delete"
            },
            {
                extend: "selectedSingle",
                text: "Test",
                className: 'btn-green-control',
                action: function () {
                    strat_action = 'test';
                    chooseAction();
                }
            }
        ],
        onDeleteRow: function(datatable, rowdata, success, error) {
            $.ajax({
                // a tipycal url would be /{id} with type='DELETE'
                url: server_url + strat_url + 'strategies/' + strategy_table.row( {selected: true } ).id() + '/',
                type: 'DELETE',
                data: rowdata,
                success: success,
                error: error
            });
        }
    });

    /** Current results table **/
    var results_table = $('#results_table').DataTable( {
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
        data: result_data.data,
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
            {data: "num"},
            {data: "name"},
            {data: "version"},
            {data: "timeStart"},
            {data: "dateBegin"},
            {data: "dateEnd"},
            {data: "status"},
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
        altEditor: true,
        buttons: [],

        initComplete: function() {
            // Add event listener for opening and closing details
            $('#results_table').on('click', 'td.details-control', function () {
                var tr = $(this).closest('tr');
                var tdi = tr.find("i.fa");
                var row = results_table.row(tr);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                    tdi.first().removeClass('fa-minus-square');
                    tdi.first().addClass('fa-plus-square');
                }
                else {
                    // Open this row
                    row.child(formatResult(row.data())).show();
                    tr.addClass('shown');
                    tdi.first().removeClass('fa-plus-square');
                    tdi.first().addClass('fa-minus-square');
                }
            });
        }
    });

    /** Set row id of data table **/
    $('#data_table').on('click', 'tr', function () {
        if (data_id == data_table.row(this).id()) {
            data_id = '';
        } else {
            data_id = data_table.row(this).id();
        }
    });

    /** Set row id of strategy table **/
    $('#strategy_table').on('click', 'tr', function () {
        if (strategy_id == strategy_table.row(this).id()) {
            strategy_id = '';
        } else {
            strategy_id = strategy_table.row(this).id();
            if (strat_action == 'update') {
                let rowIdx = strategy_table.row(this).index();
                setStrategyData(strategy_table.cell( rowIdx, 1 ).data(),
                    strategy_table.cell( rowIdx, 3 ).data(),
                    'replace');
            }
        }
    });

    //uploadStrategies();
    /** Set blocks width **/
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


/** Change blocks width **/
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


/** Show strategy editor **/
function showEditor() {
    document.getElementById('strategy-editor-add').removeAttribute("class");
}


/** Hide strategy editor **/
function hideEditor() {
    document.getElementById('strategy-editor-add').setAttribute("class", 'd-none');
}


/** Ste strategy name and description **/
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
            editor.setValue(e.target.result.toString());
        };

        reader.readAsText(file);
        let str = file.name;
        document.req_form.fileName.value = str;
        if (strat_action == 'load') {
            if (str.indexOf('.py',1) !== -1)  {
                document.req_form.stratName.value = str.slice(0, str.indexOf('.py',1));
            } else {}
        }
    } else {
        editor.setValue('');
        document.req_form.fileName.value = '';
    }
}


/** Clear result console **/
function clearResults() {
    document.getElementById('console-res').value = '';
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

/** UUID generation **/
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
            name: stratName + '.py',
            body: stratFile
        }
    };

    let json = JSON.stringify(request);
    return (json);
}


/** Creating json for updating **/
function updateStrategy(stratFile, description, stratName) {
    let request = {
            id: strategy_id,
            description: description,
            file: {
                name: stratName + '.py',
                body: stratFile
            }
        };

    let json = JSON.stringify(request);
    return (json);
}


/** Creating json for testing **/
function testStrategy(data, strategy, uuid) {
        let request = {
            id: uuid,
            id_data: data,
            id_strat: strategy
        }
        let json = JSON.stringify(request);
        return (json);
}


/** Choosing action for strategy**/
async function chooseAction () {
    let description = document.req_form.stratDescription.value;
    let stratName = document.req_form.stratName.value;
    let stratFile = new Blob([editor.getValue()], {type: 'text/plain'});
    if (strat_action == 'load') { // Loading strategy
        if (editor.getValue() !== '' && stratName !== '' && description !== '') {
            let reader = new FileReader();

            reader.readAsDataURL(stratFile); // convert Blob to base64 and call onload

            reader.onload = function() {
                //console.log(reader.result)
                if (reader.result != null) {
                    sendLoadStrategyRequest(loadStrategy(stratName, reader.result, description), stratName);
                } else {
                    writeString('Error: File is empty', new Date());
                    showEmptyField(document.req_form.fileName);
                }
            };
        } else {
            if (editor.getValue() !== '') {
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
            if (editor.getValue() !== '' && description !== '') {
                let reader = new FileReader();

                reader.readAsDataURL(stratFile); // convert Blob to base64 and call onload

                reader.onload = function() {
                    //console.log(reader.result)

                    if (reader.result != null) {
                        sendUpdateStrategyRequest(updateStrategy(reader.result, description, stratName), strategy_id);
                    } else {
                        writeString('Error: File is empty', new Date());
                        showEmptyField(document.req_form.fileName);
                    }
                };
            } else {
                if (description == '') {
                    writeString("Error: Description can't be empty", new Date());
                    showEmptyField(document.req_form.stratDescription);
                }
                if (editor.getValue() !== '') {
                    writeString('Error: Choose file to replace', new Date());
                    showEmptyField(document.req_form.fileName);
                }
            }
        } else {
            writeString('Error: Choose strategy firstly', new Date());
        }

    } else if (strat_action == 'test') { // Testing strategy
        if (data_id !== '') {
            let uuid = uuidv4();
            workStrategyRequest(testStrategy(data_id, strategy_id, uuid), uuid);
        } else {
            writeString('Error: Choose data to start test', new Date());
        }
    } else {
        writeString('Error: Choose action firstly', new Date());
    }

}


/******************************************************************
 ************************ dataOutput block ************************
 ******************************************************************/


/** Write string in console **/
function writeString(str, now) {
    let strRes = document.getElementById('console-res').value;
    if (strRes !== '') {
        strRes = strRes + '\n';
    }
    if (now.getSeconds() === last_message.getSeconds()) {
        strRes = strRes + str;
    } else {
        strRes = strRes + now.getHours() + ':' + now.getMinutes() + ':' +now.getSeconds() + ' BR> ' + str;
        last_message = now;
    }
    document.getElementById('console-res').value = strRes;
}


/******************************************************************
 ************************ pageLoader block ************************
 ******************************************************************/


/** Uploading strategySelector **/
async function uploadStrategies() {
    $('#strategy_table').DataTable().ajax.reload(null, false);
}


/******************************************************************
 ********************** messageBroker block ***********************
 ******************************************************************/


/** Send request to get results of test **/
function getTestResult (uuid) {
    fetch (server_url + test_url + 'testres/' + uuid + '/', {
        method: 'GET'
    })
        .then(res => {
            if (res.status >= 200 && res.status <= 300) {
                return res;
            } else {
                let error = new Error(res.statusText);
                writeString('HTTP response code: ' + res.status, new Date());
                error.response = res;
                throw error
            }
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            let i;
            for (i = 0; i < (resul_request_data.data.length); i++) {
                if (resul_request_data.data[i].uuid == uuid) {
                    writeString('Test ' + resul_request_data.data[i].num + ' finished', new Date());
                    let file = {
                        id: i
                    };
                    result_data.data[i].files.push(file);
                    result_data.files.files[i].web_path = res.file;
                    result_data.files.files[i].startCash = res.startCash;
                    result_data.files.files[i].endCash = res.endCash;
                    result_data.files.files[i].resultData = res.resultData;

                    $('#results_table').DataTable().clear();
                    $('#results_table').DataTable().rows.add(result_data.data).draw();
                }
            }
        })
        .catch(e => {
            writeString('Error: ' + e.message, new Date());
        })
}


/** Send check status request **/
function getTestStatus (uuid) {
    fetch (server_url + test_url + 'check/' + uuid + '/', {
        method: 'GET'
    })
        .then(res => {
            if (res.status >= 200 && res.status <= 300) {
                return res;
            } else {
                let error = new Error(res.statusText);
                writeString('HTTP response code: ' + res.status, new Date());
                error.response = res;
                throw error
            }
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            if (res.tstStatus !== 'DONE' && res.tstStatus !== 'ERROR') {
                let i;
                for (i = 0; i < (resul_request_data.data.length); i++) {
                    if (resul_request_data.data[i].uuid == uuid) {
                        if (res.tstStatus !== result_data.data[i].status) {
                            writeString('Status of test ' + resul_request_data.data[i].num + ': ' + res.tstStatus, new Date());
                        result_data.data[i].status = res.tstStatus;

                        $('#results_table').DataTable().clear();
                        $('#results_table').DataTable().rows.add(result_data.data).draw();
                        }
                    }
                }
                setTimeout(getTestStatus(uuid), 1000);
            } else if (res.tstStatus == 'DONE') {
                let i;
                for (i = 0; i < (resul_request_data.data.length); i++) {
                    if (resul_request_data.data[i].uuid == uuid) {
                        writeString('Status of test ' + resul_request_data.data[i].num + ': ' + res.tstStatus, new Date());
                        result_data.data[i].status = res.tstStatus;

                        $('#results_table').DataTable().clear();
                        $('#results_table').DataTable().rows.add(result_data.data).draw();
                    }
                }
                getTestResult(uuid);
            } else if (res.tstStatus == 'ERROR') {
                let i;
                for (i = 0; i < (resul_request_data.data.length); i++) {
                    if (resul_request_data.data[i].uuid == uuid) {
                        writeString('Status of test ' + resul_request_data.data[i].num + ': ' + res.tstStatus, new Date());
                        writeString('Message: ' + res.message, new Date());
                        result_data.data[i].status = res.tstStatus;

                        $('#results_table').DataTable().clear();
                        $('#results_table').DataTable().rows.add(result_data.data).draw();
                    }
                }
            }
        })
        .catch(e => {
            writeString('Error: ' + e.message, new Date());
        })
}


/** Send request to test strategy **/
function workStrategyRequest (blob, uuid) {
    let timeStart = new Date();
    fetch (server_url + test_url + 'tests/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: blob
    })
        .then(res => {
            if (res.status >= 200 && res.status <= 300) {

            } else {
                let error = new Error(res.statusText);
                writeString('HTTP response code: ' + res.status, new Date());
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
        })

    writeString('Test ' + (resul_request_data.data.length + 1) +' created', new Date());
        let data_table = $('#data_table').DataTable();
        let strategy_table = $('#strategy_table').DataTable();
        let strat_rowIdx = strategy_table.row( {selected: true } ).index();
        let data_rowIdx = data_table.row( {selected: true } ).index();

        let req_data = {
            num: resul_request_data.data.length + 1,
            uuid: uuid
        };
        resul_request_data.data.push(req_data);
        let data = {
            num:  resul_request_data.data.length,
            name: strategy_table.cell( strat_rowIdx, 1 ).data(),
            version: strategy_table.cell( strat_rowIdx, 2 ).data(),
            dateBegin: data_table.cell( data_rowIdx, 3 ).data(),
            dateEnd: data_table.cell( data_rowIdx, 4 ).data(),
            timeStart: timeStart.getHours() + ':' + timeStart.getMinutes() + ':' + timeStart.getSeconds(),
            status: '',
            files: []
        };
        result_data.data.push(data);

        let files = {
            web_path: '',
            startCash: '',
            endCash: '',
            resultData: ''
        };
        result_data.files.files.push(files);

        //console.log(result_data.data);

    $('#results_table').DataTable().clear();
    $('#results_table').DataTable().rows.add(result_data.data).draw();

    getTestStatus(uuid);
}


/** Send request to load strategy **/
function sendLoadStrategyRequest(blob, stratName) {
    writeString('Start uploading strategy: ' + stratName, new Date());
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
                writeString('Error: Validation error', new Date());
                writeString('Check yor strategy and retry', new Date());
                //writeString(res.message, new Date());
            } else {
                let error = new Error(res.statusText);
                error.response = res;
                writeString('HTTP response code: ' + res.status, new Date());
                throw error;
            }
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            if (res.success == "true") {
                writeString('Strategy ' + stratName + ' uploaded', new Date());
                uploadStrategies();
            } else if (res.success == "false") {
                writeString('Error: Validation error of ' + stratName, new Date());
                writeString('Check yor strategy text and retry', new Date());
            }
        })
        .catch(e => {
            writeString('Error: ' + e.message, new Date());
        })
}


/** Send request to update strategy **/
function sendUpdateStrategyRequest(blob, strat_id) {
    let strategy_table = $('#strategy_table').DataTable();
    let strat_rowIdx = strategy_table.row( {selected: true } ).index();
    let stratName = strategy_table.cell( strat_rowIdx, 1 ).data();
    writeString('Start updating strategy: ' + stratName, new Date());
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
                writeString('Error: Validation error', new Date());
                writeString('Check yor strategy and retry', new Date());
                //writeString('There are some errors on the server side', new Date());
                //writeString(res.message, new Date());
            } else {
                let error = new Error(res.statusText);
                writeString('HTTP response code: ' + res.status, new Date());
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
                writeString('Strategy ' + stratName + ' updated', new Date());
            } else if (res.success == "false") {
                writeString('Error: Validation error', new Date());
                writeString('Check yor strategy and retry', new Date());
            }
        })
        .catch(e => {
            writeString('Error: ' + e.message, new Date());
        })
}
