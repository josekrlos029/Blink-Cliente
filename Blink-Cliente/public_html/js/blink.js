var app ={
    
    BD_NAME: "listacompraDBBLink",
    TABLE_NAME: "carritoBlink",
    
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
                
                //var idRestaurante = idRestaurante;
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

            
    },
    
    insert: function(precio){
        var db = window.openDatabase(app.TABLE_NAME, "1.0", app.BD_NAME, 1000000);
        var cantidad = $("#canti").val();
        var indicaciones = $("#indicaciones").val();

        db.transaction(function(tx) {
            tx.executeSql('INSERT INTO lista (id, nombre, descripcion, precio, cantidad, idRestaurante, indicaciones) VALUES (?, ?, ?, ?, ?, ?, ?)', [$("#idProducto").val(), $("#titu").text(), $("#desc").text(), precio, cantidad, localStorage.getItem("idRestaurante"), indicaciones]);
            app.reset();
            localStorage.setItem("rows", "true");
        });
        $("#close").click();
    },
    
    update: function(){
        var cantidad = $("#canti").val();
        var indicaciones = $("#indicaciones").val();
        var db = window.openDatabase(app.TABLE_NAME, "1.0", app.BD_NAME, 1000000);
        db.transaction(function(tx) {
            tx.executeSql('UPDATE lista SET cantidad=?, indicaciones=?  WHERE id=?', [cantidad, indicaciones, $("#idProducto").val()]);
            app.reset();
            app.comprobarLista();
            
        });
        $("#close").click();
    },
    
    eliminar: function(){
        var db = window.openDatabase(app.TABLE_NAME, "1.0", app.BD_NAME, 1000000);
        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM lista WHERE id=?', [$("#idProducto").val()]);
            app.reset();
            app.comprobarLista();
            
        });
        $("#close").click();
    },
    
    eliminarLista: function(){
        var db = window.openDatabase(app.TABLE_NAME, "1.0", app.BD_NAME, 1000000);
        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM lista');
            localStorage.setItem("rows", "false");
            page.diligencias();
        });
    },
    
    crearDb: function(){
        var db = window.openDatabase(app.TABLE_NAME, "1.0", app.BD_NAME, 1000000);
        db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS lista (id unique, nombre, descripcion, precio, cantidad, indicaciones, idRestaurante)');
        });
    },
    
    añadir: function(){
        var db = window.openDatabase(app.TABLE_NAME, "1.0", app.BD_NAME, 1000000);
        var precio = $("#prec").text();

        precio = precio.replace('$', '');
        if ($("#btnPop").text() == 'Añadir') {

            if ($("#canti").val() == "" || $("#canti").val() == null || $("#canti").val() == " ") {
                alert("Por Favor digite una cantidad Valida");
            } else {

                db.transaction(function(tx) {
                    tx.executeSql('SELECT * FROM lista', [], function(tx, results) {
                        var len = results.rows.length;
                        if (len == 0) {
                            app.insert(precio);
                        } else {
                            if (results.rows.item(0).idRestaurante == localStorage.getItem("idRestaurante")) {
                                app.insert(precio);
                            } else {
                                alert("Ya tienes un productos de otro restaurante en el carrito de compras, puedes borrar el carrito de compras actual o hacer el pedido y continuar con otro restaurante ! ");
                            }
                        }

                    }, null);
                });

            }
        } else {
            app.update();
        }
    },
    
    reset: function(){
        
        $("#canti").val("");
        $("#indicaciones").val("");
        $("#btnPop").text("Añadir");
        $("#btnEliminar").hide();

    },
    
    comprobarLista: function(){
        var db = window.openDatabase(app.TABLE_NAME, "1.0", app.BD_NAME, 1000000);
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM lista', [], function(tx, results) {
                var len = results.rows.length;
                if (len == 0) {
                    localStorage.setItem("rows", "false");
                }
            }, null);
        });
    }
    
    
    
    
    
};

var page = {
    pedidos: function(){
        
        app.insertPage("pedidos.html", "#mainPage", 2,true);
        
    },
    
    pedido: function(){
        
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
    
    carrito: function(){
        var db = window.openDatabase(app.TABLE_NAME, "1.0", app.BD_NAME, 1000000);
        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM lista', [], function(tx, results) {
                var len = results.rows.length;
                if (len == 0) {
                    alert("Carrito Vacio");
                    localStorage.setItem("rows", "false");
                } else {
                    app.insertPage("carrito.html", "#mainPage", 0,true);
                }
            });
            
        });  
        
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
