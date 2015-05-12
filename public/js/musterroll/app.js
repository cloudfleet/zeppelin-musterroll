var app = angular.module('musterroll', ['ngRoute','ngResource', 'xeditable']);

app.run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

app.config(["$routeProvider", function($routeProvider) {
  $routeProvider
    .when("/login", {
      templateUrl: "/templates/login.html",
      controller: "LoginController"
    })
    .when("/", {
      templateUrl: "/templates/profile.html",
      controller: "ProfileController"
    })
    .when("/users", {
      templateUrl: "/templates/users.html",
      controller: "UsersController"
    });

}]);
