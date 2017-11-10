// CONCEPT FOR MOVING PMO TOOL DIRECTLY TO JIRA (USING JIRA CUSTOM BANNERS SECTION)

//function getCurrentUserName() {
//    var user;
//    AJS.$.ajax({
//    url: "http://jira.grupa.onet/rest/gadget/1.0/currentUser",
//    type: 'get',
//    dataType: 'json',
//    async: false,
//    success: function(data) { user = data.username; }
//    });
//    return user;
//}
//
//function getGroups(user) {
//    var groups;
//    AJS.$.ajax({
//    url: "http://jira.grupa.onet/rest/api/2/user/groups?username="+user+"&amp;expand=groups",
//    type: 'get',
//    dataType: 'json',
//    async: false,
//    success: function(data) { groups = data.groups.items; }
//    });
//    return groups;
//}
//
//function isUserInGroup(user, group){
//    var groups = getGroups(user);
//    for (i = 0; i < groups.length; i++) {
//        if (groups[i].name==group) { return true; }
//    }
//    return false;
//}
//
//var user = getCurrentUserName();
//if (isUserInGroup(user, 'jira-administrators')){
//    AJS.$(function(){
//        alert("i am an administrator");
//    });
//}

var pmoMenu = {

    addScript: function(filename,callback){
        var e=document.createElement('script');
        e.type = 'text/javascript';
        e.src = filename;
        if(callback){
            e.onloadDone=false;//for Opera
            e.onload=function(){e.onloadDone=true;callback();};
            e.onReadystatechange=function(){
                if(e.readyState==='loaded'&& !e.onloadDone){
                    e.onloadDone=true;callback();
                }
            }
        }
        if(typeof(e)!=='undefined'){
            document.getElementsByTagName('head')[0].appendChild(e);
        }
    },

    teams: ['#childrenspan66402618-0', '#childrenspan41629682-0']

};

var pmoUsers = ["dniedzielski", "jgrzywna", "wczechowski", "pwawrzyczek", "kzontek", "trozanski", "akedziora", "jwidacka", "aherzog", "mmaracz", "krabiej", "alubas", "bszybowicz", "usek", "djurczyk", "emizera", "mwojdyla"];

var currentUser = AJS.Meta.get("remote-user");

function checkIfPmo(user) {
    for (i = 0; i < pmoUsers.length; i++) {
        if (user == pmoUsers[i]) { return pmoMenu.addScript('http://pmo.cloud.onet/PMOTool.js',function(){addButtons();}); }
    }
}

checkIfPmo(currentUser);