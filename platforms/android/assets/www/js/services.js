angular.module('starter.services', ['backand'])

    .service('APIInterceptor', function ($rootScope, $q) {
        var service = this;

        service.responseError = function (response) {
            if (response.status === 401) {
                $rootScope.$broadcast('unauthorized');
            }
            return $q.reject(response);
        };
    })

.service('dataService', function($http, Backand) {
  var vm = this;
  //get the object name and optional parameters
  vm.getList = function(name, sort, filter, search) {
    return $http({
      method: 'GET',
      url: Backand.getApiUrl() + '/1/objects/' + name,
      params: {
        pageSize: 20,
        pageNumber: 1,
        filter: filter || '',
        sort: sort || '',
        deep: true,
        search: search
      }
    });
  },
  vm.getCollectionForId = function (name, id, collection, pageSize, pageNumber, filter, sort) {
      return $http({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/objects/' + name + '/' + id + '/' + collection,
          params: {
            pageSize: pageSize,
            pageNumber: pageNumber,
            sort: sort,
            filter: filter,
            deep: true,
            relatedObjects: true
          }
      });
  },
    
  vm.getOne = function (name, id, deep, level) {
      return $http({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/objects/' + name + '/' + id,
          params: {
            deep: deep
          }
      });
  },
    
  vm.create = function (name, data, returnObject) {
      return $http({
          method: 'POST',
          url : Backand.getApiUrl() + '/1/objects/' + name,
          data: data,
          params: {
            returnObject: returnObject
          }
      })
  },
  
  vm.delete = function (name, id) {
      return $http({
          method: 'DELETE',
          url : Backand.getApiUrl() + '/1/objects/' + name + '/' + id
      })
  },
  vm.update = function (name, id, data, returnObject) {
      return $http({
          method: 'PUT',
          url : Backand.getApiUrl() + '/1/objects/' + name + '/' + id,
          data: data,
          params: {
            returnObject: returnObject
          }
      })
  };
  
})

.factory('checkinFactory', function($http, Backand) {
  return {
    checkInUser: function(user, event) {
      return $http({
        method: 'POST',
        url: Backand.getApiUrl() + '/1/objects/users_events?returnObject=true',
        data: {
          user: user,
          event: event
        }
      });
    }
//    undoCheckIn: function(checkinId) {
//    	return $http({
//        method: 'DELETE',
//        url: Backand.getApiUrl() + '/1/objects/users_events/' + checkinId
//      });
//    }
  }
})

.factory('commentsFactory', function($http, Backand) {
  return {
    create: function(user, eventId, text) {
      return $http({
        method: 'POST',
        url: Backand.getApiUrl() + '/1/objects/comments?returnObject=true',
        data: {
          eventId: eventId,
          owner: user,
          content: text,
          date: new Date()
        }
      });
    },
    delete: function(commentId) {
    	return $http({
        method: 'DELETE',
        url: Backand.getApiUrl() + '/1/objects/comments/' + commentId
      });
    },
    getComments: function(id) {
      return $http({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/GetCommentsByEventId',
        params: {
          parameters: {
            eventCommentsId: id
          }
        }
      });
    }
  }
})

.filter('searchEvents', function(){
  return function (items, tags) {
    /* If `tags` is empty, return `items` unchanged */
    if (!tags || !tags.length) {
      return items;
    }

    /* Convert all `tags` to lowercase */
    var lowerTags = angular.copy(tags);
    angular.forEach(lowerTags, function (tag) {
      tag.text = angular.lowercase(tag.text); 
    });

    var filtered = [];
    (items || []).forEach(function (item) {
      var matches = lowerTags.some(function (tag) {
        return (angular.lowercase(item.data1).indexOf(tag.text) > -1) ||
               (angular.lowercase(item.data2).indexOf(tag.text) > -1);
      });
      if (matches) {
        filtered.push(item);
      }
    });

    return filtered;
  };
})

.service('CommentService', function ($http, Backand) {    
  var baseUrl = '/1/objects/';
  var objectName = 'comments/';
  
  function getUrl() {
    return Backand.getApiUrl() + baseUrl + objectName;
  }
  
  function getUrlForId(id) {
    return getUrl() + id;
  }
  
  getComments = function () {
    return $http.get(getUrl());
  };
 
  addComment = function(event) {
    return $http.post(getUrl(), event);
  }
 
  deleteComment = function (id) {
    return $http.delete(getUrlForId(id));
  };
  
  getComment = function (id) {
    return $http.get(getUrlForId(id));
  };
  
  getCommentsById = function (event) {
    return $http.get(getUrl() + "?eventId=" + event.id); //supposing you have event.id
  };
  
 
  return {
    getComments: getComments,
    addComment: addComment,
    deleteComment: deleteComment,
    getComment: getComment,
    getCommentsById: getCommentsById
  }   
})



.service('EventService', function ($http, Backand) {
  var baseUrl = '/1/objects/';
  var objectName = 'events/';
 
  function getUrl() {
    return Backand.getApiUrl() + baseUrl + objectName;
  }
 
  function getUrlForId(id) {
    return getUrl() + id;
  }
 
  getEvents = function () {
    return $http.get(getUrl());
  };
 
  addEvent = function(event) {
    return $http.post(getUrl(), event);
  }
 
  deleteEvent = function (id) {
    return $http.delete(getUrlForId(id));
  };
  
  getEvent = function (id) {
    return $http.get(getUrlForId(id));
  };
  
  return {
    getEvents: getEvents,
    addEvent: addEvent,
    deleteEvent: deleteEvent,
    getEvent: getEvent
  }
})


.service('LocationService', function ($http, Backand) {
  var baseUrl = '/1/objects/';
  var objectName = 'locations/';
 
  function getUrl() {
    return Backand.getApiUrl() + baseUrl + objectName;
  }
 
  function getUrlForId(id) {
    return getUrl() + id;
  }
 
  getLocations = function () {
    return $http.get(getUrl());
  };
 
  addLocation = function(event) {
    return $http.post(getUrl(), event);
  }

  getLocation = function (id) {
    return $http.get(getUrlForId(id));
  };
  
  return {
    getLocations: getLocations,
    addLocation: addLocation,
    getLocation: getLocation
  }
})

.service('OrgService', function ($http, Backand) {
  var baseUrl = '/1/objects/';
  var objectName = 'organizations/';
 
  function getUrl() {
    return Backand.getApiUrl() + baseUrl + objectName;
  }
 
  function getUrlForId(id) {
    return getUrl() + id;
  }
 
  getOrgs = function () {
    return $http.get(getUrl());
  };
 
  addOrg = function(org) {
    return $http.post(getUrl(), event);
  }
 
  deleteOrg = function (id) {
    return $http.delete(getUrlForId(id));
  };
  
  getOrg = function (id) {
    return $http.get(getUrlForId(id));
  };
  
  return {
    getOrgs: getOrgs,
    addOrg: addOrg,
    deleteOrg: deleteOrg,
    getOrg: getOrg
  }
})

.service('LoginService', function (Backand) {
        var service = this;

        service.signin = function (email, password, appName) {
            //call Backand for sign in
            return Backand.signin(email, password);
        };

        service.anonymousLogin= function(){
            // don't have to do anything here,
            // because we set app token att app.js
        }

        service.socialSignIn = function (provider) {
            return Backand.socialSignIn(provider);
        };

        service.socialSignUp = function (provider) {
            return Backand.socialSignUp(provider);

        };

        service.signout = function () {
            return Backand.signout();
        };

        service.signup = function(firstName, lastName, email, password, confirmPassword){
            return Backand.signup(firstName, lastName, email, password, confirmPassword);
        }
    })

.service('AuthService', function($http, Backand){

    var self = this;
    var baseUrl = Backand.getApiUrl() + '/1/objects/';
    self.appName = '';//CONSTS.appName || '';
    self.currentUser = {};

    loadUserDetails();

    function loadUserDetails() {
        self.currentUser.name = Backand.getUsername();
        if (self.currentUser.name) {
            getCurrentUserInfo()
                .then(function (data) {
                    self.currentUser.details = data;
                });
        }
    }


    self.getSocialProviders = function () {
        return Backand.getSocialProviders()
    };

    self.socialSignIn = function (provider) {
        return Backand.socialSignIn(provider)
            .then(function (response) {
                loadUserDetails();
                return response;
            });
    };

    self.socialSignUp = function (provider) {
        return Backand.socialSignUp(provider)
            .then(function (response) {
                loadUserDetails();
                return response;
            });
    };

    self.setAppName = function (newAppName) {
        self.appName = newAppName;
    };

    self.signIn = function (username, password, appName) {
        return Backand.signin(username, password, appName)
            .then(function (response) {
                loadUserDetails();
                return response;
            });
    };

    self.signUp = function (firstName, lastName, username, password, parameters) {
        return Backand.signup(firstName, lastName, username, password, password, parameters)
            .then(function (signUpResponse) {

                if (signUpResponse.data.currentStatus === 1) {
                    return self.signIn(username, password)
                        .then(function () {
                            return signUpResponse;
                        });

                } else {
                    return signUpResponse;
                }
            });
    };

    self.changePassword = function (oldPassword, newPassword) {
        return Backand.changePassword(oldPassword, newPassword)
    };

    self.requestResetPassword = function (username) {
        return Backand.requestResetPassword(username, self.appName)
    };

    self.resetPassword = function (password, token) {
        return Backand.resetPassword(password, token)
    };

    self.logout = function () {
        Backand.signout().then(function () {
            angular.copy({}, self.currentUser);
        });
    };
  

    function getCurrentUserInfo() {
        return $http({
            method: 'GET',
            url: baseUrl + "users",
            params: {
                filter: JSON.stringify([{
                    fieldName: "email",
                    operator: "contains",
                    value: self.currentUser.name
                }])
            }
        }).then(function (response) {
            if (response.data && response.data.data && response.data.data.length == 1)
                return response.data.data[0];
        });
    }
})