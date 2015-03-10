/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function gps(){
    var bgGeo = window.plugins.backgroundGeoLocation;

    /**
    * This would be your own callback for Ajax-requests after POSTing background geolocation to your server.
    */
    var yourAjaxCallback = function(response) {
        ////
        // IMPORTANT:  You must execute the #finish method here to inform the native plugin that you're finished,
        //  and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
        // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        //
        //
        //bgGeo.finish();
        alert("saas");
    };

    /**
    * This callback will be executed every time a geolocation is recorded in the background.
    */
    var callbackFn = function(location) {
        console.log('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
        // Do your HTTP request here to POST location to your server.
        //
        //
        yourAjaxCallback.call(this);
    };

    var failureFn = function(error) {
        console.log('BackgroundGeoLocation error');
    }

    // BackgroundGeoLocation is highly configurable.
    bgGeo.configure(callbackFn, failureFn, {
         // <-- Android ONLY:  your server url to send locations to 
        params: {                                               //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
            auth_token: '2',
            foo: 'bar'
        },
        headers: {                                              // <-- Android ONLY:  Optional HTTP headers sent to your configured #url when persisting locations
            "X-Foo": "BAR"
        },
        url: 'http://admin.blinkmanager.com/restaurante/envio/hola',
        desiredAccuracy: 10,
        stationaryRadius: 1,
        distanceFilter: 1,
        notificationTitle: 'Background tracking', // <-- android only, customize the title of the notification
        notificationText: 'ENABLED', // <-- android only, customize the text of the notification
        activityType: 'AutomotiveNavigation',
        debug: false // <-- enable this hear sounds for background-geolocation life-cycle.
    });

    // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
    bgGeo.start();
}

 

    // If you wish to turn OFF background-tracking, call the #stop method.
    // bgGeo.stop()