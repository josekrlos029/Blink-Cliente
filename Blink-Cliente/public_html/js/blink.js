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
                $('.tabtab').removeClass('ui-btn-active');
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
    },
    
    cargarCategoriasServicios: function(container){
        var $this = $(this),
                        theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
                        msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text,
                        textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
                        textonly = !!$this.jqmData("textonly");
                html = $this.jqmData("html") || "";
                $.mobile.loading("show", {
                    text: msgText,
                    textVisible: textVisible,
                    theme: theme,
                    textonly: textonly,
                    html: html
                });
        
        var url = "http://admin.blinkmanager.com/restaurante/consultarTipos";
                //var url = "/domicilios/restaurante/consultarRestaurantesPorTipo";
        $.ajax({
            type: "POST",
            url: url,
            data: {
                modulo: 'SERVICIOS'
            }
        })
        .done(function(msg) {
    
            $(container).html(msg);
            $(container).trigger('create');
            $.mobile.loading("hide");
        });
    
    },
    
    cargarSitiosPedidos: function(container){
        
        var $this = $(this),
                        theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
                        msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text,
                        textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
                        textonly = !!$this.jqmData("textonly");
                html = $this.jqmData("html") || "";
                $.mobile.loading("show", {
                    text: msgText,
                    textVisible: textVisible,
                    theme: theme,
                    textonly: textonly,
                    html: html
                });
        
        var url = "http://admin.blinkmanager.com/restaurante/imprimirRestaurantes";
                //var url = "/domicilios/restaurante/consultarRestaurantesPorTipo";
        $.ajax({
            type: "POST",
            url: url,
            data: {}
        })
        .done(function(msg) {
    
            $(container).html(msg);
            $(container).trigger('create');
            $.mobile.loading("hide");
        });
    },
    
    cargarSitiosServicio: function(container){
        
        var $this = $(this),
                        theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
                        msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text,
                        textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
                        textonly = !!$this.jqmData("textonly");
                html = $this.jqmData("html") || "";
                $.mobile.loading("show", {
                    text: msgText,
                    textVisible: textVisible,
                    theme: theme,
                    textonly: textonly,
                    html: html
                });
        
        var url = "http://admin.blinkmanager.com/restaurante/imprimirRestaurantesPorTipo";
                //var url = "/domicilios/restaurante/consultarRestaurantesPorTipo";
        var idTipo = localStorage.getItem("idTipo");
        $.ajax({
            type: "POST",
            url: url,
            data: {
                idTipo: idTipo,
                ciudad: "Valledupar",
                seccion: "SERVICIOS"
            }
        })
        .done(function(msg) {
    
            $(container).html(msg);
            $(container).trigger('create');
            $.mobile.loading("hide");
        });
    },
    
    menu: function(container){
                
                var idRestaurante  = localStorage.getItem("idRestaurante");
                
                var $this = $(this),
                        theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
                        msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text,
                        textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
                        textonly = !!$this.jqmData("textonly");
                html = $this.jqmData("html") || "";
                $.mobile.loading("show", {
                    text: msgText,
                    textVisible: textVisible,
                    theme: theme,
                    textonly: textonly,
                    html: html
                });
                
                var idRestaurante = idRestaurante;
                var url = "http://admin.blinkmanager.com/restaurante/menu";
                //var url = "http://192.168.1.33/domicilios/restaurante/menu";
                //var url = "/domicilios/restaurante/menu";
                $.ajax({
                    type: "POST",
                    url: url,
                    data: {
                        idRestaurante: idRestaurante
                    }
                })
                        .done(function(msg) {
                            $(container).html(msg);
                            $(container).trigger('create');
                            $.mobile.loading("hide");
                        });

            
    }
    
};

var page = {
    pedidos: function(){
        
        app.insertPage("pedidos.html", "#mainPage", 2,true);
        
    },
    
    
    diligencias: function(){
        
        app.insertPage("diligencias.html", "#mainPage", 1,true);
        
        
        
    },
    
    servicios: function(){
        app.insertPage("categoriaServicios.html", "#mainPage", 4,true);
    },
    
    licores: function(){
        app.insertPage("licores.html", "#mainPage", 3,true);
    },
    
    formDiligencias: function(){
        
        localStorage.setItem("descripcion", $("#descripcion").val());
        //$( "#mainPage" ).pagecontainer( "load", "diligenciasForm.html", { showLoadMsg: false } );
        app.insertPage("diligenciasForm.html", "#mainPage", 1,true);
        
    },
    
    mostrarRestaurante: function(){
        
        //$( "#mainPage" ).pagecontainer( "load", "diligenciasForm.html", { showLoadMsg: false } );
        app.insertPage("mostrarRestaurante.html", "#mainPage", 2,true);
        
    },
    
    mostrarServicio: function(){
        
        //$( "#mainPage" ).pagecontainer( "load", "diligenciasForm.html", { showLoadMsg: false } );
        app.insertPage("mostrarSitioServicio.html", "#mainPage", 4,true);
        
    },
    
    configBody: function(){
        
        $("#mainPage").height($(window).height() - $("#head").height() - $("#foot").height() ).css({
            "padding": "0"
        });
        
        
    },
    
    configMapIni: function(){
        
        $("#mapaDiligencias").height($("#mainPage").height());
        
        //$(".divMap").css("margin-top", ( "-" + ($("#mapaDiligencias").height() - 60)) +  "px" );
        
        
    },
    
    atras: function(idPAge){
        
       
        
    },
    
    clearStack: function(){
        $("#back").hide();
        this.stackBack = {};
    },
    
    
    stackBack:{}
     
};