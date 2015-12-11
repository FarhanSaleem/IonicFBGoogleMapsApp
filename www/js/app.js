// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var IonicGoogleMapsApp = angular.module('IonicGoogleMapsApp', ['ionic', 'IonicGoogleMapsApp.controllers', 'ngCordova', 'ngOpenFB'])

.run(function($ionicPlatform, ngFB) {
  ngFB.init({appId: '958409767551345'});
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.music', {
        url: "/music",
        views: {
          'menuContent': {
            templateUrl: "templates/music.html",
            controller: 'MusicCtrl'
          }
        }
      })

      .state('app.events', {
        url: "/events",
        views: {
          'menuContent': {
            templateUrl: "templates/events.html",
            controller: 'FbEventsCtrl'
          }
        }
      })

      .state('app.map', {
        url: "/map",
        views: {
          'menuContent': {
            templateUrl: "templates/map.html",
            controller: 'MapController'
          }
        }
      })
    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/music');
  });


/*

//Ionic ngCordova for GeoLocation
IonicGoogleMapsApp.controller('MapController', function($scope, $ionicLoading, $cordovaGeolocation) {

  var options = { timeout: 100000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position) {

    //TODO
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //Wait untill the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function() {
      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });

      var infoWindow = new google.maps.InfoWindow({
        content: "Here I am...Rock you like a hurricane!"
      });

      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open($scope.map, marker);
      })
    });
  }, function(error) {
    console.log("Could not get location");

  });
})
*/



