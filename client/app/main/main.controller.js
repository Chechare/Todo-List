'use strict';
angular.module('toDocomApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];
    $scope.categories = [];
    $scope.newTag = {name:"", count:0};

    $http.get('/api/things/').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $http.get('/api/category').success(function(categories) {
      $scope.categories = categories;
      socket.syncUpdates('category', $scope.categories);
    });

    $scope.addTag = function(){
      if($Scope.newTag == null){
        return;
      }
      $http.post('/api/category', $scope.newTag);
      $scope.newTag = null;
    };

    $scope.renameTag = function(tag){
      if(tag.name == null){
        return;
      }

      $http.put('/api/category/'+tag._id, {
        name: $scope.newTag.name
      });
      $scope.newTag=null;
    }

    $scope.deleteTag = function(tag){
      if(tag.count > 0){
        var id = tag._id;

        $http.get('api/things/{"tag":"'+id+'"}').success(function(result){
          for(var i = 0; i < result.length; i++){
            $http.put('/api/things/'+result[i]._id, {
              tag: null
            });
          }
        });
      }
      $http.delete('/api/category/' + tag._id);
    }

    $scope.addThing = function() {
      var result = null;
      if($scope.newThing.name == null) {
        return;
      }

      if(!($scope.newThing.tag == undefined)){
        $http.get('/api/category/{"name":"'+$scope.newThing.tag+'"}').success(function(array) {
          result=array;

          if(result.length == 0){
            $scope.newTag.name = $scope.newThing.tag;
            $scope.newTag.count = 1;
            $http.post('/api/category', $scope.newTag).success(function(){
              $http.get('/api/category/{"name":"'+$scope.newThing.tag+'"}').success(
                function(array){
                  result=array;
                  $scope.newThing.tag=result[0]._id;
                  $http.post('/api/things', $scope.newThing);
                  $scope.newThing = null;
                })
            });

          }else{
            result[0].count++;
            $http.put('/api/category/' + result[0]._id, result[0]);
            $scope.newThing.tag=result[0]._id;
            $http.post('/api/things', $scope.newThing);
            $scope.newThing = null;
          }
        });
      }else{
        $http.post('/api/things', $scope.newThing);
        $scope.newThing = null;
      }
    };

    $scope.deleteThing = function(thing) {
      if(!thing.completed && thing.tag != null){
        var i = 0;
        while($scope.categories[i]._id != thing.tag ){
          i++;
        }
        $scope.categories[i].count--;
        $http.put('/api/category/'+thing.tag, $scope.categories[i]);
      }
      $http.delete('/api/things/'+thing._id);

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
      if(task.tag != null){
        var i = 0;
        while($scope.categories[i]._id != task.tag ){
          i++;
        }

        if(task.completed){
            $scope.categories[i].count--;
        }else{
          $scope.categories[i].count++;
        }
        $http.put('/api/category/'+task.tag, $scope.categories[i]);
      }
      $http.put('/api/things/' + task._id, task);
    };

    $scope.changeChevron = function(id){
      if(document.getElementById(id).className=="fa fa-chevron-down" ){
        document.getElementById(id).className="fa fa-chevron-up";
      }else{
        document.getElementById(id).className="fa fa-chevron-down";
      }
    }

    $scope.getTag = function(id){
      for(var i = 0; i < $scope.categories.length; i++){
        if($scope.categories[i]._id == id){
          return $scope.categories[i].name;
        }
      }
      return null;
    }

  });
