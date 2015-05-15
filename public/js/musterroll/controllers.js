var app = angular.module('musterroll');

app.controller('ProfileController', function ($scope, $http, $resource, $location, CurrentUserService) {

    if(!CurrentUserService.user)
    {
      $location.path('/login');
    }

    $scope.current_user_service = CurrentUserService;

    $scope.password_change_info = {};

    $scope.edit = function()
    {
      $scope.edit_mode = true;
    };
    $scope.cancel = function()
    {
      $scope.edit_mode = false;
      CurrentUserService.refresh();
    };

    $scope.save = function() {
        CurrentUserService.save();
        $scope.edit_mode = false;
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

    $scope.changePassword = function()
    {
      if($scope.password_change_info.new_password === $scope.password_change_info.new_password_repeat)
      {
        CurrentUserService.setPassword($scope.password_change_info.old_password, $scope.password_change_info.new_password);
        $("#password-dialog").modal("hide");
      }
      else
      {
        alert("New Passwords don't match");
      }
    };

    $scope.showChangePasswordDialog = function()
    {
      $("#password-dialog").modal("show");
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
        else {
          alert("You can't add a user without id!");
        }
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
        if(!(user.id === CurrentUserService.user.id))
        {
          UserService.removeUser(user);
        }
        else
        {
          alert("You can't commit suicide!");
        }
    };

    $scope.showChangePasswordDialog = function(user)
    {
      $scope.password_change_info = {
        id: user.id,
        skip_old_password: true
        };
      $("#password-dialog").modal("show");
    }

    $scope.changePassword = function()
    {
      if($scope.password_change_info.new_password === $scope.password_change_info.new_password_repeat)
      {
        UserService.setPassword(
          $scope.password_change_info.id,
          $scope.password_change_info.old_password,
          $scope.password_change_info.new_password);
        $("#password-dialog").modal("hide");
      }
      else
      {
        alert("New Passwords don't match");
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
