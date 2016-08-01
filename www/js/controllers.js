angular.module('starter.controllers', ['backand'])


  .controller('LoginCtrl', function (Backand, $state, $rootScope, LoginService, $ionicPopup, dataService) {
  
    var login = this;

    function signin() {
      LoginService.signin(login.email, login.password)
          .then(function () {
          onLogin();
        }, function (error) {
          console.log(error);

          $rootScope.showAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Login Error',
                template: error.error_description
              });
          };

          $rootScope.showAlert();
        });
    }

    function anonymousLogin() {
      LoginService.anonymousLogin();
      onLogin();
    }

    function onLogin() {
      $rootScope.$broadcast('authorized');
      $state.go('tabs.feed');
      login.username = Backand.getUsername();
          
      $rootScope.cUser = Backand.getUserDetails().$$state.value;
//      console.log($rootScope.cUser);
//      getUser();
      
      $rootScope.$broadcast('parent', $rootScope.cUser); // going down!

    }

    function signout() {
      LoginService.signout()
          .then(function () {
              //$state.go('tab.login');
          $rootScope.$broadcast('logout');
          $state.go($state.current, {}, {reload: true});
        });
    }

    function socialSignIn(provider) {
      LoginService.socialSignIn(provider)
          .then(onValidLogin, onErrorInLogin);
    }

    function socialSignUp(provider) {
      LoginService.socialSignUp(provider)
          .then(onValidLogin, onErrorInLogin);
    }

    onValidLogin = function (response) {
        onLogin();
        login.username = response.data;
    };

    onErrorInLogin = function(rejection){
        login.error = rejection.data;
        $rootScope.$broadcast('logout');

    };

    login.username = '';
    login.error = '';
    login.signin = signin;
    login.signout = signout;
    login.anonymousLogin = anonymousLogin;
    login.socialSignup = socialSignUp;
    login.socialSignin = socialSignIn;
})


  .controller('SignUpCtrl', function (Backand, $state, $rootScope, LoginService) {
        var vm = this;

        vm.signup = signUp;

        function signUp(){
            vm.errorMessage = '';

            LoginService.signup(vm.firstName, vm.lastName, vm.email, vm.password, vm.again)
                .then(function (response) {
                    // success
                    onLogin();
                }, function (reason) {
                    if(reason.data.error_description !== undefined){
                        vm.errorMessage = reason.data.error_description;
                    }
                    else{
                        vm.errorMessage = reason.data;
                    }
                });
        }


        function onLogin() {
            $rootScope.$broadcast('authorized');
            $state.go('tabs.feed');
        }


        vm.email = '';
        vm.password ='';
        vm.again = '';
        vm.firstName = '';
        vm.lastName = '';
        vm.errorMessage = '';
    })

.controller('TabsCtrl', function($scope, $ionicSideMenuDelegate) {
  
//  $scope.openMenu = function () {
//    $ionicSideMenuDelegate.toggleLeft();
//  };

})


.controller('FeedCtrl', ['$scope', '$filter', '$ionicModal', '$ionicSideMenuDelegate', 'EventService', 'dataService', 'LocationService', 'Backand',function($scope, $filter, $ionicModal, $ionicSideMenuDelegate, EventService, dataService, LocationService, Backand) {
  
  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };

  var vm = this;
  
  var currentUser = Backand.getUserDetails().$$state.value;
  
  $scope.isVerified = null;
  
  //check if user is Verified or an Admin
  if (currentUser.role == "Admin" || currentUser.role == "Verified"){
      $scope.isVerified = true;
    }
  else {
      $scope.isVerified = false;
  }

  $scope.events = [];
  $scope.input = {};
  
  $scope.input.date = new Date();

  $scope.locations = [];
  
  $scope.convertToInt = function(id){
    return parseInt(id, 10);
};
  
  function getLocations() {
    LocationService.getLocations()
    .then(function (result) {
      $scope.locations = result.data.data;
    });
  }
  
  getLocations();

function getAllEvents() {
  dataService.getList('events')
    .then(function(response) {
      $scope.events = response.data;
      console.log($scope.events.data);
  });
}

  $scope.addEvent = function() {
    EventService.addEvent($scope.input)
    .then(function(result) {
      
    var event = result.data;
      
      
    //fileUpload
  
   // Create a server side action in backand
  // Go to any object's actions tab 
  // and click on the Backand Storage icon.
  // Backand consts:
//  var baseUrl = '/1/objects/';
//  var baseActionUrl = baseUrl + 'action/';
//  var objectName = 'events';
//  var filesActionName = 'files';
//
//  // Display the image after upload
//  $scope.imageUrl = null;
//
//  // Store the file name after upload to be used for delete
//  $scope.filename = null;
//
//  // input file onchange callback
//  function imageChanged(fileInput) {
//
//    //read file content
//    var file = fileInput.files[0];
//    var reader = new FileReader();
//
//    reader.onload = function(e) {
//      upload(file.name, e.currentTarget.result).then(function(res) {
//        $scope.imageUrl = res.data.url;
//        $scope.filename = file.name;
////        console.log($scope.filename);
//                
//      updateEventImgUrl(event.id, $scope.imageUrl).then(function(response) {
////        getEvent();
//        $scope.imgUrl = response.imgUrl;
//      });
//        
//      }, function(err){
//        alert(err.data);
//      });
//    };
//    
//    reader.readAsDataURL(file);
//  }
//
//  // register to change event on input file 
//  function initUpload() {
//    var fileInput = document.getElementById('fileInput_event');
//
//    if (fileInput){
//      fileInput.addEventListener('change', function(e) {
//        imageChanged(fileInput);
//      });
//    }
////    getUser();    
//  }
//
//   // call to Backand action with the file name and file data  
//  function upload(filename, filedata) {
//    // By calling the files action with POST method in will perform 
//    // an upload of the file into Backand Storage
//    return $http({
//      method: 'POST',
//      url : Backand.getApiUrl() + baseActionUrl +  objectName,
//      params:{
//        "name": filesActionName
//      },
//      headers: {
//        'Content-Type': 'application/json'
//      },
//      // you need to provide the file name and the file data
//      data: {
//        "filename": filename,
//        "filedata": filedata.substr(filedata.indexOf(',') + 1, filedata.length) //need to remove the file prefix type
//      }
//    });
//  }
//      
//      initUpload(); 
//      updateEventImgUrl(result.id, url, name)
      $scope.input = {};
      getAllEvents();
    });
  };
 
  
  $scope.deleteEvent = function(id) {
    EventService.deleteEvent(id)
    .then(function (result) {
      getAllEvents();
    });
  };
 
  getAllEvents();
  
//  function getTags() {
//    dataService.getList('tags')
//    .then(function (result) {
//      $scope.tags = result.data.data;
//      console.log($scope.tags)
//    });
//  }
//  
//  getTags();
  
  $scope.filter = {};

  $scope.getTags2 = function () {
      return ($scope.events.data || []).map(function (event) {
//          console.log(event.__metadata.descriptives.tags);
          return event.__metadata.descriptives.tags.label;
      }).filter(function (event, idx, arr) {
          return arr.indexOf(event) === idx;
      });
  };

  $scope.filterByCategory = function (event) {
      return $scope.filter[event.__metadata.descriptives.tags.label] || noFilter($scope.filter);
  };

  function noFilter(filterObj) {
      for (var key in filterObj) {
          if (filterObj[key]) {
              return false;
          }
      }
      return true;
  }  
  
  
  $ionicModal.fromTemplateUrl('new-event.html', function(modal) {
    $scope.modal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  });
  
  $ionicModal.fromTemplateUrl('filter-events.html', function(modal) {
    $scope.modal2 = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true,
  });

  


//  //get profile image by user id
//  function getEventFiles(eventId) {
//    return $http({
//      method: 'GET',
//      url : Backand.getApiUrl() + baseActionUrl +  objectName + '/' + eventId,
//      params:{
//        "name": filesActionName
//      }
//    });
//  }
//  
//  function updateEventImgUrl(eventId, url, name) {
//      return $http({
//          method: 'PUT',
//          url : Backand.getApiUrl() + '/1/objects/events/' + eventId,
//          data: {
//            "imgUrl": url
//          }
////          params: {
////            returnObject: returnObject
////          }
//      });
//  }

//  $scope.deleteFile = function(){
////    if (!$scope.filename){
////      alert('Please choose a file');
////      return;
////    }
//    console.log('clicked!');
//    // By calling the files action with DELETE method in will perform 
//    // a deletion of the file from Backand Storage
//    $http({
//      method: 'DELETE',
//      url : Backand.getApiUrl() + baseActionUrl +  objectName,
//      params:{
//        "name": filesActionName
//      },
//      headers: {
//        'Content-Type': 'application/json'
//      },
//      // you need to provide the file name 
//      data: {
//        "filename": $scope.fileName
//      }
//    }).then(function(){
//      // Reset the form
//      
//      $scope.imageUrl = null;
//      $scope.fileName = null;
//      updateEventImgUrl($scope.event.eventId, $scope.imageUrl).then(function(response) {
////        getUser();
//        $scope.imgUrl = response.profileImgUrl; 
////        $scope.fileName = response.profileImgName;
//      });
//      document.getElementById('fileInput').value = "";
//    });
//  };
  
//    $scope.initCtrl = function() {
//    initUpload();
//  };
  
}])


//.controller('EventDetailCtrl', ['$scope', '$http','$stateParams', '$ionicSideMenuDelegate', 'EventService', 'CommentService', function($scope, $http, $stateParams, $ionicSideMenuDelegate, EventService, CommentService) { 

.controller('EventDetailCtrl', ['$scope', '$http','$stateParams', '$ionicSideMenuDelegate', 'dataService', 'EventService', 'commentsFactory', 'Backand', 'CommentService', 'checkinFactory', '$ionicPopup', function($scope, $http, $stateParams, $ionicSideMenuDelegate, dataService, EventService, commentsFactory, Backand, CommentService, checkinFactory, $ionicPopup) { 
  
//  $scope.active_content = 'comments';
//	$scope.setActiveContent = function(active_content){
//		$scope.active_content = active_content;
//	}
 
  
  var vm = this;

  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };    
  
  var id = $stateParams.id;
  var userId = Backand.getUserDetails().$$state.value.userId;
  $scope.currentUser = Backand.getUserDetails().$$state.value;
  
  function getUser() {
    dataService.getOne('users', $scope.currentUser.userId, true).then(function(response) {
      $scope.user = response.data;
          console.log($scope.user);
    });
  }
    getUser();
  
  function getEvent() {
    dataService.getOne('events', id, true).then(function(response) {
      $scope.event = response.data;
    });
  }
  
  getEvent();

  $scope.input = {};
  
  function getComments() {
  dataService.getCollectionForId('events', id, 'eventCommentsId')
    .then(function(response) {
      $scope.comments = response.data;
  });
}
  
  getComments();
  
//    $scope.owner_comment = [];
//
//  // Gets all the Events at the marker location
//  for (i in $scope.comments){
//    if ($scope.comments[i].__metadata.descriptives.owner.value == marker.title){
//      $scope.events_at_location.push($scope.events.data[i]);
//      console.log($scope.events_at_location);
//    }
//  }
//
//  

  
  
  $scope.addComment = function() {
    commentsFactory.create(userId, id, $scope.input.content)
    .then(function(result) {
      $scope.input = {};
      getComments();
      
      getUser();
      var newPoints = $scope.user.karmaPoints + 5;

        addKarmaPoints(userId, newPoints).then(function(response) {
            getUser();
            console.log($scope.user.karmaPoints);
        });
    });
  };

   
  $scope.deleteComment = function(id) {
    CommentService.deleteComment(id)
    .then(function (result) {
      getComments();
    });
  };
  
  $scope.isCheckedIn = null;

  function getCheckedInUsers(){
    dataService.getCollectionForId('events', id, 'users')
    .then(function(response) {
          $scope.users = response.data.relatedObjects.users;
          $scope.users_events = response.data.data;
      
          var users_events_length = Object.keys($scope.users_events).length;
            
          for (var i=0; i < users_events_length; i++) {
            if (userId == $scope.users_events[i].user){
                $scope.isCheckedIn = true;
            }
            else {
              $scope.isCheckedIn = false;
            }
          }
      
          console.log($scope.isCheckedIn);
          
      });
  }
  
  getCheckedInUsers();
             
  $scope.checkIn = function() {    
    if ($scope.isCheckedIn){
          $scope.showAlert2 = function() {
             var alertPopup2 = $ionicPopup.alert({
               title: 'CheckIn Error',
               template: 'You are already checked in'
             });
           };

        $scope.showAlert2();
      }
    else {
      console.log('You are not checked in');
        checkinFactory.checkInUser(userId, id)
        .then(function(result) {
//            $scope.user_eventId = result.data.id;
            $scope.isCheckedIn = true;
            console.log('now you are!');
            console.log($scope.isCheckedIn);
          
            getUser();
          console.log($scope.user);
          var newPoints = $scope.user.karmaPoints + 20;
          console.log(newPoints);
          
            addKarmaPoints(userId, newPoints).then(function(response) {
                getUser();
                console.log($scope.user.karmaPoints);
//                $scope.pts = response.karmaPoints + 10; 
            });
        });
      }
    };

  $scope.undoCheckIn = function() {
    
    var users_events_length = Object.keys($scope.users_events).length;
                
    for (var i=0; i < users_events_length; i++) {
      if (userId == $scope.users_events[i].user){
          $scope.user_eventId = $scope.users_events[i].id;
      }
    }
    
    console.log($scope.user_eventId);
    
    dataService.delete('users_events', $scope.user_eventId)
      .then(function() {
        $scope.isCheckedIn = false;
        console.log('removed checked-in status');
        getCheckedInUsers();
    });
  };
  
  
    function addKarmaPoints(userId, pts) {
      return $http({
          method: 'PUT',
          url : Backand.getApiUrl() + '/1/objects/users/' + userId,
          data: {
            "karmaPoints": pts
          }
//          params: {
//            returnObject: returnObject
//          }
      });
  }
  
     
}])

.controller('MapCtrl', ['$scope', '$state', '$cordovaGeolocation', '$ionicSideMenuDelegate', '$ionicModal', 'LocationService', 'dataService', '$http', 'Backand', function($scope, $state, $cordovaGeolocation, $ionicSideMenuDelegate, $ionicModal, LocationService, dataService, $http, Backand) {
  
//  $scope.events = getLocalStorage.getEvents();
  
  $ionicModal.fromTemplateUrl('new-event.html', function(modal) {
    $scope.modal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  });
  
  $ionicModal.fromTemplateUrl('map-events.html', function($ionicModal) {
      $scope.map_events = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });  
  
  $scope.openModal = function(selected_marker) {
    $scope.selected_marker = selected_marker;
    $scope.map_events.show();
};
  
  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  
  var currentUser = Backand.getUserDetails().$$state.value;
  
  $scope.isVerified = null;
  
  //check if user is Verified or an Admin
  if (currentUser.role == "Admin" || currentUser.role == "Verified"){
      $scope.isVerified = true;
    }
  else {
      $scope.isVerified = false;
  }

  
  var options = {timeout: 10000, enableHighAccuracy: true};
  
  
//    dataService.getList('locations').then(function(response) {
    
  dataService.getList('events').then(function(response) {
    $scope.events = response.data;
    $scope.locations = $scope.events.relatedObjects.locations;    
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
 
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
 

    $scope.markers = [];
      
    
    var infoWindow = new google.maps.InfoWindow();
    
    var createMarker = function (info){
        
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.name
        });
      
      
        marker.content = '<div class="infoWindowContent">' + info.name + '</div>';
        
        google.maps.event.addListener(marker, 'click', function(){

          $scope.events_at_location = [];
          
          // Gets all the Events at the marker location
//          for (var i = 0; i < $scope.events.data.length; i++){
            for (i in $scope.events.data){
            if ($scope.events.data[i].__metadata.descriptives.locationId.label == marker.title){
              $scope.events_at_location.push($scope.events.data[i]);
            }
          }
          
          $scope.openModal(marker);          
        });
        
        $scope.markers.push(marker);
    };  
    
//  var locations_length = Object.keys($scope.locations).length;

  
//  for (var i = 1; i <= locations_length; i++){
    for (i in $scope.locations){
        createMarker($scope.locations[i]);
    }

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    };
  }, function(error){
    console.log("Could not get location");
  }); 
        
  });
  
  
  
//  function codeAddress() {
//    var address = document.getElementById("address").value;
//    geocoder.geocode( { 'address': address}, function(results, status)
//    {
//        if (status == google.maps.GeocoderStatus.OK)
//        {
//            map.setCenter(results[0].geometry.location);
//            var marker = new google.maps.Marker(
//            {
//                map: map,
//                position: results[0].geometry.location
//            });
//        }
//        else
//        {
//            alert("Geocode was not successful for the following reason: " + status);
//        }
//    });
//  }
}])

.controller('ProfileCtrl', ['$scope', '$ionicSideMenuDelegate', 'AuthService', 'Backand', '$http', 'dataService', '$stateParams',function($scope, $ionicSideMenuDelegate, AuthService, Backand, $http, dataService, $stateParams) {
  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  
//  $scope.user = Backand.getUserDetails().$$state.value;
  
  var id = $stateParams.id;
//  var userId = Backand.getUserDetails().$$state.value.userId;
//  $scope.currentUser = Backand.getUserDetails().$$state.value;
  
  function getUser() {
    dataService.getOne('users', id, true).then(function(response) {
      $scope.user = response.data;
    });
  }
  
  getUser();
    
    //fileUpload
  
   // Create a server side action in backand
  // Go to any object's actions tab 
  // and click on the Backand Storage icon.
  // Backand consts:
  var baseUrl = '/1/objects/';
  var baseActionUrl = baseUrl + 'action/';
  var objectName = 'users';
  var filesActionName = 'files';

  // Display the image after upload
  $scope.imageUrl = null;

  // Store the file name after upload to be used for delete
  $scope.filename = null;

  // input file onchange callback
  function imageChanged(fileInput) {

    //read file content
    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
      upload(file.name, e.currentTarget.result).then(function(res) {
        $scope.imageUrl = res.data.url;
        $scope.filename = file.name;
                
      updateUserProfileImgUrl($scope.user.userId, $scope.imageUrl, $scope.filename).then(function(response) {
        getUser();
        $scope.imgUrl = response.profilePicUrl; 
        $scope.fileName = response.profilePicName;
      });
        
      }, function(err){
        alert(err.data);
      });
    };
    
    reader.readAsDataURL(file);
  }
  
//  $('.fileInput_event').change(function(){
//    var curElement = $(this).parent().parent().find('.image');
//    console.log(curElement);
//    var reader = new FileReader();
//
//    reader.onload = function (e) {
//        // get loaded data and render thumbnail.
//        curElement.attr('src', e.target.result);
//    };
//
//    // read the image file as a data URL.
//    reader.readAsDataURL(this.files[0]);
//});

  // register to change event on input file 
  function initUpload() {
    var fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', function(e) {
      imageChanged(fileInput);
    });
    getUser();    
  }

   // call to Backand action with the file name and file data  
  function upload(filename, filedata) {
    // By calling the files action with POST method in will perform 
    // an upload of the file into Backand Storage
    return $http({
      method: 'POST',
      url : Backand.getApiUrl() + baseActionUrl +  objectName,
      params:{
        "name": filesActionName
      },
      headers: {
        'Content-Type': 'application/json'
      },
      // you need to provide the file name and the file data
      data: {
        "filename": filename,
        "filedata": filedata.substr(filedata.indexOf(',') + 1, filedata.length) //need to remove the file prefix type
      }
    });
  }

  //get profile image by user id
  function getUserFiles(userId) {
    return $http({
      method: 'GET',
      url : Backand.getApiUrl() + baseActionUrl +  objectName + '/' + userId,
      params:{
        "name": filesActionName
      }
    });
  }
  
  function updateUserProfileImgUrl(userId, url, name) {
      return $http({
          method: 'PUT',
          url : Backand.getApiUrl() + '/1/objects/users/' + userId,
          data: {
            "profilePicUrl": url,
            "profilePicName": name
          }
//          params: {
//            returnObject: returnObject
//          }
      });
  }

  $scope.deleteFile = function(){
//    if (!$scope.filename){
//      alert('Please choose a file');
//      return;
//    }
    console.log('clicked!');
    // By calling the files action with DELETE method in will perform 
    // a deletion of the file from Backand Storage
    $http({
      method: 'DELETE',
      url : Backand.getApiUrl() + baseActionUrl +  objectName,
      params:{
        "name": filesActionName
      },
      headers: {
        'Content-Type': 'application/json'
      },
      // you need to provide the file name 
      data: {
        "filename": $scope.fileName
      }
    }).then(function(){
      // Reset the form
      
      $scope.imageUrl = null;
      $scope.fileName = null;
      updateUserProfileImgUrl($scope.user.userId, $scope.imageUrl, $scope.fileName).then(function(response) {
        getUser();
        $scope.imgUrl = response.profileImgUrl; 
        $scope.fileName = response.profileImgName;
      });
      document.getElementById('fileInput').value = "";
    });
  };
  
    $scope.initCtrl = function() {
    initUpload();
  };

}])

.controller('OrgsCtrl', ['$scope', '$ionicSideMenuDelegate', 'dataService', 'Backand', '$http', function($scope, $ionicSideMenuDelegate, dataService, Backand, $http) {
  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  
  $scope.verified = [];
  
    
  function getVerifiedUsers() {
  dataService.getList('users')
    .then(function(response) {
      $scope.users = response.data.data;
      
      var v_users_length = Object.keys($scope.users).length;
    
      for (var i = 0; i < v_users_length; i++){
        if ($scope.users[i].role == 'Verified'){
            $scope.verified.push($scope.users[i]);
        }
      }
  });
}
  
  getVerifiedUsers();
  
}])

.controller('HostedEventsCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

.controller('MyOrgsCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
})


.controller('UpcomingEventsCtrl', ['$scope', '$stateParams', '$ionicSideMenuDelegate', function($scope, $stateParams, $ionicSideMenuDelegate) {
  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  
  //dummy data
//  $scope.upcomingevents = [
//    { 
//      img: '',
//      name: 'IUSA Call-Out',
//      date: '12/20/2016',
//      time: '6:00pm',
//      location: 'BH202'
//    },
//    {
//      img: '',
//      name: 'Ski Club Meeting',
//      date: '12/20/2016',
//      time: '7:30pm',
//      location: 'Info East 120'
//    }
//  ];
  
}])

.controller('GetVerifiedCtrl', function($scope, $ionicSideMenuDelegate, Backand, $ionicModal, $http, dataService) {
  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  
  $scope.input = {};
  $scope.user = Backand.getUserDetails().$$state.value;
  
    
function getRequests() {
  dataService.getList('verificationRequests')
    .then(function(response) {
      $scope.requests = response.data.data;
      console.log($scope.requests);
    
      $scope.requestSent = null;
  
      for (i in $scope.requests) {
        if ($scope.user.username == $scope.requests[i].username){
            $scope.requestSent = true;
            console.log('request sent');
        }
        else {
          $scope.requestSent = false;
          console.log('request not sent');
        }
      }
  });
}
  
  getRequests();
  
  
  function addKarmaPoints(userId, pts) {
      return $http({
          method: 'PUT',
          url : Backand.getApiUrl() + '/1/objects/users/' + userId,
          data: {
            "karmaPoints": pts
          }
//          params: {
//            returnObject: returnObject
//          }
      });
  }
  
    function addRequest(user, input) {
      return $http({
        method: 'POST',
        url: Backand.getApiUrl() + '/1/objects/verificationRequests',
        data: {
          name: user.firstName + ' ' + user.lastName,
          username: user.username,
          email: user.email,
          position: input.position,
          request: input.request
        }
      });
    }
  
    $scope.addRequest = function() {
      addRequest($scope.user, $scope.input)
      .then(function(result) {
        console.log(result);
        $scope.input = {};
        $scope.requestSent = true;
      });
    }
    
$ionicModal.fromTemplateUrl('verified.html', function(modal) {
    $scope.verified_modal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  });
})

.controller('LeaderboardCtrl', function($scope, $ionicSideMenuDelegate, dataService) {
  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  
  
function getAllUsers() {
  dataService.getList('users')
    .then(function(response) {
      $scope.users = response.data.data;
      console.log($scope.users);
  });
}
  
  getAllUsers();
    
})

.controller('SettingsCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.openMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

.controller('NavCtrl', function($scope, $rootScope, Backand, dataService) {
  

  $scope.$on('parent', function (event, data) {
    $scope.current_user = data
    console.log(data); // 'Some data'
    
    dataService.getOne('users', $scope.current_user.userId, true).then(function(response) {
      $scope.user = response.data;
      console.log($scope.user);
        
//      //check if user is Verified or an Admin
      if ($scope.user.role == "Admin" || $scope.user.role == "Verified"){
          $scope.isVerified = true;
          console.log($scope.isVerified);
        }
      else {
          $scope.isVerified = false;
          console.log($scope.isVerified);
        }
      });
  });

  
  function getUser() {
      LoginCtrl.onLogin();
//      $scope.user = $rootScope.cUser;
      console.log($rootScope.cUser);
    
//    dataService.getOne('users', $scope.user.userId, true).then(function(response) {
//      $scope.user2 = response.data;
//      console.log($scope.user2);
//        
////      //check if user is Verified or an Admin
//      if ($scope.user.role == "Admin" || $scope.user.role == "Verified"){
//          $scope.isVerified = true;
//          console.log($scope.isVerified);
//        }
//      else {
//          $scope.isVerified = false;
//          console.log($scope.isVerified);
//        }
//      });
    }
  
//  getUser();

//  $scope.user = $rootScope.user;
  
  
//  function getUser() {
//    
//      $scope.isVerified = null;
//
//    var currentUser = Backand.getUserDetails().$$state.value;
//
//    dataService.getOne('users', currentUser.userId, true).then(function(response) {
//      $scope.user = response.data;
//      console.log($scope.user);
//      
//        var currentUser = Backand.getUserDetails().$$state.value;
//  
////      //check if user is Verified or an Admin
//      if (currentUser.role == "Admin" || currentUser.role == "Verified"){
//          $scope.isVerified = true;
//          console.log($scope.isVerified);
//        }
//      else {
//          $scope.isVerified = false;
//          console.log($scope.isVerified);
//        }
//      });
//  }
//  
//if ($rootScope.isLoggedin) {
//    
//  getUser();

//  if (Backand.getUserDetails().$$state.value){
//     getUser(); 
//    console.log('got user');
//  }
//  else {
//    console.log('failed');
//  }

//  
//  //dummy data
//  $scope.user = 
//    {
//      img: 'img/ben.png',
//      name: 'Ben Sparrow',
//      org: 'IU Student Association',
//      pts: '212'
//    };
//  
});

