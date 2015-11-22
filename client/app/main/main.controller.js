'use strict';

angular.module('toDocomApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing.name === '') {
        return;
      }
      $http.post('/api/things', $scope.newThing);
      $scope.newThing = null;
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    //Mis funciones y variables
    $scope.hideForm = true;

    $scope.check =  function(task){
      task.completed = !task.completed;
      $http.put('/api/things/' + task._id, task);
    };

    $scope.changeChevron = function(id){
      if(document.getElementById(id).className=="fa fa-chevron-down" ){
        document.getElementById(id).className="fa fa-chevron-up";
      }else{
        document.getElementById(id).className="fa fa-chevron-down";
      }
    }

  });
