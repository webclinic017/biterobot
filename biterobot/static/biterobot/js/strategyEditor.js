/*********************** For Strategies **************************/

/** Loading table's elements and data**/

var editor_strat;
var last_message = new Date();
/*
(function () {
    var Editor = $.fn.dataTable.Editor;
    Editor.display.details = $.extend(true, {}, Editor.models.displayController, {
        init: function(editor_strat) {
            Editor.display.lightbox.init(editor_strat);

            return Editor.display.details;
        },

        open: function (editor_strat, append, callback) {
            var table = $(editor_strat.s.table).DataTable();
            var row = editor_strat.s.modifier;

            Editor.display.details.close(editor_strat);

            if (editor_strat.mode() === 'create') {
                Editor.display.lightbox.open(editor_strat, append, callback);
            } else {
                table.row(row).child(append).show();
                console.log('test');
                $(table.row(row).node()).addClass('shown');

                if (callback) {
                    callback();
                }
            }
        },
        close: function(editor_strat, callback) {
            Editor.display.lightbox.close(editor_strat, callback);

            var table = $(editor_strat.s.table).DataTable();

            table.rows().every(function() {
                if (this.child.isShown()) {
                    this.child.hide();
                    $(this.node()).removeClass('shown');
                }
            });

            if (callback) {
                callback();
            }
        }
    });

})();
*/
$(document).ready(function () {
    editor_strat = new $.fn.dataTable.Editor( {
        ajax: '/' + test_url + 'tests/_id_/',
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

    function format (d) {
        var rows = '';
        var i;

        for (i = 0; i < (d.files.length); i++) {
            console.log(editor_strat.file( 'files', id = d.files[i].id ).web_path);
            rows = rows + '<tr>' +
                '<img src="'+ editor_strat.file( 'files', id = d.files[i].id ).web_path + '" style="width=50%; height=50%;"/>' +
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
        ajax: '/' + test_url + 'tests/',
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
                        d.length+' image(s)' :
                        'No image';
                },
                title: "Image"
            }
        ],
        select: true,
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
/*
    var table = $('#archive_table').DataTable( {



        dom: "lfrtBip",
        ajax: 'https://a51d6b62-1920-45e4-b298-e0c28a5e20f9.mock.pstmn.io/' + test_url + 'tests/',
        columns: [
            //{data: "checked"},
            {
                className: 'details-control',
                orderable: false,
                data: null,
                defaultContent: ''
            },
            {data: "name"},
            {data: "version"},
            {data: "dateTest"},
            {data: "dateBegin"},
            {data: "dateEnd"},
            {data: "graph"}
        ],
        order: [[ 1, 'asc' ]],
        select: true,
        buttons: [
        ],
        rowCallback: function ( row, data, index ) {
            $('td:first-child', row).attr('title', 'Click to edit');
        }
    });


    $('#archive_table').on( 'click', 'td.details-control', function () {
        var tr = this.parentNode;

        if ( table.row(tr).child.isShown() ) {
            editor_strat.close();
        }
        else {
            editor_strat.open();
            /*editor_strat.edit(
                tr,*/
                /*'Edit row',*/
                /*[
                    {
                        "className": "delete",
                        "label": "Delete row",
                        "fn": function () {
                            // Close the edit display and delete the row immediately
                            editor_strat.close();
                            editor_strat.remove( tr, '', null, false );
                            editor_strat.submit();
                        }
                    }, {
                    "label": "Update row",
                    "fn": function () {
                        editor_strat.submit();
                    }
                }
                ]
        }
    } );*/

    uploadStrategies();
});


/*
$('#archive_table tbody').on('click', 'td.details-control', function () {
    var tr = $(this).parents('tr');
    var row = $('#archive_table').DataTable().row( tr );
    console.log('test');
    if ( row.child.isShown() ) {
        // This row is already open - close it
        row.child.hide();
        tr.removeClass('shown');
    }
    else {
        // Open this row (the format() function would return the data to be shown)
        row.child( format(row.data()) ).show();
        tr.addClass('shown');
    }
} );
*/

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
        code: 1101,
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
function updateStrategy(stratName, stratFile, description) {
    let request = {};
    if (description !== document.req_form.descriptionSelect.value && stratFile !== '') {
        request = {
            code: 1101,
            name: stratName,
            description: description,
            file: {
                name: document.req_form.stratFile.files[0].name,
                body: stratFile
            }
        };
    } else if (description !== document.req_form.descriptionSelect.value && stratFile == '') {
        request = {
            code: 1101,
            name: stratName,
            description: description
        };
    } else if (description == document.req_form.descriptionSelect.value && stratFile !== '') {
        request = {
            code: 1101,
            name: stratName,
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
function testStrategy(frdate, todate, stratSelect, stratName, stratFile, uuid) {
    let req_id = uuidv4();
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
    let stratName = document.req_form.stratName.value;
    let stratFile = document.req_form.stratFile.files[0];
    let action = document.req_form.stratAction.value;

    let strRes = '';

    if (action == 'load') { // Loading strategy
        if (stratFile !== undefined && stratName !== '' && description !== '') {
            let reader = new FileReader();

            reader.readAsDataURL(stratFile); // конвертирует Blob в base64 и вызывает onload

            reader.onload = function() {
                console.log(reader.result)
                if (reader.result != null) {
                    sendLoadStrategyRequest(loadStrategy(stratName, reader.result, description));
                } else {
                    writeString('Error: File is empty', new Date());
                }
            };
        } else {
            if (stratFile == undefined) {
                writeString('Error: File is empty', new Date());
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

    } else if (action == 'update') { // Updating strategy
        if (stratSelect == stratName) {
            if (stratFile !== undefined) {
                let reader = new FileReader();

                reader.readAsDataURL(stratFile); // конвертирует Blob в base64 и вызывает onload

                reader.onload = function() {
                    console.log(reader.result)

                    if (reader.result != null) {
                        sendUpdateStrategyRequest(updateStrategy(stratSelect, reader.result, description), stratSelect);
                    } else {
                        writeString('Error: File is empty', new Date());
                        showEmptyField(document.req_form.fileName);
                    }
                };
            } else if (description !== '' && stratFile == undefined) {
                sendUpdateStrategyRequest(updateStrategy(stratSelect, '', description), stratSelect);
            } else {
                if (stratSelect == '') {
                    writeString('Error: Choose strategy firstly', new Date());
                    showEmptyField(document.req_form.stratSelect);
                } else {
                    writeString("Error: Description can't be empty", new Date());
                    showEmptyField(document.req_form.stratDescription);
                }

            }
        } else {
            if (stratSelect == '') {
                writeString('Error: Choose strategy firstly', new Date());
                showEmptyField(document.req_form.stratSelect);
            } else {
                writeString('Error: Incorrect strategy name',  new Date());
                writeString('Strategy name should be the same with chosen strategy',  new Date());
                showEmptyField(document.req_form.stratName);
            }

        }
    } else if (action == 'delete') { // Deleting strategy
        if (stratSelect !== '') {
            if (stratSelect == stratName) {
                sendDeleteStrategyRequest(stratSelect);
            } else {
                writeString('Error: Incorrect strategy name',  new Date());
                writeString('Strategy name should be the same with chosen strategy',  new Date());
                showEmptyField(document.req_form.stratName);
            }
        } else {
            writeString('Error: Choose strategy firstly');
            showEmptyField(document.req_form.stratSelect);
        }

    } else if (action == 'test') { // Testing strategy
        if (frdate !== '' && todate !== '' && stratName !== '') {
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
        }

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
    if (now.getSeconds() == last_message.getSeconds()) {
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
/*
function workStrategyRequest (blob, reqCode, session, endConnetion, str) {
    fetch ('/' + test_url, {
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
*/


/** Send request to test strategy **/
function workStrategyRequest (blob, reqCode, session, endConnetion, uuid) {
    fetch ('/' + test_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: blob
    })
        .then(res => {
            if (res.status >= 200 && res.status <= 300) {
                writeString('Test started', new Date());
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
        .catch(e => {
            writeString('Error: ' + e.message, new Date());
            writeString(e.response, new Date());
            endConnetion = 2;
        })
    return endConnetion;
}


/** Send request to load strategy **/
function sendLoadStrategyRequest(blob) {
    writeString('Start uploading');
    fetch ('/' + strat_url + 'strategies/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: blob
    })
        .then(res => {
            if (res.status == 200  || res.status == 201) {
                uploadStrategies();
                writeString('Strategy uploaded', new Date());
            } else if (res.status == 204) {
                writeString('Error: Content was not send', new Date());
            } else if (res.status == 500) {
                writeString(res.message);
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


/** Send request to update strategy **/
function sendUpdateStrategyRequest(blob, stat_name) {
    writeString('Start updating');
    fetch ('/' + strat_url +'strategies/' + stat_name, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: blob
    })
        .then(res => {
            if (res.status == 200  || res.status == 201) {
                uploadStrategies();
                writeString('Strategy updated', new Date());
            } else if (res.status == 204) {
                uploadStrategies();
                writeString('Error: Content was not send', new Date());
            } else if (res.status == 500) {
                writeString(res.message);
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


/** Send request to delete strategy **/
function sendDeleteStrategyRequest(stat_name) {
    writeString('Start deleting');
    fetch ('/' + strat_url + 'strategies/' + stat_name, {
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


/** Send request to update data/strategies **/
function sendUploadingRequest (req_name) {
    fetch ('/' + strat_url + req_name + '/', {
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
            } else {
                console.log('Error: Incorrect code');
            }
        })
        .catch(e => {
            console.log('Error: ' + e.message, new Date());
        })
}