/**
 * Created by musicology on 12/9/15.
 */
angular.module('IonicGoogleMapsApp.controllers', ['ngOpenFB'])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout, ngFB) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      //new
      $scope.fbLogin = function () {
        // ngFB.login({scope: 'email,read_stream,publish_actions'}).then(
        ngFB.login({scope: 'email,publish_actions'}).then(
          function (response) {
            if (response.status === 'connected') {
              console.log('Facebook login succeeded');
              $scope.closeLogin();
            } else {
              alert('Facebook login failed');
            }
          });
      };

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };
  })

  .controller('SessionsCtrl', function ($scope, Session) {
    $scope.sessions = Session.query();
  })

  .controller('SessionCtrl', function ($scope, $stateParams, Session) {
    $scope.session = Session.get({sessionId: $stateParams.sessionId});
  })

  .controller('FbEventsCtrl', function ($scope, $state, $http, ngFB) {

    ngFB.init({
      appId: '958409767551345',
      /* accessToken: 'CAANnqymZBgXEBAM8EqwvvZC4cUqgHQ5iQpZAdh7GiMCeV3lixf1goD0TSw4TjSjTIu1hW5ytaQOj9PMB5P1H3sGgYNKCYoVgxuisPnSZAAwm45FNpDWUVXOzmhocMPSMxpz7ZA6rD6ZAHroeeiZCwdQ7U2ZA3xaKzqfRZAaqnsTwMLYAQ60CjYmCd9hbx3b9CTdMcI3zDDZAgS8wZDZD',*/
      status: true,
      xfbml: true
    });


    //Pass appId and secret into app
    var app_id = '958409767551345';
    var app_secret = '2e9cf3b3d5c7a9c0b6c14883f8b6b090';


    var getEvents = ngFB.api({
      //path: '/search?q=social&type=event&center=33.958281, -84.353616&distance=1000&'
      path: '/search?type=event&q=*&center=33.93, -84.37&distance=1000&'
    })
      .then(function (response) {
        $scope.events = response.data;
        console.log(response.data);
      }, function (error) {
        console.log(error);
      });

    $scope.getEventDetails = function(eventId) {

      //Pass event Id to get facebook event specific info like attending count/cover photo etc
      $state.go('app.eventdetails', { eventId : eventId});
    }

  })

  .controller('FbEventsDetailsCtrl', function ($scope, $state, $stateParams, $http, ngFB) {

    ngFB.init({
      appId: '958409767551345',
      /* accessToken: 'CAANnqymZBgXEBAM8EqwvvZC4cUqgHQ5iQpZAdh7GiMCeV3lixf1goD0TSw4TjSjTIu1hW5ytaQOj9PMB5P1H3sGgYNKCYoVgxuisPnSZAAwm45FNpDWUVXOzmhocMPSMxpz7ZA6rD6ZAHroeeiZCwdQ7U2ZA3xaKzqfRZAaqnsTwMLYAQ60CjYmCd9hbx3b9CTdMcI3zDDZAgS8wZDZD',*/
      status: true,
      xfbml: true
    });


    //Pass appId and secret into app
    var app_id = '958409767551345';
    var app_secret = '2e9cf3b3d5c7a9c0b6c14883f8b6b090';


    var getEventDetails = ngFB.api({
      path: '/' + $stateParams.eventId + '?fields=attending_count,cover,name,description'
    })
      .then(function (response) {
        $scope.eventDetails = response;
        console.log(response);
      }, function (error) {
        console.log(error);
      });

    //$scope.getEventDetails();
  })

  .controller('ProfileCtrl', function ($scope, ngFB) {
    ngFB.api({
      path: '/me',
      params: {fields: 'id, name'}
    }).then(
      function (user) {
        $scope.user = user;
      },
      function (error) {
        alert('Facebook error: ' + error.error_description);
      });
  })

  .controller('MapController', function ($scope, $ionicLoading, $cordovaGeolocation) {

    var options = {timeout: 100000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

      //TODO
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      //Wait untill the map is loaded
      google.maps.event.addListenerOnce($scope.map, 'idle', function () {
        var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
        });

        var infoWindow = new google.maps.InfoWindow({
          content: "Here I am...Rock you like a hurricane!"
        });

        google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
        })
      });
    }, function (error) {
      console.log("Could not get location");

    });
  })

  .controller('MusicCtrl', function ($scope) {

    $scope.artistList = [
      {
        id: 1,
        name: 'Michael Jackson',
        body: 'The GOAT, singer, dancer, composer, performer...the greatest who ever did it!'
      },
      {
        id: 2,
        name: 'Elvis Presley',
        body: 'The King of Rock, blues singer who started in memphis and took over the world as an icon!'
      },
      {
        id: 3,
        name: 'The Beatles',
        body: 'John Lennon, McCartney and the rest, catchy compositions that started the Brit Music movement'
      },
      {
        id: 4,
        name: 'Led Zepplin',
        body: 'The creators of Hard Rock! The Golden God, the dragon pants and awe inspiring live shows!'
      },
      {
        id: 5,
        name: 'Pink Floyd',
        body: 'Waters and David created musical art, from soundscapes to imagery they relished in their image as artists'
      },
      {
        id: 6,
        name: 'Guns N Roses',
        body: 'The beasts of American hard rock, amazing compositions and half man half beast guitarist Slash!'
      },
      {
        id: 7,
        name: 'Aerosmith',
        body: 'The Boston lads, with blues based singing from Stevn Tyler and sloppy addictive licks from Joe Perry'
      },
      {
        id: 8,
        name: 'AC/DC',
        body: 'Few Artists have done more or less, crazy infectious compositions that showed minimialistic rock is the best'
      },
      {
        id: 9,
        name: 'Ozzy Ozbourne',
        body: 'Ozzy...you crazy bastard...you gave us Crazy Train'
      },
      {
        id: 10,
        name: 'Nirvana',
        body: 'Kurt Cobain...the music was led by enigma that was Cobain, grunge went mainstream here'
      },

      {
        id: 11,
        name: 'Michael Jackson',
        body: 'The GOAT, singer, dancer, composer, performer...the greatest who ever did it!'
      },
      {
        id: 12,
        name: 'Elvis Presley',
        body: 'The King of Rock, blues singer who started in memphis and took over the world as an icon!'
      },
      {
        id: 13,
        name: 'The Beatles',
        body: 'John Lennon, McCartney and the rest, catchy compositions that started the Brit Music movement'
      },
      {
        id: 14,
        name: 'Led Zepplin',
        body: 'The creators of Hard Rock! The Golden God, the dragon pants and awe inspiring live shows!'
      },
      {
        id: 15,
        name: 'Pink Floyd',
        body: 'Waters and David created musical art, from soundscapes to imagery they relished in their image as artists'
      },
      {
        id: 16,
        name: 'Guns N Roses',
        body: 'The beasts of American hard rock, amazing compositions and half man half beast guitarist Slash!'
      },
      {
        id: 17,
        name: 'Aerosmith',
        body: 'The Boston lads, with blues based singing from Stevn Tyler and sloppy addictive licks from Joe Perry'
      },
      {
        id: 18,
        name: 'AC/DC',
        body: 'Few Artists have done more or less, crazy infectious compositions that showed minimialistic rock is the best'
      },
      {
        id: 19,
        name: 'Ozzy Ozbourne',
        body: 'Ozzy...you crazy bastard...you gave us Crazy Train'
      },
      {
        id: 20,
        name: 'Nirvana',
        body: 'Kurt Cobain...the music was led by enigma that was Cobain, grunge went mainstream here'
      }
    ]
  });



