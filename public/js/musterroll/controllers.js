var app = angular.module('musterroll');

app.controller('ProfileController', function ($scope, $http, $resource, $location, CurrentUserService) {

    if(!CurrentUserService.user)
    {
      $location.path('/login');
    }

    $scope.current_user_service = CurrentUserService;

    $scope.saveUser = function() {
        CurrentUserService.save();
    };

    $scope.getGreeter = function()
    {
      if(CurrentUserService.user)
      {
        if(CurrentUserService.user.first_name)
        {
          return CurrentUserService.user.first_name;
        }
        else
        {
          return CurrentUserService.user.id;
        }
      }
      else
      {
        return "Nobody";
      }
    };

});

app.controller('UsersController', function ($scope, $http, $resource, $location, UserService, CurrentUserService) {

    $scope.current_user_service = CurrentUserService;
    $scope.user_service = UserService;

    if(!CurrentUserService.user)
    {
      $location.path('/login');
    }
    else if (!CurrentUserService.user.isAdmin){
      $location.path('/');
    }

    $scope.addUser = function() {
        if($scope.newUserId)
        {
          UserService.addUser($scope.newUserId);
          $scope.newUserId = "";
        }
        alert("You can't add a user without id!");
    };
    $scope.saveUser = function(data, user) {
        angular.extend(user, data)
        UserService.saveUser(user);
        if(user.id === CurrentUserService.user.id)
        {
          CurrentUserService.refresh();
        }
    };
    $scope.removeUser = function(user) {
        if(!user.id === CurrentUserService.user.id)
        {
          UserService.saveUser(user);
        }
        else
        {
          alert("You can't commit suicide!");
        }
    };


    UserService.refresh();

});


app.controller('LoginController', function ($scope, $http, $resource, $location, CurrentUserService) {
  if(CurrentUserService.user)
  {
    $location.path('/');
  }

    $scope.login_error = false;

    $scope.login = function(){
      CurrentUserService.login($scope.username, $scope.password);
    };


});
