/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var server = "localhost";

function enviarDenuncia(){
    var regId = localStorage.getItem('regId');

    navigator.geolocation.getCurrentPosition(function(position) {
        
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        if (regId != "" && regId != null) {

        var data = {
            usuario: $("#usuario").val(),
            descripcion: $("#descripcion").val(),
            telefono: $("#telefono").val(),
            sexo: $("#sexo").val(),
            edad: $("#edad").val(),
            lat: lat,
            lng: lng,
            regId: regId
        };

        } else {
            var data = {
                usuario: $("#usuario").val(),
                descripcion: $("#descripcion").val(),
                telefono: $("#telefono").val(),
                sexo: $("#sexo").val(),
                edad: $("#edad").val(),
                lat: lat,
                lng: lng,
                token: localStorage.getItem("token")
            };
        }

        var url = "http://"+server+"/administrador/denunciar";
    
        $.ajax({
            type: "POST",
            url: url,
            data: data
        })
        .done(function(msg) {

            var json = eval("(" + msg + ")");
            if (json.msj == "exito") {
                
                    
                alert("Solicitud Enviada Correctamene");
                    
            } else if (json.msj == "no") {
                alert("Error al procesar Solicitud, Intenta nuevamente..");
            } else {
                alert("Lo sentimos, Error En el servidor, intenta mas tarde");
            }

            $.mobile.loading("hide");

        });

    
    }, function() {
        alert("Error al Obtener la Posición de su dispositivo, intente activar el GPS !");
        return null;
    }, {enableHighAccuracy: true});

    
}

function panico(){
    
    var regId = localStorage.getItem('regId');

    navigator.geolocation.getCurrentPosition(function(position) {
        
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        if (regId != "" && regId != null) {

        var data = {
            usuario: $("#usuario").val(),
            telefono: $("#telefono").val(),
            lat: lat,
            lng: lng,
            regId: regId
        };

        } else {
            var data = {
                usuario: $("#usuario").val(),
                telefono: $("#telefono").val(),
                lat: lat,
                lng: lng,
                token: localStorage.getItem("token")
            };
        }

        var url = "http://"+server+"/administrador/enviarPanico";
    
        $.ajax({
            type: "POST",
            url: url,
            data: data
        })
        .done(function(msg) {

            var json = eval("(" + msg + ")");
            if (json.msj == "exito") {
                
                    
                alert("Solicitud Enviada Correctamene");
                    
            } else if (json.msj == "no") {
                alert("Error al procesar Solicitud, Intenta nuevamente..");
            } else {
                alert("Lo sentimos, Error En el servidor, intenta mas tarde");
            }

            $.mobile.loading("hide");

        });

    
    }, function() {
        alert("Error al Obtener la Posición de su dispositivo, intente activar el GPS !");
        return null;
    }, {enableHighAccuracy: true});

}

function initPush(){
    var pushNotification = window.plugins.pushNotification;

    if (device.platform == 'android' || device.platform == 'Android')
    {
        //PARA ANDROID
        pushNotification.register(
                successHandler,
                errorHandler, {
                    "senderID": "825868744821", //ID del proyecto  (Debes crear un proyecto en google developers -> https://console.developers.google.com/project )
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
                
                navigator.notification.vibrate(500);
                alert(e.payload.message);
                               // if the notification contains a soundname, play it.
                //var my_media = new Media("/android_asset/www/" + e.soundname);
                //my_media.play();
            }
            else
            {  // otherwise we were launched because the user touched a notification in the notification tray.
                if (e.coldstart)
                {
                    //$("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                    
                        navigator.notification.vibrate(500);
                        alert(e.payload.message);
                }
                else
                {
                    //$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                    if (e.payload.confirmacion) {
                        
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
    
        navigator.notification.vibrate(500);
        alert(event.alert);
    
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
