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

/** Loading table's elements **/
$(document).ready(function () {
    $('#data_table').DataTable();
    $('.dataTables_length').addClass('bs-select');
});

/** Changing style of editor **/
function changeEditorStyle() {
    var editor = ace.edit("editor");
    editor.setTheme(document.req_form.seletTheam.value);
    editor.session.setMode("ace/mode/python");
}


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