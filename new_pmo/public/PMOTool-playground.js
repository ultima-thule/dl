//---------------------- MAIN PMOMENU FUNCTIONS ------------------------------//

// main function responsible for adding entire pmoenu to browser/page
function addButtons() {

    var menu_val = '<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600" rel="stylesheet" type="text/css">';
    menu_val += '<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">';
    menu_val += '<style>.pmoMenuContainer, .pmoMenuContainer *, .pmoMenuContainer *:before, .pmoMenuContainer *:after{margin: 0; padding: 0; box-sizing: border-box;}.pmoMenuContainer{box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);}.pmoMenu{width: auto; margin: 0 auto 0 auto; background-color: #d2e4e6; z-index: 99999;}.pmoMenu ul{font-size: 0; list-style-type: none; z-index: 99999}.pmoMenu ul li{font-family: "Open Sans", sans-serif; font-size: 1rem; font-weight: 400; color: #333; display: inline-block; padding: 15px; position: relative;}.pmoMenu ul li.external{font-family: "Open Sans", sans-serif; font-size: 1rem; font-weight: 400; color: #333; display: inline-block; padding: 0; position: relative;}.pmoMenu ul li ul{display: none;}.pmoMenu ul li:hover{cursor: pointer; background-color: #c4e4e8;}.pmoMenu ul li:hover ul{display: block; margin-top: 15px; width: auto; left: 0; position: absolute; white-space: nowrap;}.pmoMenu ul li:hover ul li{display: block; background-color: #d2e4e6;}.pmoMenu ul li:hover ul li:hover{background-color: #c4e4e8;}.pmoMenu ul li:hover ul li:hover span{background-color: #ee204e;}li.external{float: right; padding: 0 !important;}li.external a, li.external a:hover{display: block; padding: 15px; color: inherit !important; text-decoration: none;}li.external a i.fa-info, li.external a i.fa-key, li.teams i.fa-male{margin-right: 5px;}li.pmoMenuClose{float: right;}</style>';
    menu_val += '<div class="pmoMenuContainer">';
    menu_val += '<div class="pmoMenu"> <ul>  i';
    menu_val += '<li onClick="hideMe(pmoMenu.teams)" title="Filtrowanie zespołów na liście witrynek projektowych" class="teams">';
    menu_val += '<i class="fa fa-male"></i>Pokaż moje teamy</li>';
    menu_val += '<li onClick="pwGen()" title="Generowanie dokumentu porozumienia wykonawczego (Word) na podstawie zawartości Confluence">Generuj zakres</li>';

    menu_val += '<li title="Generowanie podstrony sprintu w ramach danego projektu">Generuj stronę sprintu <i class="fa fa-angle-down"></i>  ';
    menu_val += '<ul><li onClick="sprintGen()">Strona sprintu (kryteria akceptacji)</li>';
    menu_val += '<li onClick="sprintDescGen()">Strona sprintu (opis)</li>';
    menu_val += '<li onClick="sprintPastGen()">Strona sprintu z przeszłości (kryteria akceptacji)</li>';
    menu_val += '<li onClick="sprintDescPastGen()">Strona sprintu z przeszłości (opis)</li>';
    menu_val += '</ul></li>';

    menu_val += '<li title="Generowanie kosztorysu dla projektu">Generuj kosztorys <i class="fa fa-angle-down"></i> ';
    menu_val += '<ul><li onClick="costGenGeneral()">Kosztorys bez subtasków</li>  ';
    menu_val += '<li onClick="costGenDetailed()">Kosztorys z subtaskami</li> </ul>  </li> ';
    menu_val += '<li title="Generowanie awaryjne kompletnej dokumentacji całego projektu"><b>EMERGENCY</b> <i class="fa fa-angle-down"></i> ';
    menu_val += '<ul><li onClick="fullGen()">Dokumentacja projektu (kryteria akceptacji)</li> ';
    menu_val += '<li onClick="fullGenDesc()">Dokumentacja projektu (opis)</li> </ul> </li> ';
    menu_val += '<li onClick="pmoMenuClose()" class="pmoMenuClose"><i class="fa fa-window-close-o fa-2"></i></li> ';
    menu_val += '<li title="Dokumentacja PMO Menu na Confluence" class="external"><a href="http://doc.grupa.onet/display/AG/PMO+Menu" target="_blank"><i class="fa fa-info"></i>Dokumentacja</a></li>';
    menu_val += '</ul></div></div>';

    $("header#header").append(menu_val); 
};

// closing and cleaning up after the pmomenu
function pmoMenuClose() {
    $(".pmoMenuContainer").remove();
    $("script[src$='PMOTool.js']").remove();
    $("link[href$='http://fonts.googleapis.com/css?family=Open+Sans:400,300,600']").remove();
    $("link[href$='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css']").remove();
};


//---------------------- LAYER GLOBAL & COMMON FUNCTIONS ------------------------------//

// main layer function which adds common element like wrappers, header, icons, styles for them etc.
function pmoMenuLayer() {

    // adding necessary css styles
    $("head").append('<style>.pmoMenuLayer {position: fixed; display: block; width: auto; height: auto; top:0; bottom:0; left:0; right:0; background-color: rgba(0, 0, 0, .6); z-index: 9999999; overflow: hidden;} .pmoMenuLayerShadow {position: relative; display: block; margin: 0 auto; width: 80%; height: auto; margin-top: 2em; color: #ffffff; background-color: rgba(0, 0, 0, .65)} .pmoMenuLayerShadowWrapper {display: block; position: relative; padding: 2em 2em;} #pmoMenuTitle {color: #ffffff;} .pmoMenuLayerShadow i.close {position: absolute; right: 0.5em; top: 0.5em; font-size: 2em;} .pmoMenuLayerShadow i.close:hover {cursor: pointer;} #formMessage {display: block; margin: 2em 0;}</style>');

    // adding necessary html code
    $("body").prepend('<div class="pmoMenuLayer"><div class="pmoMenuLayerShadow" id="pmoMenuLayerShadow"><div class="pmoMenuLayerShadowWrapper"><h1 id="pmoMenuTitle"></h1><div id="formWrapper"></div><p id="formMessage"></p></div><i onclick="pmoMenuLayerClose()" class="fa fa-window-close-o fa-2 close"></div></div>');

    // closing entire layer when clicked outside the shadow layer
    $('.pmoMenuLayer').click(function(e) {
        if (e.target.id != 'pmoMenuLayerShadow' && $(e.target).parents('#pmoMenuLayerShadow').length == 0) {
            pmoMenuLayerClose();
        }
    });
}

// closing and cleaning up after the layer
function pmoMenuLayerClose() {
    $(".pmoMenuLayer").remove(); 
}


//---------------------- SPECIFIC FUNCTIONS FOR PMOMENU OPTIONS ------------------------------//

// main function for generating scope (Generuj zakres), starting layer with proper data
function pwGen() {
    // taking project code from jira/confluence
    var projectCode = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent;

    // starting layer with default elements
    pmoMenuLayer();
    
    // adding styles for specific elements
    $("head").append('<style>#pwGenProjectCode {display: inline-block; box-sizing: border-box; margin: 2em 2em 0 0; color: #00000; background: #afe3e9; border: 0 none; padding: 10px 10px; outline: 0; width: 400px; -webkit-appearance: none; -moz-appearance: none;} #pwGenGenerate {display: inline-block; width: 100px; margin-top: 2em; background: #205081; font-weight: bold; color: white; border: 0 none; cursor: pointer; padding: 10px 5px;}</style>');
    
    // adding specific html elements
    $("#formWrapper").prepend('<input id="pwGenProjectCode" name="pwGenProjectCode" type="text" placeholder="Wprowadź kod projektu."><button onclick="pwGenSecond()" id="pwGenGenerate" type="submit" value="Generuj">GENERUJ</button>');
    
    // adding proper title/header
    $("#pmoMenuTitle").prepend('Generuj zakres');
    
    // putting project code to the input (if it was taken from jira/confluence)
    document.getElementById("pwGenProjectCode").setAttribute('value', projectCode);
};

// exact function for generating final document from the layer view
function pwGenSecond() {
    projectCode = $('#pwGenProjectCode').val();
    if (projectCode === null || projectCode == ""){
        document.getElementById('formMessage').innerHTML = "";
        $("#formMessage").append('Błąd: błędny kod projektu. Sprawdź ponownie wprowadzane dane.');
    }
    else {
        document.getElementById('formMessage').innerHTML = "";
        window.open ("http://pmo.cloud.onet/api/genscope/" + projectCode);
        $("#formMessage").append('Generowanie zakresu dla projektu ' + projectCode + '.');
    }
};

// main function for generating cost document (Generuj kosztorys), starting layer with proper data
function costGenGeneral() {
    // taking project code from jira/confluence
    var projectCode = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent;
    
    // starting layer with default elements
    pmoMenuLayer();

    // adding styles for specific elements
    $("head").append('<style>#costGenProjectCode {display: inline-block; box-sizing: border-box; margin: 2em 2em 0 0; color: #00000; background: #afe3e9; border: 0 none; padding: 10px 10px; outline: 0; width: 400px; -webkit-appearance: none; -moz-appearance: none;} #costGenOptions {display: inline-block; box-sizing: border-box; margin-right: 2em; color: #00000; background: #afe3e9; border: 0 none; padding: 10px 10px; outline: 0;} #costGenGenerate {display: inline-block; width: 100px; margin-top: 2em; background: #205081; font-weight: bold; color: white; border: 0 none; cursor: pointer; padding: 10px 5px;}</style>');
    
    // adding specific html elements
    $("#formWrapper").prepend('<input id="costGenProjectCode" name="costGenProjectCode" type="text" placeholder="Wprowadź kod projektu."><select id="costGenOptions"><option>z subtaskami</option><option>bez subtasków</option></select><button onclick="" id="costGenGenerate" type="submit" value="Generuj">GENERUJ</button>');
    
    // adding proper title/header
    $("#pmoMenuTitle").prepend('Generuj kosztorys');
    
    // putting project code to the input (if it was taken from jira/confluence)
    document.getElementById("costGenProjectCode").setAttribute('value', projectCode);   
}

// exact function for generating final cost document (without subtasks) from the layer view
function costGenGeneralSecond() {
    if (projectCode === undefined || projectCode == '') {
        document.getElementById('formMessage').innerHTML = "";
        $("#formMessage").append('Błąd: błędny kod projektu. Sprawdź ponownie wprowadzane dane.');
    }
    else {
        document.getElementById('formMessage').innerHTML = "";
       $("#formMessage").append('Generowanie kosztorysu dla projektu ' + projectCode + '.');
    };
};

// exact function for generating final cost document (with subtasks) from the layer view
function costGenDetailedSecond() {
    if (projectCode === undefined || projectCode == '') {
        document.getElementById('formMessage').innerHTML = "";
        $("#formMessage").append('Błąd: błędny kod projektu. Sprawdź ponownie wprowadzane dane.');
    }
    else {
        document.getElementById('formMessage').innerHTML = "";
        $("#formMessage").append('Generowanie kosztorysu dla projektu ' + projectCode + '.');
        window.open ("http://pmo.cloud.onet/api/genestimate2/" + projectCode);
    };
};




















//
function fullGen() {
    var projectCode = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent;
    if(projectCode === undefined || projectCode == ''){
        projectCode = prompt("Wpisz kod projektu:");
    };
    if(projectCode == null || projectCode == "" ){
        alert("Dziękujemy za rezygnację generowania pw dla projektu");
    };
    window.open ("http://pmo.cloud.onet/api/updateall/" + projectCode);
};

//
function fullGenDesc() {
    var projectCode = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent;
    if(projectCode === undefined || projectCode == ''){
        projectCode = prompt("Wpisz kod projektu:");
    };
    if(projectCode == null || projectCode == "" ){
        alert("Dziękujemy za rezygnację generowania pw dla projektu");
    };
    window.open ("http://pmo.cloud.onet/api/updatealldesc/" + projectCode);
};

//
function sprintGen(){
    // taking sprint ID from Jira board view
    if ($("a.aui-nav-item").attr("data-link-id") === "com.pyxis.greenhopper.jira:global-sidebar-plan-scrum") {
         // plan/backlog mode
         var sprintId = $(".ghx-sprint-meta").attr("data-sprint-id");
    //if ($("li.aui-nav-selected").attr("data-link-id") === "com.pyxis.greenhopper.jira:global-sidebar-plan-scrum") {
    //    // plan/backlog mode
    //    var sprintId = $(".js-sprint-header").attr("data-sprint-id");
    } else {
        // work/current sprint mode
        var sprintId = $(".ghx-sprint-meta").attr("data-sprint-id");
    }
    var projectCode = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent;
    var apiUrl = "http://pmo.cloud.onet/api/createpw/" + projectCode + "/sprint/" + sprintId;
    create = $.get(apiUrl)
        .done(function(){
            alert("Subpage for project " + projectCode + " has been created.");
        })
        .fail(function (jqXHR, textStatus, error) {
            alert('Wystąpił problem, sprawdź poprawność wprowadzanych danych.');
        })
};

//
function sprintPastGen(){
    // taking sprint ID from Jira board view
    var projectCode = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent;
    var sprintId = prompt("Wpisz identyfikator sprintu:");
    if (sprintId == null || sprintId == "") {
            alert("Dziękujemy za rezygnację z wygenerowania sprintu");
            return;
    } else {
    var apiUrl = "http://pmo.cloud.onet/api/createpw/" + projectCode + "/sprint/" + sprintId;
    create = $.get(apiUrl)
        .done(function(){
            alert("Subpage for project " + projectCode + " has been created.");
        })
        .fail(function (jqXHR, textStatus, error) {
            alert('Wystąpił problem, sprawdź poprawność wprowadzanych danych.');
        })
    }
};

//
function sprintDescGen(){
    // taking sprint ID from Jira board view

    if ($("a.aui-nav-item").attr("data-link-id") === "com.pyxis.greenhopper.jira:global-sidebar-plan-scrum") {
         // plan/backlog mode
        var sprintId = $(".ghx-sprint-meta").attr("data-sprint-id");
    //if ($("li.aui-nav-selected").attr("data-link-id") === "com.pyxis.greenhopper.jira:global-sidebar-plan-scrum") {
    //    // plan/backlog mode
    //    var sprintId = $(".js-sprint-header").attr("data-sprint-id");
    } else {
        // work/current sprint mode
        var sprintId = $(".ghx-sprint-meta").attr("data-sprint-id");
    }
    var projectCode = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent;
    var apiUrl = "http://pmo.cloud.onet/api/createpwdesc/" + projectCode + "/sprint/" + sprintId;
    create = $.get(apiUrl)
        .done(function(){
            alert("Subpage for project " + projectCode + " has been created.");
        })
        .fail(function (jqXHR, textStatus, error) {
            alert(error);
            //alert("There are some errors. If you are using Confluence try to switch to the Jira.");
        })
};

//
function sprintDescPastGen(){
    // taking sprint ID from Jira board view
    var sprintId = prompt("Wpisz identyfikator sprintu:");
    if (sprintId == null || sprintId == "") {
            alert("Dziękujemy za rezygnację z wygenerowania sprintu");
            return;
    } else {
    var projectCode = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent;
    var apiUrl = "http://pmo.cloud.onet/api/createpwdesc/" + projectCode + "/sprint/" + sprintId;
    create = $.get(apiUrl)
        .done(function(){
            alert("Subpage for project " + projectCode + " has been created.");
        })
        .fail(function (jqXHR, textStatus, error) {
            alert(error);
            //alert("There are some errors. If you are using Confluence try to switch to the Jira.");
        })
    }
};

//
function hideMe(arrayId){
    arrayId = typeof arrayId == 'string' ? [ arrayId ] : arrayId;
    const elements = [];
    arrayId.forEach(function(id){
        elements.push($(id).parent().parent().index());
    });
    const found = $(arrayId[0]).parent().parent();
    const parent = found.parent();
    parent.children().each(function(ind, el){
        console.log(elements, ind);
        if(elements.indexOf($(el).index()) == -1 ){
            $(el).hide();
        }
    });
};

// currently not working, deleted from pmomenu options
function openProject(){
    alert("In progress");
};

function closeProject(){
    alert("In progress");
};

// currently not working, deleted from pmomenu options
function portfolioGen(){
    window.open ("http://pmo.cloud.onet/api/genportfolio/");
};