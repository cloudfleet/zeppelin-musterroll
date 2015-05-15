var app = angular.module('musterroll');

app.service("UserService", function( $http, $q, $location, $resource) {

  var usersResource = $resource("/api/v1/users/:id", {id: '@id'});
  var usersCollection = $resource("/api/v1/users/");

  var service = {
    saveUser: function(user) {
        var result = usersResource.save(user);
        return result;
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
    },
    setPassword: function(user_id, old_password, new_password) {
      return $http({
        method: "PUT",
        url: "/api/v1/users/" + user_id + "/password",
        data: {
          old_password: old_password,
          password: new_password
        }
      }).success(function(data){
        alert("Password set successfully");
      });
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
        return UserService.saveUser(service.user)
          .$promise
          .then(function(data){
            service.user = data;
            console.log(data);
          });
    },

    setPassword: function(old_password, new_password) {
      return UserService.setPassword(service.user.id, old_password, new_password);
    }


  };

  service.refresh();

  return service;
});
