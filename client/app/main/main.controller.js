'use strict';

angular.module('toDocomApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }

      $http.post('/api/things', {
        name: $scope.newThing
      });

      $scope.newThing = '';

    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    //Mis funciones y variables
    $scope.hideForm = true;

    $scope.openForm = function(){
      document.getElementById("inputTask").value="";
      if($scope.hideForm){
        $scope.hideForm = false;
      }else{
          $scope.hideForm = true;
      }
    };

    $scope.check =  function(task){
      if(task.completed){
        task.completed = false;
        document.getElementById(task._id).className = "fa fa-square-o";
      }else{
        document.getElementById(task._id).className = "fa fa-check-square";
        task.completed = true;
      }
      $http.put('/api/things/' + task._id, task);
    };
  });
