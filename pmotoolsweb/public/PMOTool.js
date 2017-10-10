function pwGen() {
    var projectCode = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent;
    window.open ("http://pmo.cloud.onet/api/genscope/" + projectCode);
};

function costGen() {
    var projectCode = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent;
    window.open ("http://pmo.cloud.onet/api/genestimate/" + projectCode);
};

function costGen2() {
    var projectCode = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent;
    window.open ("http://pmo.cloud.onet/api/genestimate2/" + projectCode);
};

function portfolioGen(){
    window.open ("http://pmo.cloud.onet/api/genportfolio/");
};

function sprintGen(){
    // taking sprint ID from Jira board view
    if ($("li.aui-nav-selected").attr("data-link-id") === "com.pyxis.greenhopper.jira:global-sidebar-plan-scrum") {
        // plan/backlog mode
        var sprintId = $(".js-sprint-header").attr("data-sprint-id");
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
        .fail(function(){
            alert("There are some errors. If you are using Confluence try to switch to the Jira.");
        })
};

function sprintDescGen(){
    // taking sprint ID from Jira board view
    if ($("li.aui-nav-selected").attr("data-link-id") === "com.pyxis.greenhopper.jira:global-sidebar-plan-scrum") {
        // plan/backlog mode
        var sprintId = $(".js-sprint-header").attr("data-sprint-id");
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
        .fail(function(){
            alert("There are some errors. If you are using Confluence try to switch to the Jira.");
        })
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

function pmoMenuClose() {
    $(".pmoMenuContainer").remove();
    $("script[src$='PMOTool.js']").remove();
    $("link[href$='http://fonts.googleapis.com/css?family=Open+Sans:400,300,600']").remove();
    $("link[href$='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css']").remove();
}

function addButtons() {
    $("header#header").append('<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600" rel="stylesheet" type="text/css"><link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet"><style>.pmoMenuContainer, .pmoMenuContainer *, .pmoMenuContainer *:before, .pmoMenuContainer *:after{margin: 0; padding: 0; box-sizing: border-box;}.pmoMenuContainer{box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);}.pmoMenu{width: auto; margin: 0 auto 0 auto; background-color: #d2e4e6; z-index: 99999;}.pmoMenu ul{font-size: 0; list-style-type: none; z-index: 99999}.pmoMenu ul li{font-family: "Open Sans", sans-serif; font-size: 1rem; font-weight: 400; color: #333; display: inline-block; padding: 15px; position: relative;}.pmoMenu ul li.external{font-family: "Open Sans", sans-serif; font-size: 1rem; font-weight: 400; color: #333; display: inline-block; padding: 0; position: relative;}.pmoMenu ul li ul{display: none;}.pmoMenu ul li:hover{cursor: pointer; background-color: #c4e4e8;}.pmoMenu ul li:hover ul{display: block; margin-top: 15px; width: auto; left: 0; position: absolute; white-space: nowrap;}.pmoMenu ul li:hover ul li{display: block; background-color: #d2e4e6;}.pmoMenu ul li:hover ul li:hover{background-color: #c4e4e8;}.pmoMenu ul li:hover ul li:hover span{background-color: #ee204e;}li.external{float: right; padding: 0 !important;}li.external a, li.external a:hover{display: block; padding: 15px; color: inherit !important; text-decoration: none;}li.external a i.fa-info, li.external a i.fa-key, li.teams i.fa-male{margin-right: 5px;}li.pmoMenuClose{float: right;}</style><div class="pmoMenuContainer"> <div class="pmoMenu"> <ul> <li onClick="hideMe(pmoMenu.teams)" title="Filtrowanie zespołów na liście witrynek projektowych" class="teams"><i class="fa fa-male"></i>Pokaż moje teamy</li><li onClick="pwGen()" title="Generowanie dokumentu porozumienia wykonawczego (Word) na podstawie zawartości Confluence">Generuj zakres</li><li title="Generowanie podstrony sprintu w ramach danego projektu">Generuj stronę sprintu <i class="fa fa-angle-down"></i> <ul> <li onClick="sprintGen()">Strona sprintu (kryteria akceptacji)</li><li onClick="sprintDescGen()">Strona sprintu (opis)</li></ul> </li><li title="Generowanie kosztorysu dla projektu">Generuj kosztorys <i class="fa fa-angle-down"></i> <ul> <li onClick="costGen()">Kosztorys bez subtasków</li><li onClick="costGen2()">Kosztorys z subtaskami</li></ul> </li><li onClick="portfolioGen()" title="Obecnie nieużywane">Generuj dane z portfolio</li><li onClick="pmoMenuClose()" class="pmoMenuClose"><i class="fa fa-window-close-o fa-2"></i></li><li title="Dokumentacja PMO Menu na Confluence" class="external"><a href="http://doc.grupa.onet/display/AG/PMO+Menu" target="_blank"><i class="fa fa-info"></i>Dokumentacja</a></li><li title="Pełna wersja PMO Tools" class="external"><a href="http://pmo.cloud.onet" target="_blank"><i class="fa fa-key"></i>PMO Tools</a></li></ul> </div></div>');
};
