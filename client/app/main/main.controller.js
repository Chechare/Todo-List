'use strict';
angular.module('toDocomApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];
    $scope.categories = [];
    $scope.newTag = {name:'', count:0};
    $scope.newThing  = null;

    $http.get('/api/things/').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $http.get('/api/category').success(function(categories) {
      $scope.categories = categories;
      socket.syncUpdates('category', $scope.categories);
    });

    //Agregar una categoría nueva
    $scope.addTag = function(){
      if($scope.newTag === undefined){
        return;
      }
      $http.post('/api/category', $scope.newTag).success(function(){
        $scope.newTag= null;
      });
    };

    //Renombrar una categoría
    $scope.renameTag = function(tag){
      if($scope.newTag.name === undefined){
        return;
      }

      $http.put('/api/category/'+tag._id, {
        name: $scope.newTag.name
      }).sucess(function(){
        $scope.newTag= null;
      });

    };

    //Eliminar una categoría
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
    };

    //Crear una tarea nueva
    $scope.addThing = function() {
      if($scope.newThing.name === undefined) {
        return;
      }

      if($scope.newThing.tag !== '' && $scope.newThing.tag !== null && $scope.newThing.tag !== undefined){
        $http.get('/api/category/{"name":"'+$scope.newThing.tag+'"}').success(function(array) {

          if(array.length === 0){
            console.log('new tag');
            $scope.newTag.name = $scope.newThing.tag;
            $scope.newTag.count = 1;
            $http.post('/api/category', $scope.newTag).success(function(){
              $http.get('/api/category/{"name":"'+$scope.newThing.tag+'"}').success(function(array){
                  $scope.newThing.tag=array[0]._id;
                  $http.post('/api/things', $scope.newThing);
                  $scope.newThing = null;
              });
            });

          }else{
            console.log('Exiting tag');
            array[0].count++;
            $http.put('/api/category/' + array[0]._id, array[0]);
            $scope.newThing.tag=array[0]._id;
            $http.post('/api/things', $scope.newThing);
            $scope.newThing = null;
          }
      });
      }else{
        console.log('No tag');
        $http.post('/api/things', $scope.newThing);
        $scope.newThing = null;
      }
    };

    //Eliminar una tarea
    $scope.deleteThing = function(thing) {
      if(!thing.completed && thing.tag !== null){
        var i = 0;
        while($scope.categories[i]._id !== thing.tag ){
          i++;
        }
        $scope.categories[i].count--;
        $http.put('/api/category/'+thing.tag, $scope.categories[i]);
      }
      $http.delete('/api/things/'+thing._id);

    };  //--------------------------------Editar una tarea---------------------------/

    $scope.changeTodo = function(task, input){
        var taskEdited = {};
        if(input === null){
          return;
        }

        taskEdited._id=task._id;

        if(input.name !== null ){
          taskEdited.name = input.name;
        }

        if(input.info !== null ){
          taskEdited.info = input.info;
        }

        if(input.tag !== null){
          $http.get('/api/category/{"name":"'+input.tag+'"}').success(function(array) {

            if(array.length === 0){
              var newTag = {
                  name : input.tag,
                  count: 1
              };
              $http.post('/api/category', newTag).success(function(){
                $http.get('/api/category/{"name":"'+input.tag+'"}').success(function(array){
                  console.log(array);
                  taskEdited.tag = array[0]._id;
                  $http.put('/api/things/'+taskEdited._id, taskEdited);
                });
              });
            }else{

              $http.put('/api/category/' + task.tag, {count: $scope.getTagCount(task.tag) - 1});

              array[0].count++;
              $http.put('/api/category/' + array[0]._id, array[0]);
              taskEdited.tag=array[0]._id;
              $http.put('/api/things/'+taskEdited._id, taskEdited   );
              input = null;
            }
          });
        }else{
          $http.put('/api/things/'+taskEdited._id, taskEdited);
          $scope.newThing = null;
        }
      };

    //Marcar/desmarcar una tarea como completada
    $scope.check =  function(task){
      task.completed = !task.completed;
      if(task.tag !== null){
        var i = 0;
        while($scope.categories[i]._id !== task.tag ){
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

    //Abrir los detalles de la tarea
    $scope.changeChevron = function(id){
      if(document.getElementById(id).className==='fa fa-chevron-down' ){
        document.getElementById(id).className='fa fa-chevron-up';
      }else{
        document.getElementById(id).className='fa fa-chevron-down';
      }
    };

    //Buscar un tag dentro del arreglo local
    $scope.getTag = function(id){
      for(var i = 0; i < $scope.categories.length; i++){
        if($scope.categories[i]._id === id){
          return $scope.categories[i].name;
        }
      }
      return null;
    };

    $scope.getTagCount = function(id){
      for(var i = 0; i < $scope.categories.length; i++){
        if($scope.categories[i]._id === id){
          return $scope.categories[i].count;
        }
      }
      return null;
    };

  });
