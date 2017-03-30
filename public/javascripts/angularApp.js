var app = angular.module('messageQueue',['ui.router']);



app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'msgQueue'
    });

  $urlRouterProvider.otherwise('home');

}]);
app.factory('queueService',['$http', function($http){
    var o  = {};
    o.get = function(data){
      return $http.get('/helo');
    }
    o.produce = function(data){
        return $http.post('/produce', {data});
    }
    return o;

}]);
app.controller('msgQueue',['$scope','queueService', function($scope, queueService){
    $scope.prodMsgArea = '';
    $scope.consMsgArea = '';
    $scope.produce = function(){
        if($scope.msgBox)
        queueService.produce($scope.msgBox).success(function(data){

            $scope.prodMsgArea += $scope.msgBox+'\n';
            $scope.msgBox = '';

            console.log(data);
        })
    }
    socket.on('data',function(data) {
      console.log("consumer"+data);
      $scope.consMsgArea += data+'\n';
    })
}]);
