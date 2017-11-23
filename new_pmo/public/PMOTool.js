//---------------------- MAIN PMOMENU FUNCTIONS ------------------------------//

// main function responsible for adding entire pmoenu to browser/page
function addButtons() {
    
    // checking if pmomenu is already added
    if ($('.pmoMenuContainer').length > 0) { 
        
        // checking if layer with message is already shown
        if ($('.pmoMenuLayer').length == 0) { 
            
        // starting layer with default elements
        pmoMenuLayer();
        
        // adding proper title/header
        $("#pmoMenuTitle").prepend('Błąd dodawania PMO Menu');
        
        // error message
        document.getElementById('formMessage').innerHTML = "";
        $("#formMessage").append('PMO Menu jest już dodane do strony.');
        
        }
        
    } else {

        var menu_val = '<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600" rel="stylesheet" type="text/css">';
        menu_val += '<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">';
        menu_val += '<style>.pmoMenuContainer, .pmoMenuContainer *, .pmoMenuContainer *:before, .pmoMenuContainer *:after{margin: 0; padding: 0; box-sizing: border-box;}.pmoMenuContainer{box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);}.pmoMenu{width: auto; margin: 0 auto 0 auto; background-color: #d2e4e6; z-index: 99999;}.pmoMenu ul{font-size: 0; list-style-type: none; z-index: 99999}.pmoMenu ul li{font-family: "Open Sans", sans-serif; font-size: 1rem; font-weight: 400; color: #333; display: inline-block; padding: 15px; position: relative;}.pmoMenu ul li.external{font-family: "Open Sans", sans-serif; font-size: 1rem; font-weight: 400; color: #333; display: inline-block; padding: 0; position: relative;}.pmoMenu ul li ul{display: none;}.pmoMenu ul li:hover{cursor: pointer; background-color: #c4e4e8;}.pmoMenu ul li:hover ul{display: block; margin-top: 15px; width: auto; left: 0; position: absolute; white-space: nowrap;}.pmoMenu ul li:hover ul li{display: block; background-color: #d2e4e6;}.pmoMenu ul li:hover ul li:hover{background-color: #c4e4e8;}.pmoMenu ul li:hover ul li:hover span{background-color: #ee204e;}li.external{float: right; padding: 0 !important;}li.external a, li.external a:hover{display: block; padding: 15px; color: inherit !important; text-decoration: none;}li.external a i.fa-info, li.external a i.fa-key, li.teams i.fa-male{margin-right: 5px;}li.pmoMenuClose{float: right;}</style>';
        menu_val += '<div class="pmoMenuContainer">';
        menu_val += '<div class="pmoMenu"> <ul>  i';
        menu_val += '<li onClick="hideMe(pmoMenu.teams)" title="Filtrowanie zespołów na liście witrynek projektowych" class="teams">';
        menu_val += '<i class="fa fa-male"></i>Pokaż moje teamy</li>';
        menu_val += '<li onClick="pwGen()" title="Generowanie dokumentu porozumienia wykonawczego (Word) na podstawie zawartości Confluence">Generuj zakres</li>';

        menu_val += '<li title="Generowanie podstrony sprintu w ramach danego projektu">Generuj stronę sprintu <i class="fa fa-angle-down"></i>  ';
        menu_val += '<ul><li onClick="sprintGen(\'withCriteria\')">Strona sprintu (kryteria akceptacji)</li>';
        menu_val += '<li onClick="sprintGen(\'withDescription\')">Strona sprintu (opis)</li>';
        menu_val += '</ul></li>';

        menu_val += '<li title="Generowanie kosztorysu dla projektu">Generuj kosztorys <i class="fa fa-angle-down"></i> ';
        menu_val += '<ul><li onClick="costGenGeneral(\'withoutSubtasks\')">Kosztorys bez subtasków</li>  ';
        menu_val += '<li onClick="costGenGeneral(\'withSubtasks\')">Kosztorys z subtaskami</li> </ul>  </li> ';
        menu_val += '<li title="Generowanie awaryjne kompletnej dokumentacji całego projektu"><b>EMERGENCY</b> <i class="fa fa-angle-down"></i> ';
        menu_val += '<ul><li onClick="fullGen(\'withCriteria\')">Dokumentacja projektu (kryteria akceptacji)</li> ';
        menu_val += '<li onClick="fullGen(\'withDescription\')">Dokumentacja projektu (opis)</li> </ul> </li> ';
        menu_val += '<li onClick="pmoMenuClose()" class="pmoMenuClose"><i class="fa fa-window-close-o fa-2"></i></li> ';
        menu_val += '<li title="Dokumentacja PMO Menu na Confluence" class="external"><a href="http://doc.grupa.onet/display/AG/PMO+Menu" target="_blank"><i class="fa fa-info"></i>Dokumentacja</a></li>';
        menu_val += '</ul></div></div>';

        $("header#header").append(menu_val); 
        
    }
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
    $("head").append('<style>.pmoMenuLayer {position: fixed; display: block; width: auto; height: auto; top:0; bottom:0; left:0; right:0; background-color: rgba(0, 0, 0, .6); z-index: 9999999; overflow: hidden;} .pmoMenuLayerShadow {position: relative; display: block; margin: 0 auto; width: 80%; height: auto; margin-top: 2em; color: #ffffff; background-color: rgba(0, 0, 0, .65)} .pmoMenuLayerShadowWrapper {display: block; position: relative; padding: 2em 2em;} #pmoMenuTitle {color: #ffffff;} .pmoMenuLayerShadow i.close {position: absolute; right: 0.5em; top: 0.5em; font-size: 2em;} .pmoMenuLayerShadow i.close:hover {cursor: pointer;} .generateButton {display: inline-block; width: 100px; margin-top: 2em; background: rgb(32, 80, 129); font-weight: bold; color: white; border: 0 none; cursor: pointer; padding: 10px 5px;} .generateButton:hover {background: rgb(18, 61, 105)} #formMessage {display: block; margin: 2em 0; color: #ffffff} #loader {display: none;}</style>');

    // adding necessary html code
    $("body").prepend('<div class="pmoMenuLayer"><div class="pmoMenuLayerShadow" id="pmoMenuLayerShadow"><div class="pmoMenuLayerShadowWrapper"><h1 id="pmoMenuTitle"></h1><div id="formWrapper"></div><p id="formMessage"></p><img id="loader" src="http://pmo.cloud.onet/loader.svg"></div><i onclick="pmoMenuLayerClose()" class="fa fa-window-close-o fa-2 close"></div></div>');

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

// POKAŻ MOJE TEAMY

// exact function to hide different than configured teams in confluence tree
function hideMe(arrayId) {
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


// GENERUJ ZAKRES

// main function for generating scope (Generuj zakres), starting layer with proper data
function pwGen() {
    // taking project code from jira/confluence
    var projectCode = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent;

    // starting layer with default elements
    pmoMenuLayer();
    
    // adding styles for specific elements
    $("head").append('<style>#pwGenProjectCode {display: inline-block; box-sizing: border-box; margin: 2em 2em 0 0; color: #00000; background: #afe3e9; border: 0 none; padding: 10px 10px; outline: 0; width: 400px; -webkit-appearance: none; -moz-appearance: none;}</style>');
    
    // adding specific html elements
    $("#formWrapper").prepend('<input id="pwGenProjectCode" name="pwGenProjectCode" type="text" placeholder="Wprowadź kod projektu."><button onclick="pwGenSecond()" id="pwGenGenerate" class="generateButton" type="submit" value="Generuj">GENERUJ</button>');
    
    // adding proper title/header
    $("#pmoMenuTitle").prepend('Generuj zakres');
    
    // putting project code to the input (if it was taken from jira/confluence)
    document.getElementById("pwGenProjectCode").setAttribute('value', projectCode);
};

// exact function for generating final document from the layer view
function pwGenSecond() {
    projectCode = $('#pwGenProjectCode').val();
    // checking if necessary inputs are fulfilled
    if (projectCode === null || projectCode == ""){
        // errors
        document.getElementById('formMessage').innerHTML = "";
        $("#formMessage").append('Błąd: brak kodu projektu. Sprawdź ponownie wprowadzane dane.');
    }
    else {
        // success
        document.getElementById('formMessage').innerHTML = "";
        window.open ("http://pmo.cloud.onet/api/genscope/" + projectCode);
        $("#formMessage").append('Żadanie wygenerowania zakresu projektu ' + projectCode + ' zostało wysłane.');
    }
};


// GENERUJ KOSZTORYS

// main function for generating cost document (Generuj kosztorys), starting layer with proper data
function costGenGeneral(type) {
    // taking project code from jira/confluence
    var projectCode = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent;
    
    // starting layer with default elements
    pmoMenuLayer();

    // adding styles for specific elements
    $("head").append('<style>#costGenProjectCode {display: inline-block; box-sizing: border-box; margin: 2em 2em 0 0; color: #00000; background: #afe3e9; border: 0 none; padding: 10px 10px; outline: 0; width: 400px; -webkit-appearance: none; -moz-appearance: none;} #costGenOptions {display: inline-block; box-sizing: border-box; margin-right: 2em; color: #00000; background: #afe3e9; border: 0 none; padding: 10px 10px; outline: 0;}}</style>');
    
    // adding specific html elements
    $("#formWrapper").prepend('<input id="costGenProjectCode" name="costGenProjectCode" type="text" placeholder="Wprowadź kod projektu."><select id="costGenOptions" onchange="changeTargetCostGeneration()"><option>z subtaskami</option><option>bez subtasków</option></select><button onclick="" id="costGenGenerate" class="generateButton" type="submit" value="Generuj">GENERUJ</button>');
    
    // choosing proper option as default from select field
    if (type == 'withSubtasks') { 
        $("#costGenOptions").prop("selectedIndex", 0);
        document.getElementById('costGenGenerate').setAttribute('onclick','costGenDetailedSecond()');
    } else {
        $("#costGenOptions").prop("selectedIndex", 1);
        document.getElementById('costGenGenerate').setAttribute('onclick','costGenGeneralSecond()'); 
    };
    
    // adding proper title/header
    $("#pmoMenuTitle").prepend('Generuj kosztorys');
    
    // putting project code to the input (if it was taken from jira/confluence)
    document.getElementById("costGenProjectCode").setAttribute('value', projectCode);   
}

// choosing proper function to execute based on selected option
function changeTargetCostGeneration() {
    if (document.getElementById("costGenOptions").selectedIndex == '0') {
        document.getElementById('costGenGenerate').setAttribute('onclick','costGenDetailedSecond()');
    } else {
        document.getElementById('costGenGenerate').setAttribute('onclick','costGenGeneralSecond()');  
    };
}

// exact function for generating final cost document (without subtasks) from the layer view
function costGenGeneralSecond() {
    // taking project code from input field
    var projectCode = $("#costGenProjectCode").val();
    // check if project code is not empty
    if (projectCode === undefined || projectCode == '') {
        // empty project code = error message
        document.getElementById('formMessage').innerHTML = "";
        $("#formMessage").append('Błąd: brak kodu projektu. Sprawdź ponownie wprowadzane dane.');
    }
    else {
        // correct project code = final generate with success message
        document.getElementById('formMessage').innerHTML = "";
        $("#formMessage").append('Żadanie wygenerowania kosztorysu projektu ' + projectCode + ' zostało wysłane.');
        window.open ("http://pmo.cloud.onet/api/genestimate/" + projectCode);
    };
};

// exact function for generating final cost document (with subtasks) from the layer view
function costGenDetailedSecond() {
    // taking project code from input field
    var projectCode = $("#costGenProjectCode").val();
    // check if project code is not empty
    if (projectCode === undefined || projectCode == '') {
        // empty project code = error message
        document.getElementById('formMessage').innerHTML = "";
        $("#formMessage").append('Błąd: brak kodu projektu. Sprawdź ponownie wprowadzane dane.');
    }
    else {
        // correct project code = final generate with success message
        document.getElementById('formMessage').innerHTML = "";
        $("#formMessage").append('Żadanie wygenerowania kosztorysu projektu ' + projectCode + ' zostało wysłane.');
        window.open ("http://pmo.cloud.onet/api/genestimate2/" + projectCode);
    };
};


// GENERUJ STRONĘ SPRINTU

// main function for generating sprint page (Generuj stronę sprintu), starting layer with proper data
function sprintGen(type) {
    // taking project code from jira/confluence
    var projectCode = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent;
    
    // taking sprint id from jira/confluence
    var sprintId;
    if ($("li.aui-nav-selected a.aui-nav-item").attr("data-link-id") === "com.pyxis.greenhopper.jira:global-sidebar-plan-scrum") {
         // backlog mode
        sprintId = $(".ghx-selected").parents('.js-sprint-container').attr("data-sprint-id");
    } else if ($("li.aui-nav-selected a.aui-nav-item").attr("data-link-id") === "com.pyxis.greenhopper.jira:global-sidebar-work-scrum") {
        // current sprint mode
        sprintId = $(".ghx-sprint-meta").attr("data-sprint-id");
    } else {
        // default
        sprintId = '';
    }

    // starting layer with default elements
    pmoMenuLayer();

    // adding styles for specific elements
    $("head").append('<style>#pwGenProjectCode {display: inline-block; box-sizing: border-box; margin: 2em 2em 0 0; color: #00000; background: #afe3e9; border: 0 none; padding: 10px 10px; outline: 0; width: 400px; -webkit-appearance: none; -moz-appearance: none;} #pwGenSprint {display: inline-block; box-sizing: border-box; margin-right: 2em; color: #00000; background: #afe3e9; border: 0 none; padding: 10px 10px; outline: 0; width: 150px; -webkit-appearance: none; -moz-appearance: none;} #pwGenOptions {display: inline-block; box-sizing: border-box; margin-right: 2em; color: #00000; background: #afe3e9; border: 0 none; padding: 10px 10px; outline: 0;}</style>');
    
    // adding specific html elements
    $("#formWrapper").prepend('<input id="pwGenProjectCode" name="pwGenProjectCode" type="text" placeholder="Wprowadź kod projektu."><input id="pwGenSprint" name="pwGenSprint" type="text" placeholder="Wprowadź ID sprintu."><select id="pwGenOptions" onchange="changeTargetPwGeneration()"><option>z kryteriami akceptacji</option><option>z opisem</option></select><button onclick="" id="pwGenGenerate" class="generateButton" type="submit" value="Generuj">GENERUJ</button>');
    
    // choosing proper option as default from select field
    if (type == 'withCriteria') { 
        $("#pwGenOptions").prop("selectedIndex", 0);
        document.getElementById('pwGenGenerate').setAttribute('onclick','sprintCriteriaGen()');
    } else {
        $("#pwGenOptions").prop("selectedIndex", 1);
        document.getElementById('pwGenGenerate').setAttribute('onclick','sprintDescGen()'); 
    };
    
    // adding proper title/header
    $("#pmoMenuTitle").prepend('Generuj stronę sprintu');
    
    // putting project code to the input (if it was taken from jira/confluence)
    document.getElementById("pwGenProjectCode").setAttribute('value', projectCode); 
    
    // putting sprint ID to the input (if it was taken from jira/confluence)
    document.getElementById("pwGenSprint").setAttribute('value', sprintId);  
    
}

// choosing proper function to execute based on selected option
function changeTargetPwGeneration() {
    if (document.getElementById("pwGenOptions").selectedIndex == '0') {
        document.getElementById('pwGenGenerate').setAttribute('onclick','sprintCriteriaGen()');
    } else {
        document.getElementById('pwGenGenerate').setAttribute('onclick','sprintDescGen()');  
    };
}

// exact function to generate sprint page with acceptance criteria
function sprintCriteriaGen() {
    
    // taking project code and sprint ID from the layer form
    var projectCode = $("#pwGenProjectCode").val();
    var sprintId = $("#pwGenSprint").val();
    
    // checking if necessary inputs are fulfilled
    if (projectCode === null || projectCode == "" || sprintId === null || sprintId == "") {
        // errors
        document.getElementById('formMessage').innerHTML = "";
        $("#formMessage").append('Błąd: formularz niekompletny. Sprawdź ponownie wprowadzane dane.');
    } else {
        // success
        // configuring api
        var apiUrl = "http://pmo.cloud.onet/api/createpw/" + projectCode + "/sprint/" + sprintId;

        // api request
        create = $.ajax({
            url: apiUrl,
            cache: false,
            beforeSend: function() {
                document.getElementById('formMessage').innerHTML = "";
                $('#loader').show();
            },
            complete: function() {
                setTimeout(function() {
                    $('#loader').hide();
                    document.getElementById('formMessage').innerHTML = "";
                    $("#formMessage").append('Żądanie wygenerowania strony sprintu zostało wysłane.');
                }, 1500);
            }
        }); 
    }
    
};

// exact function to generate sprint page with description
function sprintDescGen() {
    
    // taking project code and sprint ID from the layer form
    var projectCode = $("#pwGenProjectCode").val();
    var sprintId = $("#pwGenSprint").val();
    
    // checking if necessary inputs are fulfilled
    if (projectCode === null || projectCode == "" || sprintId === null || sprintId == "") {
        // errors
        document.getElementById('formMessage').innerHTML = "";
        $("#formMessage").append('Błąd: formularz niekompletny. Sprawdź ponownie wprowadzane dane.');
    } else {
        // success
        // configuring api
        var apiUrl = "http://pmo.cloud.onet/api/createpwdesc/" + projectCode + "/sprint/" + sprintId;

        // api request
        create = $.ajax({
            url: apiUrl,
            cache: false,
            beforeSend: function() {
                document.getElementById('formMessage').innerHTML = "";
                $('#loader').show();
            },
            complete: function() {
                setTimeout(function() {
                    $('#loader').hide();
                    document.getElementById('formMessage').innerHTML = "";
                    $("#formMessage").append('Żądanie wygenerowania strony sprintu zostało wysłane.');
                }, 1500);
            }
        });
    }
};


// EMERGENCY

// main function for generating sprint page (Generuj stronę sprintu), starting layer with proper data
function fullGen(type) {

    // taking project code from jira/confluence
    var projectCode = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent;
    
    // starting layer with default elements
    pmoMenuLayer();

    // adding styles for specific elements
    $("head").append('<style>#pwFullGenProjectCode {display: inline-block; box-sizing: border-box; margin: 2em 2em 0 0; color: #00000; background: #afe3e9; border: 0 none; padding: 10px 10px; outline: 0; width: 400px; -webkit-appearance: none; -moz-appearance: none;} #pwFullGenOptions {display: inline-block; box-sizing: border-box; margin-right: 2em; color: #00000; background: #afe3e9; border: 0 none; padding: 10px 10px; outline: 0;}</style>');
    
    // adding specific html elements
    $("#formWrapper").prepend('<input id="pwFullGenProjectCode" name="pwFullGenProjectCode" type="text" placeholder="Wprowadź kod projektu."><select id="pwFullGenOptions" onchange="changeTargetFullPwGeneration()"><option>z kryteriami akceptacji</option><option>z opisem</option></select><button onclick="" id="pwFullGenGenerate" class="generateButton" type="submit" value="Generuj">GENERUJ</button>');
    
    // choosing proper option as default from select field
    if (type == 'withCriteria') { 
        $("#pwFullGenOptions").prop("selectedIndex", 0);
        document.getElementById('pwFullGenGenerate').setAttribute('onclick','fullGenCriteria()');
    } else {
        $("#pwFullGenOptions").prop("selectedIndex", 1);
        document.getElementById('pwFullGenGenerate').setAttribute('onclick','fullGenDesc()'); 
    };
    
    // adding proper title/header
    $("#pmoMenuTitle").prepend('Generuj pełną dokumentację projektu');
    
    // putting project code to the input (if it was taken from jira/confluence)
    document.getElementById("pwFullGenProjectCode").setAttribute('value', projectCode); 
    
}

// choosing proper function to execute based on selected option
function changeTargetFullPwGeneration() {
    if (document.getElementById("pwFullGenOptions").selectedIndex == '0') {
        document.getElementById('pwFullGenGenerate').setAttribute('onclick','fullGenCriteria()');
    } else {
        document.getElementById('pwFullGenGenerate').setAttribute('onclick','fullGenDesc()');  
    };
}

// exact function to generate full documentation with criteria
function fullGenCriteria() {
    
    // taking project code from the layer form
    var projectCode = $("#pwFullGenProjectCode").val();
    
    // checking if necessary inputs are fulfilled
    if (projectCode === null || projectCode == "") {
        // errors
        document.getElementById('formMessage').innerHTML = "";
        $("#formMessage").append('Błąd: brak kodu projektu. Sprawdź ponownie wprowadzane dane.');
    }
    else {
        // success
        // configuring api
        var apiUrl = "http://pmo.cloud.onet/api/updateall/" + projectCode;

        // api request
        create = $.ajax({
            url: apiUrl,
            cache: false,
            beforeSend: function() {
                document.getElementById('formMessage').innerHTML = "";
                $('#loader').show();
            },
            complete: function(){
                setTimeout(function() {
                    $('#loader').hide();
                    document.getElementById('formMessage').innerHTML = "";
                    $("#formMessage").append('Żądanie wygenerowania dokumentacji projektu zostało wysłane.');
                }, 1500);
            }
        });   
    }
};

// exact function to generate full documentation with description
function fullGenDesc() {

    // taking project code from the layer form
    var projectCode = $("#pwFullGenProjectCode").val();
    
    // checking if necessary inputs are fulfilled
    if (projectCode === null || projectCode == "") {
        // errors
        document.getElementById('formMessage').innerHTML = "";
        $("#formMessage").append('Błąd: brak kodu projektu. Sprawdź ponownie wprowadzane dane.');
    }
    else {
        // success
        // configuring api
        var apiUrl = "http://pmo.cloud.onet/api/updatealldesc/" + projectCode;

        // api request
        create = $.ajax({
            url: apiUrl,
            cache: false,
            beforeSend: function() {
                document.getElementById('formMessage').innerHTML = "";
                $('#loader').show();
            },
            complete: function(){
                setTimeout(function() {
                    $('#loader').hide();
                    document.getElementById('formMessage').innerHTML = "";
                    $("#formMessage").append('Żądanie wygenerowania dokumentacji projektu zostało wysłane.');
                }, 1500);
            }
        });
    }
};


// OTHER, OLD OR NOT READY STUFF

// currently not working, deleted from pmomenu options
function openProject() {
    window.open("http://pmo.cloud.onet/add_project.html");
};

function closeProject() {
    alert("In progress");
};

// currently not working, deleted from pmomenu options
function portfolioGen() {
    window.open ("http://pmo.cloud.onet/api/genportfolio/");
};