'use strict';

angular.module('toDocomApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];
    $scope.categories = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $http.get('/api/category').success(function(categories) {
      $scope.categories = categories;
      socket.syncUpdates('category', $scope.categories);
    });

    $scope.addThing = function() {
      if($scope.newThing.name === '') {
        return;
      }
      $http.post('/api/things', $scope.newThing);

      if($scope.newThing.tag != ''){
        $http.post('/api/category', {
          name: $scope.newThing.tag,
          tasks: [{_id: $scope.newThing._id}]
        });
      }

      $scope.newThing = null;
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('category');
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
