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

function pwGen() {
    var projectCode = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent;
    pmoMenuLayer();
    $("head").append('<style>#pwGenProjectCode {display: inline-block; box-sizing: border-box; margin: 3em 0 2em 4em; color: #ffffff; background: rgba(49, 177, 255, 0.9); border: 0 none; padding: 10px 20px; outline: 0; width: 400px; -webkit-appearance: none; -moz-appearance: none;} #pwGenGenerate {display: inline-block; width: 100px; margin: 2em 0 3em 2em; background: rgba(87, 61, 255, .8); font-weight: bold;  color: white; border: 0 none; cursor: pointer; padding: 10px 5px;}</style>');
    $(".pmoMenuLayerWrapper").prepend('<input id="pwGenProjectCode" name="pwGenProjectCode" type="text" placeholder="Wprowadź kod projektu."><button onclick="pwGenSecond()" id="pwGenGenerate" type="submit" value="Generuj">GENERUJ</button>');
    document.getElementById("pwGenProjectCode").setAttribute('value', projectCode);
};

function costGen() {
    var projectCode = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent;
    if(projectCode === undefined || projectCode == ''){
        projectCode = prompt("Wpisz kod projektu:");
    };
    if(projectCode == null || projectCode == "" ){
        alert("Dziękujemy za rezygnację generowania pw dla projektu");
    };
    window.open ("http://pmo.cloud.onet/api/genestimate/" + projectCode);
};

function costGen2() {
    var projectCode = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent;
    if(projectCode === undefined || projectCode == ''){
        projectCode = prompt("Wpisz kod projektu:");
    };
    if(projectCode == null || projectCode == "" ){
        alert("Dziękujemy za rezygnację generowania pw dla projektu");
    };
    window.open ("http://pmo.cloud.onet/api/genestimate2/" + projectCode);
};

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

function portfolioGen(){
    window.open ("http://pmo.cloud.onet/api/genportfolio/");
};

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

// Project management
function openProject(){
    alert("In progress");
};

function closeProject(){
    alert("In progress");
};

//---------------------- MAIN MENU FUNCTIONS------------------------------//
function pmoMenuClose() {
    $(".pmoMenuContainer").remove();
    $("script[src$='PMOTool.js']").remove();
    $("link[href$='http://fonts.googleapis.com/css?family=Open+Sans:400,300,600']").remove();
    $("link[href$='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css']").remove();
};

function addButtons() {
    //$("header#header").append('<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600" rel="stylesheet" type="text/css"><link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"><style>.pmoMenuContainer, .pmoMenuContainer *, .pmoMenuContainer *:before, .pmoMenuContainer *:after{margin: 0; padding: 0; box-sizing: border-box;}.pmoMenuContainer{box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);}.pmoMenu{width: auto; margin: 0 auto 0 auto; background-color: #d2e4e6; z-index: 99999;}.pmoMenu ul{font-size: 0; list-style-type: none; z-index: 99999}.pmoMenu ul li{font-family: "Open Sans", sans-serif; font-size: 1rem; font-weight: 400; color: #333; display: inline-block; padding: 15px; position: relative;}.pmoMenu ul li.external{font-family: "Open Sans", sans-serif; font-size: 1rem; font-weight: 400; color: #333; display: inline-block; padding: 0; position: relative;}.pmoMenu ul li ul{display: none;}.pmoMenu ul li:hover{cursor: pointer; background-color: #c4e4e8;}.pmoMenu ul li:hover ul{display: block; margin-top: 15px; width: auto; left: 0; position: absolute; white-space: nowrap;}.pmoMenu ul li:hover ul li{display: block; background-color: #d2e4e6;}.pmoMenu ul li:hover ul li:hover{background-color: #c4e4e8;}.pmoMenu ul li:hover ul li:hover span{background-color: #ee204e;}li.external{float: right; padding: 0 !important;}li.external a, li.external a:hover{display: block; padding: 15px; color: inherit !important; text-decoration: none;}li.external a i.fa-info, li.external a i.fa-key, li.teams i.fa-male{margin-right: 5px;}li.pmoMenuClose{float: right;}</style><div class="pmoMenuContainer"> <div class="pmoMenu"> <ul> <li onClick="hideMe(pmoMenu.teams)" title="Filtrowanie zespołów na liście witrynek projektowych" class="teams"><i class="fa fa-male"></i>Pokaż moje teamy</li><li onClick="pwGen()" title="Generowanie dokumentu porozumienia wykonawczego (Word) na podstawie zawartości Confluence">Generuj zakres</li><li title="Generowanie podstrony sprintu w ramach danego projektu">Generuj stronę sprintu <i class="fa fa-angle-down"></i> <ul> <li onClick="sprintGen()">Strona sprintu (kryteria akceptacji)</li><li onClick="sprintDescGen()">Strona sprintu (opis)</li></ul> </li><li title="Generowanie kosztorysu dla projektu">Generuj kosztorys <i class="fa fa-angle-down"></i> <ul> <li onClick="costGen()">Kosztorys bez subtasków</li><li onClick="costGen2()">Kosztorys z subtaskami</li></ul> </li><li onClick="portfolioGen()" title="Obecnie nieużywane">Generuj dane z portfolio</li><li onClick="pmoMenuClose()" class="pmoMenuClose"><i class="fa fa-window-close-o fa-2"></i></li><li title="Dokumentacja PMO Menu na Confluence" class="external"><a href="http://doc.grupa.onet/display/AG/PMO+Menu" target="_blank"><i class="fa fa-info"></i>Dokumentacja</a></li><li title="Pełna wersja PMO Tools" class="external"><a href="http://pmo.cloud.onet" target="_blank"><i class="fa fa-key"></i>PMO Tools</a></li></ul> </div></div>');
    //$("header#header").append('
    //        <link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600" rel="stylesheet" type="text/css">
    //        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    //        <style>.pmoMenuContainer, .pmoMenuContainer *, .pmoMenuContainer *:before, .pmoMenuContainer *:after{margin: 0; padding: 0; box-sizing: border-box;}.pmoMenuContainer{box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);}.pmoMenu{width: auto; margin: 0 auto 0 auto; background-color: #d2e4e6; z-index: 99999;}.pmoMenu ul{font-size: 0; list-style-type: none; z-index: 99999}.pmoMenu ul li{font-family: "Open Sans", sans-serif; font-size: 1rem; font-weight: 400; color: #333; display: inline-block; padding: 15px; position: relative;}.pmoMenu ul li.external{font-family: "Open Sans", sans-serif; font-size: 1rem; font-weight: 400; color: #333; display: inline-block; padding: 0; position: relative;}.pmoMenu ul li ul{display: none;}.pmoMenu ul li:hover{cursor: pointer; background-color: #c4e4e8;}.pmoMenu ul li:hover ul{display: block; margin-top: 15px; width: auto; left: 0; position: absolute; white-space: nowrap;}.pmoMenu ul li:hover ul li{display: block; background-color: #d2e4e6;}.pmoMenu ul li:hover ul li:hover{background-color: #c4e4e8;}.pmoMenu ul li:hover ul li:hover span{background-color: #ee204e;}li.external{float: right; padding: 0 !important;}li.external a, li.external a:hover{display: block; padding: 15px; color: inherit !important; text-decoration: none;}li.external a i.fa-info, li.external a i.fa-key, li.teams i.fa-male{margin-right: 5px;}li.pmoMenuClose{float: right;}</style>
    //        <div class="pmoMenuContainer"> 
    //        <div class="pmoMenu">
    //            <ul> 
    //            <li onClick="hideMe(pmoMenu.teams)" title="Filtrowanie zespołów na liście witrynek projektowych" class="teams"><i class="fa fa-male"></i>Pokaż moje teamy</li>
    //            <li onClick="pwGen()" title="Generowanie dokumentu porozumienia wykonawczego (Word) na podstawie zawartości Confluence">Generuj zakres</li>
    //            <li title="Generowanie podstrony sprintu w ramach danego projektu">Generuj stronę sprintu <i class="fa fa-angle-down"></i> 
    //            <ul> 
    //                <li onClick="sprintGen()">Strona sprintu (kryteria akceptacji)</li>
    //                <li onClick="sprintDescGen()">Strona sprintu (opis)</li>
    //            </ul> </li>
    //            <li title="Generowanie kosztorysu dla projektu">Generuj kosztorys <i class="fa fa-angle-down"></i> 
    //                <ul> 
    //                    <li onClick="costGen()">Kosztorys bez subtasków</li>
    //                    <li onClick="costGen2()">Kosztorys z subtaskami</li>
    //                </ul> 
    //            </li>
    //            <li title="Generowanie awaryjne kompletnej dokumentacji całego projektu"><b>EMERGENCY</b> <i class="fa fa-angle-down"></i> 
    //            <ul> 
    //                <li onClick="fullGen()">Dokumentacja projektu(kryteria akceptacji)</li>
    //                <li onClick="fullGenDesc()">Dokumentacja projektu (opis)</li>
    //            </ul> </li>
    //            <li onClick="portfolioGen()" title="Obecnie nieużywane">Generuj dane z portfolio</li>
    //            <li onClick="pmoMenuClose()" class="pmoMenuClose"><i class="fa fa-window-close-o fa-2"></i></li>
    //            <li title="Dokumentacja PMO Menu na Confluence" class="external"><a href="http://doc.grupa.onet/display/AG/PMO+Menu" target="_blank"><i class="fa fa-info"></i>Dokumentacja</a></li><li title="Pełna wersja PMO Tools" class="external"><a href="http://pmo.cloud.onet" target="_blank"><i class="fa fa-key"></i>PMO Tools</a></li></ul> </div></div>');

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
    menu_val += '<ul><li onClick="costGen()">Kosztorys bez subtasków</li>  ';
    menu_val += '<li onClick="costGen2()">Kosztorys z subtaskami</li> </ul>  </li> ';
    menu_val += '<li title="Generowanie awaryjne kompletnej dokumentacji całego projektu"><b>EMERGENCY</b> <i class="fa fa-angle-down"></i> ';
    menu_val += '<ul><li onClick="fullGen()">Dokumentacja projektu (kryteria akceptacji)</li> ';
    menu_val += '<li onClick="fullGenDesc()">Dokumentacja projektu (opis)</li> </ul> </li> ';
    menu_val += '<li onClick="portfolioGen()" title="Obecnie nieużywane">Generuj dane z portfolio</li> ';
    menu_val += '<li title="Zarządzanie projektem">Projekt <i class="fa fa-angle-down"></i> ';
    menu_val += '<ul><li onClick="openProject()">Uruchom projekt</li>';
    menu_val += '<li onClick="closeProject()">Zamknij projekt</li>';
    menu_val += '</ul></li> ';
    menu_val += '<li onClick="pmoMenuClose()" class="pmoMenuClose"><i class="fa fa-window-close-o fa-2"></i></li> ';
    menu_val += '<li title="Dokumentacja PMO Menu na Confluence" class="external"><a href="http://doc.grupa.onet/display/AG/PMO+Menu" target="_blank"><i class="fa fa-info"></i>Dokumentacja</a></li>';
    menu_val += '<li onclick="pmoMenuLayer()">LAYER</li>';
    menu_val += '</ul></div></div>';

    $("header#header").append(menu_val); 
    //$("header#header").append('<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600" rel="stylesheet" type="text/css"><link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"> <style>.pmoMenuContainer, .pmoMenuContainer *, .pmoMenuContainer *:before, .pmoMenuContainer *:after{margin: 0; padding: 0; box-sizing: border-box;}.pmoMenuContainer{box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);}.pmoMenu{width: auto; margin: 0 auto 0 auto; background-color: #d2e4e6; z-index: 99999;}.pmoMenu ul{font-size: 0; list-style-type: none; z-index: 99999}.pmoMenu ul li{font-family: "Open Sans", sans-serif; font-size: 1rem; font-weight: 400; color: #333; display: inline-block; padding: 15px; position: relative;}.pmoMenu ul li.external{font-family: "Open Sans", sans-serif; font-size: 1rem; font-weight: 400; color: #333; display: inline-block; padding: 0; position: relative;}.pmoMenu ul li ul{display: none;}.pmoMenu ul li:hover{cursor: pointer; background-color: #c4e4e8;}.pmoMenu ul li:hover ul{display: block; margin-top: 15px; width: auto; left: 0; position: absolute; white-space: nowrap;}.pmoMenu ul li:hover ul li{display: block; background-color: #d2e4e6;}.pmoMenu ul li:hover ul li:hover{background-color: #c4e4e8;}.pmoMenu ul li:hover ul li:hover span{background-color: #ee204e;}li.external{float: right; padding: 0 !important;}li.external a, li.external a:hover{display: block; padding: 15px; color: inherit !important; text-decoration: none;}li.external a i.fa-info, li.external a i.fa-key, li.teams i.fa-male{margin-right: 5px;}li.pmoMenuClose{float: right;}</style> <div class="pmoMenuContainer"> <div class="pmoMenu"> <ul>  <li onClick="hideMe(pmoMenu.teams)" title="Filtrowanie zespołów na liście witrynek projektowych" class="teams"><i class="fa fa-male"></i>Pokaż moje teamy</li> <li onClick="pwGen()" title="Generowanie dokumentu porozumienia wykonawczego (Word) na podstawie zawartości Confluence">Generuj zakres</li>  <li title="Generowanie podstrony sprintu w ramach danego projektu">Generuj stronę sprintu <i class="fa fa-angle-down"></i>  <ul>  <li onClick="sprintGen()">Strona sprintu (kryteria akceptacji)</li> <li onClick="sprintDescGen()">Strona sprintu (opis)</li> </ul> </li> <li title="Generowanie kosztorysu dla projektu">Generuj kosztorys <i class="fa fa-angle-down"></i> <ul> <li onClick="costGen()">Kosztorys bez subtasków</li>  <li onClick="costGen2()">Kosztorys z subtaskami</li> </ul>  </li> <li title="Generowanie awaryjne kompletnej dokumentacji całego projektu"><b>EMERGENCY</b> <i class="fa fa-angle-down"></i>  <ul>  <li onClick="fullGen()">Dokumentacja projektu(kryteria akceptacji)</li> <li onClick="fullGenDesc()">Dokumentacja projektu (opis)</li> </ul> </li> <li onClick="portfolioGen()" title="Obecnie nieużywane">Generuj dane z portfolio</li> <li onClick="pmoMenuClose()" class="pmoMenuClose"><i class="fa fa-window-close-o fa-2"></i></li> <li title="Dokumentacja PMO Menu na Confluence" class="external"><a href="http://doc.grupa.onet/display/AG/PMO+Menu" target="_blank"><i class="fa fa-info"></i>Dokumentacja</a></li><li title="Pełna wersja PMO Tools" class="external"><a href="http://pmo.cloud.onet" target="_blank"><i class="fa fa-key"></i>PMO Tools</a></li></ul> </div></div>');
    };

    // LAYER 1.0 //

    function pmoMenuLayerClose() {
        $(".pmoMenuLayer").remove(); 
    }

    function pmoMenuLayer() {
        $("head").append('<style>.pmoMenuLayer {position: fixed; display: block; width: auto; height: auto; top:0; bottom:0; left:0; right:0; background-color: rgba(0, 0, 0, .6); z-index: 9999999; overflow: hidden;} .pmoMenuLayerWrapper {position: relative; dispplay: block; margin: 0 auto; width: 80%; height: auto; margin-top: 2em; color: #ffffff; background-color: rgba(0, 0, 0, .65)} .pmoMenuLayerWrapper i {position: absolute; right: 0.5em; top: 0.5em; font-size: 2em;} .pmoMenuLayerWrapper i:hover {cursor: pointer;} #formMessage {display: inline-block; margin: 2em 0 2em 2em;}</style>');
        $("body").prepend('<div class="pmoMenuLayer"><div class="pmoMenuLayerWrapper"><p id="formMessage"></p><i onclick="pmoMenuLayerClose()" class="fa fa-window-close-o fa-2"></div></div>');
    }