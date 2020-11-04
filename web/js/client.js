/** Uploading strategy in editor**/
function loadStrategyInEditor() {
    let file = document.getElementById("strfile").files[0];

    let reader = new FileReader();
    reader.onload = function (e) {
        let textArea = document.getElementById("strtext");
        textArea.value = e.target.result;
    };

    reader.readAsText(file);
    let str = file.name;
    if (str.indexOf('.txt',1) !== -1) {
        document.forma.strname.value = str.slice(0, str.indexOf('.txt',1));
    } else if (str.indexOf('.py',1) !== -1)  {
        document.forma.strname.value = str.slice(0, str.indexOf('.py',1));
    } else {}

}

/** Change strategy and description **/
function changeStrategy() {
    let strategyName = document.getElementById("stratSelect");
    let description = document.getElementById("descriptSelect");
    let index = strategyName.selectedIndex;
    document.forma.strname.value = strategyName.value;
    document.forma.descript.value = description.options[index].value;
}