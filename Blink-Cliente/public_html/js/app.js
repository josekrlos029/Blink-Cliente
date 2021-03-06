/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(document).ready(function() {
    consultarFooter();
    consultarMenu();
    jQuery('#buscaRestaurante').liveSearch({url: 'http://admin.blinkmanager.com/restaurante/buscaRestaurante/', id: 'newSearch'});
    
});

function consultarMenu() {
    if (localStorage.getItem("idUsuario") != "" && localStorage.getItem("idUsuario") != null) {

        //ESta Logeado
        $("#iniciar").hide();

    } else {
        $("#perfil").hide();
        $("#cerrar").hide();
    }
}

function consultarFooter() {
    if (localStorage.getItem("rows") == "true") {
        
        $('<div data-role="footer" id="footer"><div data-role="navbar"><ul><li><a href="carrito.html" data-ajax="false" data-icon="shop" class="ui-btn-active">Carrito de Compras</a></li></ul></div></div>')
                .appendTo($("#pagina").closest(".ui-page"))
                .toolbar({position: "fixed"
                });

        // This second step ensures that the insertion of the new toolbar does not
        // affect page height
        $.mobile.resetActivePageHeight();

    } else {
        $("#footer").hide();
    }
}

function pop(idProducto, nombre, descripcion, precio, estado) {

    if ($("#estado").val() == "c") {
        alert("No puedes pedir en este sitio pues se encuentra cerrado");
        $("#close").click();
    } else if (estado == "n") {
        alert("Lo sentimos, por el momento este producto no está disponible");
        $("#close").click();
    } else {
        var db = window.openDatabase("carritoBlink", "1.0", "listacompraDBBlink", 1000000);

        db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM lista WHERE id=?', [idProducto], function(tx, results) {
                var len = results.rows.length;
                if (len != 0) {
                    $("#canti").val(parseInt(results.rows.item(0).cantidad));
                    $("#indicaciones").val(results.rows.item(0).indicaciones);
                    $("#btnPop").text("Modificar");
                    $("#btnEliminar").show();
                }
            }, null);
        });
        $("#titu").text(nombre);
        $("#desc").text(descripcion);
        $("#prec").text("$" + precio);
        $("#idProducto").val(idProducto);
    }


}

function popReserva(idItem, nombre, descripcion, precio) {
    
    $("#titu").text(nombre);
    $("#desc").text(descripcion);
    $("#prec").text("$" + precio);
    $("#idItem").val(idItem);
    
}

function añadir() {

    var db = window.openDatabase("carritoBlink", "1.0", "listacompraDBBlink", 1000000);
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
                        insert(precio);
                    } else {
                        if (results.rows.item(0).idRestaurante == localStorage.getItem("idRestaurante")) {
                            insert(precio);
                        } else {
                            alert("Ya tienes un productos de otro restaurante en el carrito de compras, puedes borrar el carrito de compras actual o hacer el pedido y continuar con otro restaurante ! ");
                        }
                    }

                }, null);
            });

        }
    } else {
        update();
    }
}

function insert(precio) {
    var db = window.openDatabase("carritoBlink", "1.0", "listacompraDBBlink", 1000000);
    var cantidad = $("#canti").val();
    var indicaciones = $("#indicaciones").val();

    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO lista (id, nombre, descripcion, precio, cantidad, idRestaurante, indicaciones) VALUES (?, ?, ?, ?, ?, ?, ?)', [$("#idProducto").val(), $("#titu").text(), $("#desc").text(), precio, cantidad, localStorage.getItem("idRestaurante"), indicaciones]);
        reset();
        localStorage.setItem("rows", "true");
        if (getNameURLWeb() != "carrito.html") {
            consultarFooter();
        }
    });
    $("#close").click();

}

function update() {
    var cantidad = $("#canti").val();
    var indicaciones = $("#indicaciones").val();
    var db = window.openDatabase("carritoBlink", "1.0", "listacompraDBBlink", 1000000);
    db.transaction(function(tx) {
        tx.executeSql('UPDATE lista SET cantidad=?, indicaciones=?  WHERE id=?', [cantidad, indicaciones, $("#idProducto").val()]);
        reset();
        comprobarLista();
        if (getNameURLWeb() == "carrito.html") {
            recargarLista();
        } else {
            consultarFooter();
        }
    });
    $("#close").click();
}

function eliminar() {
    var db = window.openDatabase("carritoBlink", "1.0", "listacompraDBBlink", 1000000);
    db.transaction(function(tx) {
        tx.executeSql('DELETE FROM lista WHERE id=?', [$("#idProducto").val()]);
        reset();
        comprobarLista();
        if (getNameURLWeb() == "carrito.html") {
            recargarLista();
        } else {
            consultarFooter();
        }
    });
    $("#close").click();
}

function eliminarLista() {

    var db = window.openDatabase("carritoBlink", "1.0", "listacompraDBBlink", 1000000);
    db.transaction(function(tx) {
        tx.executeSql('DELETE FROM lista');
        localStorage.setItem("rows", "false");
        location.href = "index.html";
    });
}

function reset() {
    $("#canti").val("");
    $("#indicaciones").val("");
    $("#btnPop").text("Añadir");
    $("#btnEliminar").hide();
}

function getNameURLWeb() {
    var sPath = window.location.pathname;
    var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
    return sPage;
}

function comprobarLista() {
    var db = window.openDatabase("carritoBlink", "1.0", "listacompraDBBlink", 1000000);
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM lista', [], function(tx, results) {
            var len = results.rows.length;
            if (len == 0) {
                localStorage.setItem("rows", "false");
            }
        }, null);
    });

}

function comprobarLogin() {

    if (localStorage.getItem("idUsuario") != "" && localStorage.getItem("idUsuario") != null) {
        envio();
    } else {
        $("#btnPopup").click();
    }



}

function comprobarServicio() {
    if ($("input[name='servicio']:checked").val() != null && $("input[name='servicio']:checked").val() != "") {
        comprobarLogin();
    } else {
        alert("Debes Seleccionar un servicio para enviarte un mensajero !");
    }
}

function login() {
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
    var regId = localStorage.getItem('regId');

    if (regId != "" && regId != null) {

        var data = {
            correo: $("#correo").val(),
            clave: $("#clave").val(),
            regId: regId
        };

    } else {
        var data = {
            correo: $("#correo").val(),
            clave: $("#clave").val(),
            token: localStorage.getItem("token")
        };
    }

    var url = "http://admin.blinkmanager.com/restaurante/login";
    //var url = "http://192.168.1.33/domicilios/restaurante/login";
    $.ajax({
        type: "POST",
        url: url,
        data: data
    })
            .done(function(msg) {
                
                var json = eval("(" + msg + ")");
                if (json.msj == "autenticado") {
                    localStorage.setItem("idUsuario", json.id);
                    if (getNameURLWeb() == "hacerPedido.html") {
                        $("#closeLogin").click();
                        alert("Autenticado Correctamente ! ");
                        envio();
                    } else {
                        alert("Has iniciado Sesión Correctamente !");
                        location.href = "index.html";
                    }
                } else if (json.msj == "no") {
                    alert("Error al ingresar usuario o contraseña, intenta nuevamente.");
                } else {
                    alert("Lo sentimos, Error En el servidor, intenta mas tarde");
                }

                $.mobile.loading("hide");

            });
}

function registrar() {

    if ($("#clave1").val() === $("#clave2").val()) {
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
        var regId = localStorage.getItem('regId');

        if (regId != "" && regId != null) {

            var data = {
                nombres: $("#nombres").val(),
                apellidos: $("#apellidos").val(),
                email: $("#email").val(),
                clave: $("#clave1").val(),
                regId: regId
            };

        } else {
            var data = {
                nombres: $("#nombres").val(),
                apellidos: $("#apellidos").val(),
                email: $("#email").val(),
                clave: $("#clave1").val(),
                token: localStorage.getItem("token")
            };
        }

        var url = "http://admin.blinkmanager.com/restaurante/registrarUsuario";
        //var url = "http://192.168.1.33/domicilios/restaurante/registrarUsuario";
        $.ajax({
            type: "POST",
            url: url,
            data: data
        })
                .done(function(msg) {
                    var json = eval("(" + msg + ")");
                    if (json.msj == "registrado") {
                        localStorage.setItem("idUsuario", json.id);
                        alert("Te has registrado Correctamente, Ya puedes pedir tus domicilios desde donde estes");
                        location.href = "index.html";
                    } else if (json.msj == "no") {
                        alert("Error Al crear Usuario Intenta nuevamente o intenta entrando con facebook");
                    } else {
                        alert("Lo sentimos, Error En el servidor, intenta mas tarde");
                    }

                    $.mobile.loading("hide");

                });
    } else {
        alert("La contraseña es diferente a la confirmada, intenta nuevamente !");
    }

}

function atras() {
    history.back();
}

function cerrarSesion() {

    localStorage.setItem("idUsuario", "");
    alert("Has cerrado la sesión correctamente");
    location.href = "index.html";

}

function successHandler(result) {
    //alert('result = ' + result);
}

function errorHandler(error) {
    alert('error = ' + error);
}

function tokenHandler(result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    localStorage.setItem("token", result);
}

function onPrompt(buttonIndex) {

    if (buttonIndex == 1) {
        confirmarDomicilio('a');
    } else {
        confirmarDomicilio('c');
    }

}

function onPrompt2(buttonIndex) {

    if (buttonIndex == 1) {
        confirmarServicio('a');
    } else {
        confirmarServicio('c');
    }

}

function confirmarServicio(estado) {
     var $this = $(this),
            theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
            msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text,
            textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
            textonly = !!$this.jqmData("textonly"),
            html = $this.jqmData("html") || "";
    $.mobile.loading("show", {
        text: msgText,
        textVisible: textVisible,
        theme: theme,
        textonly: textonly,
        html: html
    });
    //var url = "/domicilios/restaurante/registrarDomicilio";
    //var url = "http://192.168.1.33/domicilios/restaurante/confirmarDomicilio";
    var url = "http://admin.blinkmanager.com/restaurante/confirmarServicio";
    var data = {idServicio: localStorage.getItem("idServicio"),
        estado: estado};
    $.ajax({
        type: "POST",
        url: url,
        data: data
    })
            .done(function(msg) {

                var json = eval("(" + msg + ")");
                if (json.msj == "exito") {
                    alert("Solicitud Procesada Correctamente");
                    //eliminarLista();

                } else if (json.msj == "cerrado") {
                    alert("TuDomicilio está cerrado consulta los horarios de operación !");

                } else {
                    alert("Error");
                }

            });
    $.mobile.loading("hide");
}

function confirmarDomicilio(estado) {

    var $this = $(this),
            theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
            msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text,
            textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
            textonly = !!$this.jqmData("textonly"),
            html = $this.jqmData("html") || "";
    $.mobile.loading("show", {
        text: msgText,
        textVisible: textVisible,
        theme: theme,
        textonly: textonly,
        html: html
    });
    //var url = "/domicilios/restaurante/registrarDomicilio";
    //var url = "http://192.168.1.33/domicilios/restaurante/confirmarDomicilio";
    var url = "http://admin.blinkmanager.com/restaurante/confirmarDomicilio";
    var data = {idDomicilio: localStorage.getItem("idDomicilio"),
        estado: estado};
    $.ajax({
        type: "POST",
        url: url,
        data: data
    })
            .done(function(msg) {

                var json = eval("(" + msg + ")");
                if (json.msj == "exito") {
                    alert("Solicitud Procesada Correctamente");
                    //eliminarLista();

                } else if (json.msj == "cerrado") {
                    alert("TuDomicilio está cerrado consulta los horarios de operación !");

                } else {
                    alert("Error");
                }

            });
    $.mobile.loading("hide");
}

function initPush(){
    var pushNotification = window.plugins.pushNotification;

    if (device.platform == 'android' || device.platform == 'Android')
    {
        //PARA ANDROID
        pushNotification.register(
                successHandler,
                errorHandler, {
                    "senderID": "616270198580", //ID del proyecto  (Debes crear un proyecto en google developers -> https://console.developers.google.com/project )
                    "ecb": "onNotificationGCM"  //Metodo cuando llega una notificación
                });
    }
    else
    {
        //Para IOS
        pushNotification.register(
                tokenHandler,
                errorHandler, {
                    "badge": "true",
                    "sound": "true",
                    "alert": "true",
                    "ecb": "onNotificationAPN"
                });
    }
   
}


function onNotificationGCM(e) {

    switch (e.event)
    {
        case 'registered':
            if (e.regid.length > 0)
            {
                localStorage.setItem("regId", e.regid);
            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if (e.foreground)
            {
                //$("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');
                if (e.payload.confirmacion) {
                    navigator.notification.vibrate(500);
                    localStorage.setItem("idDomicilio", e.payload.idDomicilio);
                    navigator.notification.confirm(
                            'Tu Domicilio fue aceptado, Necesitamos tu confirmación (UNA VEZ CONFIRMADO EL DOMICILIO, NO SE PUEDE CANCELAR, SI SE PRESENTAN PROBLEMAS DURANTE EL SERVICIO LLAMAR 5843238 - 3105961882 - 301421882)', // message
                            onPrompt, // callback to invoke
                            'Confirmar', // title
                            ['Confirmar', 'Cancelar'] // buttonLabels
                            );
                } else if (e.payload.confirmacionServicio) {
                    navigator.notification.vibrate(500);
                    localStorage.setItem("idServicio", e.payload.idServicio);
                    navigator.notification.confirm(
                            'Tu Servicio fue aceptado, Necesitamos tu confirmación (UNA VEZ CONFIRMADO EL SERVICIO, NO SE PUEDE CANCELAR, SI SE PRESENTAN PROBLEMAS DURANTE EL SERVICIO LLAMAR 5843238 - 3105961882 - 301421882)', // message
                            onPrompt2, // callback to invoke
                            'Confirmar', // title
                            ['Confirmar', 'Cancelar'] // buttonLabels
                            );
                } else {
                    navigator.notification.vibrate(500);
                    alert(e.payload.message);
                }
                // if the notification contains a soundname, play it.
                //var my_media = new Media("/android_asset/www/" + e.soundname);
                //my_media.play();
            }
            else
            {  // otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart)
                {
                    //$("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                    if (e.payload.confirmacion) {
                        localStorage.setItem("idDomicilio", e.payload.idDomicilio);
                        navigator.notification.confirm(
                                'Tu Domicilio fue aceptado, Necesitamos tu confirmación (UNA VEZ CONFIRMADO EL DOMICILIO, NO SE PUEDE CANCELAR, SI SE PRESENTAN PROBLEMAS DURANTE EL SERVICIO LLAMAR 3017693991 - 5808630)', // message
                                onPrompt, // callback to invoke
                                'Confirmar', // title
                                ['Confirmar', 'Cancelar'] // buttonLabels
                                );
                    } else if (e.payload.confirmacionServicio) {
                        navigator.notification.vibrate(500);
                        localStorage.setItem("idServicio", e.payload.idServicio);
                        navigator.notification.confirm(
                                'Tu Servicio fue aceptado, Necesitamos tu confirmación (UNA VEZ CONFIRMADO EL SERVICIO, NO SE PUEDE CANCELAR, SI SE PRESENTAN PROBLEMAS DURANTE EL SERVICIO LLAMAR 5843238 - 3105961882 - 301421882)', // message
                                onPrompt2, // callback to invoke
                                'Confirmar', // title
                                ['Confirmar', 'Cancelar'] // buttonLabels
                                );
                    } else {
                        alert(e.payload.message);
                    }
                }
                else
                {
                    //$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                    if (e.payload.confirmacion) {
                        localStorage.setItem("idDomicilio", e.payload.idDomicilio);
                        navigator.notification.confirm(
                                'Tu Domicilio fue aceptado, Necesitamos tu confirmación (UNA VEZ CONFIRMADO EL DOMICILIO, NO SE PUEDE CANCELAR, SI SE PRESENTAN PROBLEMAS DURANTE EL SERVICIO LLAMAR 5843238 - 3105961882 - 301421882)', // message
                                onPrompt, // callback to invoke
                                'Confirmar', // title
                                ['Confirmar', 'Cancelar'] // buttonLabels
                                );
                    } else if (e.payload.confirmacionServicio) {
                        navigator.notification.vibrate(500);
                        localStorage.setItem("idServicio", e.payload.idServicio);
                        navigator.notification.confirm(
                                'Tu Servicio fue aceptado, Necesitamos tu confirmación (UNA VEZ CONFIRMADO EL SERVICIO, NO SE PUEDE CANCELAR, SI SE PRESENTAN PROBLEMAS DURANTE EL SERVICIO LLAMAR 5843238 - 3105961882 - 301421882)', // message
                                onPrompt2, // callback to invoke
                                'Confirmar', // title
                                ['Confirmar', 'Cancelar'] // buttonLabels
                                );
                    } else {
                        alert(e.payload.message);
                    }
                }
            }

            //$("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
            //$("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
            break;

        case 'error':
            alert('Error: ' + e.msg);
            break;

        default:
            //$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
            break;
    }
}

function onNotificationAPN(event) {
    if (event.confirmacion) {
        navigator.notification.vibrate(500);
        localStorage.setItem("idDomicilio", event.idDomicilio);
        navigator.notification.confirm(
                'Tu Domicilio fue aceptado, Necesitamos tu confirmación (UNA VEZ CONFIRMADO EL DOMICILIO, NO SE PUEDE CANCELAR, SI SE PRESENTAN PROBLEMAS DURANTE EL SERVICIO LLAMAR 5843238 - 3105961882 - 301421882)', // message
                onPrompt, // callback to invoke
                'Confirmar', // title
                ['Confirmar', 'Cancelar'] // buttonLabels
                );
    } else if (event.confirmacionServicio) {
        navigator.notification.vibrate(500);
        localStorage.setItem("idServicio", event.idServicio);
        navigator.notification.confirm(
                'Tu Servicio fue aceptado, Necesitamos tu confirmación (UNA VEZ CONFIRMADO EL SERVICIO, NO SE PUEDE CANCELAR, SI SE PRESENTAN PROBLEMAS DURANTE EL SERVICIO LLAMAR 5843238 - 3105961882 - 301421882)', // message
                onPrompt2, // callback to invoke
                'Confirmar', // title
                ['Confirmar', 'Cancelar'] // buttonLabels
                );
    } else {
        navigator.notification.vibrate(500);
        alert(event.alert);
    }

    if (event.sound)
    {
        var snd = new Media(event.sound);
        snd.play();
    }

    if (event.badge)
    {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
}

function obtenerPosicion(){
    
    navigator.geolocation.getCurrentPosition(function(position) {
        return position;
    }, function() {
        alert("Error al Obtener la Posición de su dispositivo, intente activar el GPS !");
        return null;
    }, {enableHighAccuracy: true});
    
    
}


function crearDb() {
    
}

function eliminarDb() {
    var db = window.openDatabase("carritoBlink", "1.0", "listacompraDBBlink", 1000000);
    db.transaction(function(tx) {
        tx.executeSql('DROP TABLE lista');
    });
    localStorage.setItem("dbExist", "false");
}

function lugaresCercanos() {
    location.href = "verCercanos.html";
}

function tipoRestaurantes() {
    location.href = "tipoRestaurantes.html";
}

function mostrarRestaurante(idRestaurante) {

    localStorage.setItem("idRestaurante", idRestaurante);
    location.href = "mostrarRestaurante.html";

}

function servicios(){
    if(localStorage.getItem("ubicacion")!=null && localStorage.getItem("ubicacion")!=""){
        localStorage.setItem("seccion","SERVICIOS");
        location.href = "tipoRestaurantes.html";
    }else{
        alert("La app aún no ha obtenido tu dirección, activa el GPS y/o refresca la página");
    }
    
}

function diligencias(){
    if(localStorage.getItem("ubicacion")!=null && localStorage.getItem("ubicacion")!=""){
        location.href = "diligencias.html";
    }else{
        alert("La app aún no ha obtenido tu Ubicación, activa el GPS y/o refresca la página");
    }
}

function reservas(){
    if(localStorage.getItem("ubicacion")!=null && localStorage.getItem("ubicacion")!=""){
        localStorage.setItem("seccion","RESERVAS");
        location.href = "tipoRestaurantes.html";
    }else{
        alert("La app aún no ha obtenido tu Ubicación, activa el GPS y/o refresca la página");
    }
}

function pedidos(){
    if(localStorage.getItem("ubicacion")!=null && localStorage.getItem("ubicacion")!=""){

        localStorage.setItem("seccion","PEDIDOS");
        location.href = "tipoRestaurantes.html";
    }else{
        alert("La app aún no ha obtenido tu Ubicación, activa el GPS y/o refresca la página");
    }
}

function licores(){
    localStorage.setItem("seccion","PEDIDOS");
    localStorage.setItem("idTipo",13);
    location.href = "restaurantes.html";
}