/*********************** For Strategies **************************/

/******************************************************************
 ************************ pageUpdater block ***********************
 ******************************************************************/

/** Loading table's elements and data**/

var editor_strat; // Editor for archive results
var editor_data; // Editor for data
var editor_strategy; // Editor for strategies
var editor_result; // Editor for current results

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

/*var resul_request_data = {
    data: [
        {
            uuid: "12312413242",
            num: 1
        }
    ]
};*/

/*var result_data = {
   data: [
        {
            num: 1,
            name: 'tst1',
            version: '1',
            timeStart: '11.12.2020',
            dateBegin: '11.12.2020',
            dateEnd: '11.12.2020',
            status: 'DONE',
            files: [
                {id: 0}
            ]
        }
    ],
    files: {
        files: [
            {
                web_path: "plot.html",
                startCash: "1",
                endCash: "2",
                resultData: "hewruryfg3287ohroiwr8o74w21423er23rwqe"
            }
        ]
    }
};*/

/** Init tables and editors **/
$(document).ready(function () {
    $('table.display').DataTable();
    $.fn.dataTable.ext.errMode = 'none';

    /** Archive results table editor **/
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
            noFileText: 'No results'
            }
        ]
    });

    /** Data table editor **/
    editor_data = new $.fn.dataTable.Editor( {
        processing: false,
        serverSide: false,
        ajax:  server_url + data_url + 'instruments/_id_/',
        table: '#data_table',
        idSrc: 'id'
    });

    /** Strategy table editor **/
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

    /** Current results table editor **/
    editor_result = new $.fn.dataTable.Editor( {
        data: result_data.data,
        table: '#results_table',
        idSrc: 'id',
        fields: [ {
            label: "N:",
            name: "num"
        }, {
            label: "Strategy name:",
            name: "name"
        }, {
            label: "Version:",
            name: "version"
        }, {
            label: "Time start:",
            name: "timeStart"
        }, {
            label: "Date begin:",
            name: "dateBegin"
        }, {
            label: "Date end:",
            name: "dateEnd"
        }, {
            label: "Current status:",
            name: "status"
        }, {
            label: "files:",
            name: "files[].id",
            type: "uploadMany",
            display: function (fileId, counter) {
                if (fileId !== null) {
                    return fileId ?
                        '<img src="'+ editor_result.file( 'files', fileId ).web_path + '" style="width=50%; height=50%;"/>' :
                        null;
                }
            },
            clearText: "Clear",
            noFileText: 'No results'
        }
        ]
    });

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
        buttons: []

    });

    /** Strategy table **/
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
        scrollY: true,
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
        ]
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
    //document.getElementById('strategy-editor-add-button').setAttribute("class", 'd-none');
}


/** Hide strategy editor **/
function hideEditor() {
    document.getElementById('strategy-editor-add').setAttribute("class", 'd-none');
    //document.getElementById('strategy-editor-add-button').setAttribute("class", 'btn btn-dark');
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
            console.log(editor.getValue());
        };

        reader.readAsText(file);
        let str = file.name;
        document.req_form.fileName.value = str;
        if (str.indexOf('.py',1) !== -1)  {
            document.req_form.stratName.value = str.slice(0, str.indexOf('.py',1));
        } else {}
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
    let request = {
            id: strategy_id,
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


/** Creating json for testing **/
function testStrategy(data, strategy, uuid) {
        let request = {
            id: uuid,
            id_data: data,
            id_strat: strategy
        }
        let json = JSON.stringify(request);
        console.log(json)
        return (json);
}


/** Choosing action for strategy**/
async function chooseAction () {
    let description = document.req_form.stratDescription.value;
    let stratName = document.req_form.stratName.value;
    let stratFile = document.req_form.stratFile.files[0];

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
    document.getElementById('console-res').value = strRes;
}




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
/*function testStep(code, req_id) {
    let request = {
        code: code,
        id: req_id
    };

    let json = JSON.stringify(request);
    console.log(json)
    return (json);
}*/

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
                error.response = res;
                throw error
            }
        })
        .then(res => {
            return res.json();
        })
        .then(res => {
            //document.getElementById('result_graph_iframe').setAttribute("src", res.file);

            let i;
            for (i = 0; i < (resul_request_data.data.length); i++) {
                if (resul_request_data.data[i].uuid == uuid) {
                    writeString('Test ' + resul_request_data.data[i].num + ' finished', new Date());
                    let file = {
                        id: i
                    };
                    result_data.data[i].files.push(file);
                    //result_data.data[i].files[0].id = i;
                    let files = {
                        web_path: res.file,
                        startCash: res.startCash,
                        endCash: res.endCash,
                        resultData: res.resultData
                    };
                    result_data.files.files.push(files);
                    /*result_data.files.files[i].web_path = res.file;
                    result_data.files.files[i].startCash = res.startCash;
                    result_data.files.files[i].endCash = res.endCash;
                    result_data.files.files[i].resultData = res.resultData;*/

                    $('#results_table').DataTable().clear();
                    $('#results_table').DataTable().rows.add(result_data.data).draw();
                }
            }

            /*writeString('Results:', new Date());
            writeString('Start cash: ' + res.startCash, new Date());
            writeString('End cash: ' + res.endCash, new Date());
            writeString(res.resultData, new Date());*/
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
                        writeString('Status of test ' + resul_request_data.data[i].num + ': ' + res.tstStatus, new Date());
                        result_data.data[i].status = res.tstStatus;

                        $('#results_table').DataTable().clear();
                        $('#results_table').DataTable().rows.add(result_data.data).draw();
                    }
                }
                setTimeout(getTestStatus(uuid), 3000);
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
                writeString('Test ' + (resul_request_data.data.length + 1) +' started', new Date());
                let data_table = $('#data_table').DataTable();
                let strategy_table = $('#strategy_table').DataTable();
                let strat_rowIdx = strategy_table.row( {selected: true } ).index();
                let data_rowIdx = data_table.row( {selected: true } ).index();

                let req_data = {
                    num: resul_request_data.data.length + 1,
                    uuid: uuid
                };
                resul_request_data.data.push(req_data);
                /*resul_request_data.data[resul_request_data.data.length].num = resul_request_data.data.length + 1;
                resul_request_data.data[resul_request_data.data.length].uuid = uuid;*/
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
                console.log(result_data.data);
                /*result_data.data[resul_request_data.data.length].num = resul_request_data.data.length + 1;
                result_data.data[resul_request_data.data.length].name = strategy_table.cell( strat_rowIdx, 1 ).data();
                result_data.data[resul_request_data.data.length].version = strategy_table.cell( strat_rowIdx, 2 ).data();
                result_data.data[resul_request_data.data.length].dateBegin = data_table.cell( data_rowIdx, 3 ).data();
                result_data.data[resul_request_data.data.length].dateEnd = data_table.cell( data_rowIdx, 4 ).data();
                result_data.data[resul_request_data.data.length].timeStart = timeStart.getHours() + ':' + timeStart.getMinutes() + ':' + timeStart.getSeconds();
                result_data.data[resul_request_data.data.length].status = "";*/

                $('#results_table').DataTable().clear();
                $('#results_table').DataTable().rows.add(result_data.data).draw();

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