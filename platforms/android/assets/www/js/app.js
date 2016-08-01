// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'backand', 'starter.controllers', 'starter.services', 'ngTagsInput'])

.run(function($ionicPlatform, $rootScope, $state, LoginService, Backand) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  
  function unauthorized() {
            console.log("user is unauthorized, sending to login");
            $state.go('login');
        }

        function signout() {
            LoginService.signout();
        }

        $rootScope.$on('unauthorized', function () {
            unauthorized();
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            if (toState.name == 'login') {
                signout();
            }
            else if (toState.name != 'login' && Backand.getToken() === undefined) {
                unauthorized();
            }
        });
})

.config(function(BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
  
  BackandProvider.setAppName('campusconnect');
  BackandProvider.setAnonymousToken('2dec037a-1759-429d-a83e-042420f2b395');
  BackandProvider.setSignUpToken('9aab5e6d-8467-4b10-a087-40a6a8e0eaa3');


  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
    .state('login', {
      url: '/login',
      controller: 'LoginCtrl as login',
      templateUrl: 'templates/login.html'
    })
  
    .state('signup', {
      url: '/signup',
      controller: 'SignUpCtrl as vm',
      templateUrl: 'templates/sign-up.html'
    })
  
  
    .state('tabs', {
      url: '/tab',
      controller: 'TabsCtrl',
      templateUrl: 'templates/tabs.html'
    })
    .state('tabs.feed', {
      url: '/feed',
      views: {
        'tab-feed': {
          templateUrl: 'templates/tab-feed.html',
          controller: 'FeedCtrl'
        }
      }
    })  
  
    .state('tabs.map', {
      url: '/map',
      views: {
        'tab-map': {
          templateUrl: 'templates/tab-map.html',
          controller: 'MapCtrl'
        }
      }
    }) 
  
    .state('event-detail', {
      url: '/event-detail/:id',
      templateUrl: 'templates/event-detail.html',
      controller: 'EventDetailCtrl'
    })
  
  
    .state('profile', {
      url: '/profile/:id',
      controller: 'ProfileCtrl',
      templateUrl: 'templates/profile.html'
    })
  
    .state('org', {
      url: '/organizations',
      controller: 'OrgsCtrl',
      templateUrl: 'templates/organizations.html'
    })
  
 .state('hosted-events', {
    url: '/hosted-events',
    templateUrl: 'templates/hosted-events.html',
    controller: 'HostedEventsCtrl'  
  })
  
  .state('upcoming-events', {
    url: '/upcoming-events',
    templateUrl: 'templates/upcoming-events.html',
    controller: 'UpcomingEventsCtrl'
  })
  
  .state('get-verified', {
    url: '/get-verified',
    templateUrl: 'templates/get-verified.html',
    controller: 'GetVerifiedCtrl'
  })
  
  .state('leaderboard', {
    url: '/leaderboard',
    templateUrl: 'templates/leaderboard.html',
    controller: 'LeaderboardCtrl'
  })
  
  .state('my-orgs', {
    url: '/my-orgs',
    templateUrl: 'templates/my-orgs.html',
    controller: 'MyOrgsCtrl'
  })
  
  .state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html',
    controller: 'SettingsCtrl'
  });
  
  
  // if none of the above states are matched, use this as the fallback

  
  //comment out to bypass login screen 
    $urlRouterProvider.otherwise('/login');
  

//    $urlRouterProvider.otherwise('/tab');
    $httpProvider.interceptors.push('APIInterceptor');

  
})

