// This should be linked to the model in models/User
// TODO add typescript to angular

var ox = angular.module('oxstututors');

ox.controller('InboxCtrl', ['$scope', 'Message', 'User', function($scope, Message, User) {
  $scope.userBase = User.allUsers();

  $scope.test = "Andrei";

  $scope.filterUserBase = function() {
    return $scope.userBase.filter(function(user) {
      var lowercaseUserName = angular.lowercase(user.username);
      var lowercaseSearchText = angular.lowercase($scope.searchText);
      return (lowercaseUserName && lowercaseUserName.indexOf(lowercaseSearchText) == 0);
    })
  };

  $scope.sendMessage = function() {
    var message = {
      from: $scope.currentUser,
      to: $scope.receiver,
      message: $scope.message
    };
    Message.post(message);
  }
}]);
