'use strict';

angular.module('toDocomApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });

  //Mis funciones
  var rename = function(id) {
    console.log(id);
      document.getElementById("renameInput").type="text";
  };
