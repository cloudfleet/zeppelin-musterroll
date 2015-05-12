var app = angular.module('musterroll');

app.service("UserService", function( $http, $q, $location, $resource) {

  var usersResource = $resource("/api/v1/users/:id", {id: '@id'});
  var usersCollection = $resource("/api/v1/users/");

  var service = {
    saveUser: function(user) {
        return usersResource.save(user);
    },
    refresh: function() {
      service.users = usersCollection.query(function(){});
    },
    addUser: function(newUserId) {
        var newUser = {id:newUserId, firstName:"", lastName:"", isAdmin: false};
        service.saveUser(newUser);
        service.refresh();
    },
    removeUser: function(user) {
        usersResource.delete(user);
        service.refresh();
    }

  };

  return service;
});

app.service("CurrentUserService", function( $http, $q, $location, $resource,  UserService) {

  var usersResource = $resource("/api/v1/users/:id", {id: '@id'});

  var service = {
    login: function(username, password) {
      $http({
          method: 'POST',
          url: '/login',
          data: $.param({
              'username': username,
              'password': password
          }),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(function ()
          {
              service.login_error = false;
              service.refresh();
              $location.path('/');
          }
      ).error(function()
          {
              service.login_error = true;
              service.user = null;
          });

    },
    refresh: function()
    {
        $http.get("/api/v1/currentUser").success(function(data){
            service.user = data;
            if(service.user.isAdmin)
            {
              UserService.refresh();
            }
            console.log(data);
        });
    },
    save: function()
    {
        UserService.save(service.user).success(function(data){
            service.user = data;
            console.log(data);
        });
    },



  };

  service.refresh();

  return service;
});
