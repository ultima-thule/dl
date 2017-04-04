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

pmoMenu.addScript('http://pmo.cloud.onet/PMOTool.js',function(){addButtons();});