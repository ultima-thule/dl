window.pwGen = function(){
    window.project = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent ;
    window.open ("http://pmo.cloud.onet/api/genscope/" + window.project);
};

window.costGen = function(){
    window.project = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent ;
    window.open ("http://pmo.cloud.onet/api/genestimate/" + window.project);
};

window.costGen2 = function(){
    window.project = $(".ghx-project")[0] === undefined ? $("#title-text > a").text() : $(".ghx-project")[0].textContent ;
    window.open ("http://pmo.cloud.onet/api/genestimate2/" + window.project);
};

window.sprintGen = function(){
    window.sprint = $(".js-sprint-header").attr("data-sprint-id");
    window.project =   $(".ghx-project")[0].textContent;
    window.url = "http://pmo.cloud.onet/api/createpw/" + window.project +"/sprint/" + window.sprint;
    create = $.get(window.url)
        .done(function(){
            alert("Created subpage for project " + project);
        })
        .fail(function(){
            alert("There is some errors");
        })
};

window.hideMe = function(arrayId){
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

function addButtons() {
    $("header#header").append('<div style="background: #a1a1a1;color:white;width:100%25;"><button onClick="sprintGen()" style="background:#3b9fa3">Strona Sprintu</button><button onClick="hideMe(pmoMenu.teams)" style="background:#79b0d3">Pokaz moje teamy</button><button onClick="pwGen()" style="background:#f2beb5">Generuj zakres</button><button onClick="costGen()" style="background:#f2beb5">Generuj kosztorys bez subtasków</button><button onClick="costGen2()" style="background:#f2beb5">Generuj kosztorys z subtaskami</button>');
};