var app ={
    
    diligencia: { },
    
    
    configPush: function(){
        
        
        
        
    },
    
    insertPage: function(page, container, tab, animate){
        
        var processAjax ={
          
            mimeType: 'text/html; charset=utf-8',
            url: page,
            type: 'GET',
            dataType: 'html',
            async: true,
            success: function(data){
                $(container).empty(); 
                if(animate){
                    $(container).html(data).fadeIn(1000);
                }else{
                    $(container).html(data);
                }
                $('.tab-item').removeClass('ui-btn-active');
                switch (tab){
                    case 1: 
                        $("#tabDiligencias").addClass("ui-btn-active");
                        break;
                    case 2: 
                        $("#tabDomicilios").addClass("ui-btn-active");
                        break;
                    case 3: 
                        $("#tabLicores").addClass("ui-btn-active");
                        break;
                    case 4: 
                        $("#tabServicios").addClass("ui-btn-active");
                        break;
                        
                }
                
            },
            error:function(jqXHR, textStatus, errorThrown){
                alert('No se pudo cargar la página');
            }
            
        };
        
        $.ajax(processAjax);
    },
    
    cargarMapa: function(){
        var mapa = new GMaps({
                    div: '#mapa',
                    lat: 0,
                    lng: 0,
                    zoom: 15,
                    zoomControl: false,
                    panControl: false,
                    streetViewControl: false,
                    mapTypeControl: false
                });
    }
    
};

var page = {
    
    diligencias: function(){
        
        app.insertPage("diligencias.html", "#mainPage", 1,true);
        
        
        
    },
    
    configBody: function(){
        
        $("#mainPage").height($(window).height() - $("#head").height() - $("#foot").height() ).css({
            "padding": "5px"
        });
        
        
    },
    
    configMapIni: function(){
        
        $("#mapaDiligencias").height($("#mainPage").height());
        
        //$(".divMap").css("margin-top", ( "-" + ($("#mapaDiligencias").height() - 60)) +  "px" );
        
        
    }
     
};


